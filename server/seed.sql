USE campusiq;

INSERT INTO departments (name)
VALUES ('Computer Science and Engineering')
ON DUPLICATE KEY UPDATE name = VALUES(name);

SET @dept = (SELECT id FROM departments WHERE name = 'Computer Science and Engineering');

INSERT INTO faculty (faculty_id, name, email, department_id)
VALUES ('FAC001', 'Dr. Ananya Rao', 'ananya.rao@college.edu', @dept)
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), department_id = VALUES(department_id);

SET @faculty = (SELECT id FROM faculty WHERE faculty_id = 'FAC001');

INSERT INTO hods (hod_id, name, email, department_id)
VALUES ('HOD001', 'Dr. Rajesh Kumar', 'rajesh.kumar@college.edu', @dept)
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), department_id = VALUES(department_id);

INSERT INTO students (student_id, name, email, phone, department_id, semester, section)
VALUES
('1MS24CS101', 'Harsha', 'harsha@campusiq.com', '9000000001', @dept, 5, 'A'),
('1MS24CS102', 'Rahul', 'rahul@campusiq.com', '9000000002', @dept, 5, 'A'),
('1MS24CS103', 'Ananya', 'ananya@campusiq.com', '9000000003', @dept, 5, 'A'),
('1MS24CS104', 'Kiran', 'kiran@campusiq.com', '9000000004', @dept, 5, 'A'),
('1MS24CS108', 'Trisha D M', 'trisha@student.college.edu', '9000000005', @dept, 5, 'A')
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), phone = VALUES(phone), department_id = VALUES(department_id), semester = VALUES(semester), section = VALUES(section);

INSERT INTO subjects (code, name, department_id, semester, section, faculty_id)
VALUES
('CS501', 'Computer Networks', @dept, 5, 'A', @faculty),
('CS502', 'Operating Systems', @dept, 5, 'A', @faculty),
('CS503', 'DBMS', @dept, 5, 'A', @faculty)
ON DUPLICATE KEY UPDATE name = VALUES(name), faculty_id = VALUES(faculty_id);
