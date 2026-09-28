# CampusIQ Backend

This is the first backend step for CampusIQ. It uses Node.js, Express and MySQL.

## 1. Create the database

Open MySQL Workbench (or MySQL command line) and run:

```sql
SOURCE path/to/server/schema.sql;
SOURCE path/to/server/seed.sql;
```

Or copy/paste the two SQL files into MySQL Workbench and run them.

## 2. Configure the backend

Copy `.env.example` to `.env` and put your MySQL password in `DB_PASSWORD`.

## 3. Install and start

Open PowerShell inside the `server` folder:

```powershell
npm install
npm run dev
```

The backend runs at `http://localhost:5000`.

Test:

`http://localhost:5000/api/health`

## Main API flows

- `GET /api/students` — student records
- `GET /api/subjects?facultyId=1` — faculty subjects
- `POST /api/attendance` — save a day's attendance
- `GET /api/attendance/student/:studentId` — subject-wise + overall attendance percentage
- `GET /api/events` — events + registration counts
- `POST /api/events` — HOD creates an event
- `POST /api/events/:eventId/register` — student registers
- `DELETE /api/events/:eventId/register/:studentId` — cancel registration
- `GET /api/events/:eventId/registrations` — HOD sees registered student details

## Frontend attendance flow

The React Attendance page now uses these backend endpoints:
- `GET /api/faculty?email=...`
- `GET /api/subjects?facultyId=...`
- `GET /api/subjects/:subjectId/students`
- `POST /api/attendance`
- `GET /api/students`
- `GET /api/attendance/student/:studentId`

Faculty attendance is saved by date. Student attendance totals and percentages are calculated from the saved records automatically.
