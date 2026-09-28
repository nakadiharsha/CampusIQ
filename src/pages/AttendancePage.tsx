import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const API = 'http://localhost:5000/api';

type BackendStudent = {
  id: number;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  semester: number;
  section: string;
};

type BackendSubject = {
  id: number;
  code: string;
  name: string;
  semester: number;
  section: string;
  facultyId: number;
};

type AttendanceResult = {
  subjectId: number;
  code: string;
  subject: string;
  total: number;
  present: number;
  absent: number;
  percent: number | null;
};

export const AttendancePage: React.FC = () => {
  const { user } = useApp();
  const [subjects, setSubjects] = useState<BackendSubject[]>([]);
  const [students, setStudents] = useState<BackendStudent[]>([]);
  const [records, setRecords] = useState<Record<number, boolean>>({});
  const [attendance, setAttendance] = useState<AttendanceResult[]>([]);
  const [overall, setOverall] = useState({ total: 0, present: 0, absent: 0, percent: 0 });
  const [subjectId, setSubjectId] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedSubject = useMemo(
    () => subjects.find((subject) => String(subject.id) === subjectId),
    [subjects, subjectId]
  );

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoading(true);
        setError('');
        let query = '';
        if (user.role === 'faculty') {
          const facultyResponse = await fetch(`${API}/faculty?email=${encodeURIComponent(user.email)}`);
          if (!facultyResponse.ok) throw new Error('Faculty account was not found in the database.');
          const faculty = await facultyResponse.json();
          query = `?facultyId=${faculty.id}`;
        }
        const response = await fetch(`${API}/subjects${query}`);
        if (!response.ok) throw new Error('Could not load subjects.');
        const data: BackendSubject[] = await response.json();
        setSubjects(data);
        if (data.length) setSubjectId(String(data[0].id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not connect to the backend.');
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, [user.role]);

  useEffect(() => {
    if (user.role !== 'faculty' || !subjectId) return;

    const loadStudentsAndAttendance = async () => {
      try {
        setError('');
        const [studentsResponse, attendanceResponse] = await Promise.all([
          fetch(`${API}/subjects/${subjectId}/students`),
          fetch(`${API}/attendance/subject/${subjectId}?date=${attendanceDate}`)
        ]);
        if (!studentsResponse.ok) throw new Error('Could not load students.');
        if (!attendanceResponse.ok) throw new Error('Could not load attendance for this date.');

        const data: BackendStudent[] = await studentsResponse.json();
        const existing: { id: number; status: 'Present' | 'Absent' }[] = await attendanceResponse.json();
        setStudents(data);
        const existingMap = Object.fromEntries(existing.map((record) => [record.id, record.status === 'Present']));
        setRecords(Object.fromEntries(data.map((student) => [student.id, existingMap[student.id] ?? true])));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load students.');
      }
    };
    loadStudentsAndAttendance();
  }, [subjectId, attendanceDate, user.role]);

  useEffect(() => {
    if (user.role !== 'student' || !user.usn) return;

    const loadAttendance = async () => {
      try {
        const studentResponse = await fetch(`${API}/students`);
        if (!studentResponse.ok) throw new Error('Could not load student data.');
        const allStudents: BackendStudent[] = await studentResponse.json();
        const student = allStudents.find((item) => item.studentId === user.usn);
        if (!student) throw new Error('Your student record was not found in the database.');

        const response = await fetch(`${API}/attendance/student/${student.id}`);
        if (!response.ok) throw new Error('Could not load attendance.');
        const data = await response.json();
        setAttendance(data.subjects);
        setOverall({
          total: Number(data.overall?.total || 0),
          present: Number(data.overall?.present || 0),
          absent: Number(data.overall?.absent || 0),
          percent: Number(data.overall?.percent || 0)
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load attendance.');
      }
    };
    loadAttendance();
  }, [user.role, user.usn, saved]);

  const save = async () => {
    if (!selectedSubject || !students.length) return;
    try {
      setError('');
      setSaved(false);
      const facultyResponse = await fetch(`${API}/faculty?email=${encodeURIComponent(user.email)}`);
      if (!facultyResponse.ok) throw new Error('Faculty account was not found in the database.');
      const faculty = await facultyResponse.json();

      const response = await fetch(`${API}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: selectedSubject.id,
          facultyId: faculty.id,
          attendanceDate,
          records: students.map((student) => ({
            studentId: student.id,
            status: records[student.id] ? 'Present' : 'Absent'
          }))
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save attendance.');
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save attendance.');
    }
  };

  if (loading && user.role === 'faculty') {
    return <div className="p-6 text-sm text-[#667085]">Loading attendance...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F3A5F]">Attendance</h1>
        <p className="text-sm text-[#667085] mt-1">
          {user.role === 'faculty'
            ? 'Mark daily attendance. The system calculates student attendance automatically.'
            : 'Your attendance is calculated automatically from every class marked by faculty.'}
        </p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>}

      {user.role === 'faculty' ? (
        <div className="bg-white border rounded-lg p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setSaved(false); }} className="border rounded p-2.5 text-sm min-w-64">
              {!subjects.length && <option value="">Select Subject</option>}
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name} - Section {subject.section}</option>)}
            </select>
            <input type="date" value={attendanceDate} onChange={(e) => { setAttendanceDate(e.target.value); setSaved(false); }} className="border rounded p-2.5 text-sm" />
            <button type="button" onClick={save} className="px-4 py-2 bg-[#1F3A5F] text-white rounded text-sm font-bold">
              Save Attendance
            </button>
            {saved && <span className="text-sm font-semibold text-[#2F7D6D] flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Attendance saved</span>}
          </div>

          <div className="border rounded-lg overflow-hidden">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between border-b last:border-b-0 px-4 py-3 text-sm">
                <span><strong>{student.studentId}</strong> — {student.name}</span>
                <select
                  value={records[student.id] ? 'Present' : 'Absent'}
                  onChange={(e) => { setRecords({ ...records, [student.id]: e.target.value === 'Present' }); setSaved(false); }}
                  className="border rounded p-2 text-sm"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
            ))}
            {!students.length && <div className="p-4 text-sm text-[#667085]">No students found for this subject and section.</div>}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border rounded-lg p-5">
            <h2 className="font-bold text-[#1F3A5F]">Overall Attendance</h2>
            <div className="grid sm:grid-cols-4 gap-4 mt-4">
              <div><p className="text-xs text-[#667085]">Total Classes</p><p className="text-2xl font-extrabold">{overall.total}</p></div>
              <div><p className="text-xs text-[#667085]">Classes Attended</p><p className="text-2xl font-extrabold">{overall.present}</p></div>
              <div><p className="text-xs text-[#667085]">Classes Absent</p><p className="text-2xl font-extrabold">{overall.absent}</p></div>
              <div><p className="text-xs text-[#667085]">Attendance</p><p className="text-2xl font-extrabold text-[#1F3A5F]">{overall.percent}%</p></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {attendance.map((item) => (
              <div key={item.subjectId} className="bg-white border rounded-lg p-5">
                <CheckCircle2 className="w-5 h-5 text-[#2F7D6D]" />
                <h3 className="font-bold mt-3">{item.subject}</h3>
                <p className="text-2xl font-extrabold text-[#1F3A5F] mt-2">{item.percent ?? 0}%</p>
                <p className="text-xs text-[#667085] mt-1">Classes conducted: {item.total}</p>
                <p className="text-xs text-[#667085]">Classes attended: {item.present}</p>
                <p className="text-xs text-[#667085]">Classes absent: {item.absent}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
