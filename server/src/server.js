import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch (error) {
    res.status(500).json({ ok: false, database: 'disconnected', error: error.message });
  }
});

app.get('/api/students', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.student_id AS studentId, s.name, s.email, s.phone,
             d.name AS department, s.semester, s.section
      FROM students s
      JOIN departments d ON d.id = s.department_id
      ORDER BY s.student_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/students/:studentId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.student_id AS studentId, s.name, s.email, s.phone,
             d.name AS department, s.semester, s.section
      FROM students s
      JOIN departments d ON d.id = s.department_id
      WHERE s.student_id = ?
    `, [req.params.studentId]);
    if (!rows.length) return res.status(404).json({ error: 'Student not found.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/faculty', async (req, res) => {
  try {
    const { email } = req.query;
    const [rows] = await pool.query(
      'SELECT id, faculty_id AS facultyId, name, email, department_id AS departmentId FROM faculty WHERE email = ?',
      [email]
    );
    if (!rows.length) return res.status(404).json({ error: 'Faculty not found.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/subjects', async (req, res) => {
  try {
    const { facultyId } = req.query;
    const [rows] = await pool.query(`
      SELECT id, code, name, semester, section, faculty_id AS facultyId
      FROM subjects
      ${facultyId ? 'WHERE faculty_id = ?' : ''}
      ORDER BY name
    `, facultyId ? [facultyId] : []);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/subjects/:subjectId/students', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.student_id AS studentId, s.name, s.email, s.phone,
             d.name AS department, s.semester, s.section
      FROM subjects sub
      JOIN students s ON s.semester = sub.semester AND s.section = sub.section AND s.department_id = sub.department_id
      JOIN departments d ON d.id = s.department_id
      WHERE sub.id = ?
      ORDER BY s.student_id
    `, [req.params.subjectId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/attendance/subject/:subjectId', async (req, res) => {
  try {
    const attendanceDate = req.query.date;
    if (!attendanceDate) return res.status(400).json({ error: 'date is required.' });
    const [rows] = await pool.query(`
      SELECT s.id, s.student_id AS studentId, s.name,
             COALESCE(a.status, 'Present') AS status
      FROM subjects sub
      JOIN students s ON s.semester = sub.semester
        AND s.section = sub.section
        AND s.department_id = sub.department_id
      LEFT JOIN attendance a ON a.student_id = s.id
        AND a.subject_id = sub.id
        AND a.attendance_date = ?
      WHERE sub.id = ?
      ORDER BY s.student_id
    `, [attendanceDate, req.params.subjectId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/attendance', async (req, res) => {
  const { subjectId, facultyId, attendanceDate, records } = req.body;
  if (!subjectId || !facultyId || !attendanceDate || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ error: 'subjectId, facultyId, attendanceDate and records are required.' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const record of records) {
      if (!record.studentId || !['Present', 'Absent'].includes(record.status)) {
        throw new Error('Each record needs studentId and status Present/Absent.');
      }
      await connection.execute(`
        INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE status = VALUES(status), faculty_id = VALUES(faculty_id)
      `, [record.studentId, subjectId, facultyId, attendanceDate, record.status]);
    }
    await connection.commit();
    res.json({ message: 'Attendance saved successfully.', saved: records.length });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
});

app.get('/api/attendance/student/:studentId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT sub.id AS subjectId, sub.code, sub.name AS subject,
             COUNT(a.id) AS total,
             COALESCE(SUM(a.status = 'Present'), 0) AS present,
             COALESCE(SUM(a.status = 'Absent'), 0) AS absent,
             ROUND(COALESCE(SUM(a.status = 'Present'), 0) / NULLIF(COUNT(a.id), 0) * 100, 2) AS percent
      FROM subjects sub
      LEFT JOIN attendance a ON a.subject_id = sub.id AND a.student_id = ?
      GROUP BY sub.id, sub.code, sub.name
      ORDER BY sub.name
    `, [req.params.studentId]);

    const [overall] = await pool.query(`
      SELECT COUNT(*) AS total,
             COALESCE(SUM(status = 'Present'), 0) AS present,
             COALESCE(SUM(status = 'Absent'), 0) AS absent,
             ROUND(COALESCE(SUM(status = 'Present'), 0) / NULLIF(COUNT(*), 0) * 100, 2) AS percent
      FROM attendance
      WHERE student_id = ?
    `, [req.params.studentId]);

    res.json({ subjects: rows, overall: overall[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.id, e.title, e.event_date AS eventDate, e.location, e.description,
             h.name AS createdBy,
             COUNT(er.id) AS registrationCount
      FROM events e
      JOIN hods h ON h.id = e.created_by_hod_id
      LEFT JOIN event_registrations er ON er.event_id = e.id
      GROUP BY e.id, h.name
      ORDER BY e.event_date ASC, e.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  const { title, eventDate, location, description, hodId } = req.body;
  if (!title || !eventDate || !location || !hodId) {
    return res.status(400).json({ error: 'title, eventDate, location and hodId are required.' });
  }
  try {
    const [result] = await pool.execute(`
      INSERT INTO events (title, event_date, location, description, created_by_hod_id)
      VALUES (?, ?, ?, ?, ?)
    `, [title, eventDate, location, description || '', hodId]);
    res.status(201).json({ id: result.insertId, message: 'Event created successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/events/:eventId/register', async (req, res) => {
  const { studentId } = req.body;
  if (!studentId) return res.status(400).json({ error: 'studentId is required.' });
  try {
    await pool.execute(`
      INSERT INTO event_registrations (event_id, student_id)
      VALUES (?, ?)
    `, [req.params.eventId, studentId]);
    res.status(201).json({ message: 'Student registered successfully.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Student is already registered for this event.' });
    }
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/events/:eventId/register/:studentId', async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM event_registrations WHERE event_id = ? AND student_id = ?',
      [req.params.eventId, req.params.studentId]
    );
    res.json({ message: 'Registration cancelled.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events/:eventId/registrations', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.student_id AS studentId, s.name, s.email, s.phone,
             d.name AS department, s.semester, s.section,
             er.registered_at AS registeredAt
      FROM event_registrations er
      JOIN students s ON s.id = er.student_id
      JOIN departments d ON d.id = s.department_id
      WHERE er.event_id = ?
      ORDER BY er.registered_at DESC
    `, [req.params.eventId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM students WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const student = rows[0];

    res.json({
      success: true,
      user: {
        id: student.id,
        usn: student.student_id,
        name: student.name,
        email: student.email,
        role: 'student'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.listen(PORT, () => {
  console.log(`CampusIQ backend running on http://localhost:${PORT}`);
});
