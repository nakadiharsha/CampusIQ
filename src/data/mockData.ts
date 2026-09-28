import type {
  User,
  KnowledgeDocument,
  MemoryItem,
  Workflow,
  ApprovalItem,
  AuditEvent,
  ChatMessage,
  Source,
  StudentItem,
  FacultyItem,
  DepartmentStats
} from '../types';

// ============================================================================
// DEMO USERS (STUDENT, FACULTY, HOD)
// ============================================================================

export const studentUser: User = {
  id: 'usr-student',
  name: 'Trisha D M',
  email: 'trisha@student.college.edu',
  role: 'student',
  departmentId: 'dept-cse',
  departmentName: 'Computer Science and Engineering',
  department: 'Computer Science and Engineering',
  program: 'B.E. Computer Science and Engineering',
  year: '3rd Year',
  usn: '1MS24CS108',
  avatar: 'TD',
  permissions: [
    'knowledge.read',
    'memory.read.self',
    'memory.edit.self',
    'workflow.create',
    'workflow.read.self',
    'workflow.approve.self',
    'students.read.self',
    'audit.read.self'
  ]
};

export const facultyUser: User = {
  id: 'usr-faculty',
  name: 'Dr. Ananya Rao',
  email: 'ananya.rao@college.edu',
  role: 'faculty',
  title: 'Associate Professor',
  departmentId: 'dept-cse',
  departmentName: 'Computer Science and Engineering',
  department: 'Computer Science and Engineering',
  avatar: 'AR',
  permissions: [
    'knowledge.read',
    'knowledge.upload',
    'memory.read.self',
    'memory.edit.self',
    'workflow.create',
    'workflow.read.self',
    'workflow.read.department',
    'students.read.department',
    'audit.read.self'
  ]
};

export const hodUser: User = {
  id: 'usr-hod',
  name: 'Dr. Rajesh Kumar',
  email: 'rajesh.kumar@college.edu',
  role: 'hod',
  title: 'Head of Department & Professor',
  departmentId: 'dept-cse',
  departmentName: 'Computer Science and Engineering',
  department: 'Computer Science and Engineering',
  avatar: 'RK',
  permissions: [
    'knowledge.read',
    'knowledge.upload',
    'knowledge.edit',
    'knowledge.delete',
    'memory.read.self',
    'memory.edit.self',
    'workflow.create',
    'workflow.read.department',
    'workflow.approve.department',
    'students.read.department',
    'faculty.read.department',
    'analytics.read.department',
    'approval.manage.department',
    'audit.read.department',
    'department.manage'
  ]
};

export const demoAccounts: { [key: string]: { user: User; passwordHint: string } } = {
  'trisha@student.college.edu': { user: studentUser, passwordHint: 'student123' },
  'student@campusiq.demo': { user: studentUser, passwordHint: 'student123' },
  'ananya.rao@college.edu': { user: facultyUser, passwordHint: 'faculty123' },
  'faculty@campusiq.demo': { user: facultyUser, passwordHint: 'faculty123' },
  'rajesh.kumar@college.edu': { user: hodUser, passwordHint: 'hod123' },
  'hod@campusiq.demo': { user: hodUser, passwordHint: 'hod123' }
};

export const currentUser: User = studentUser;

// ============================================================================
// DEPARTMENT METRICS & ENTITIES FOR HOD / FACULTY SCOPE
// ============================================================================

export const cseDepartmentStats: DepartmentStats = {
  facultyCount: 32,
  studentCount: 842,
  pendingRequestsCount: 14,
  departmentDocumentsCount: 128,
  pendingApprovalsCount: 7,
  activeCoursesCount: 24
};

export const mockStudentsList: StudentItem[] = [
  {
    id: 'std-101',
    name: 'Trisha D M',
    usn: '1MS24CS108',
    email: 'trisha@student.college.edu',
    department: 'Computer Science and Engineering',
    program: 'B.E. Computer Science and Engineering',
    year: '3rd Year',
    cgpa: '9.24',
    attendance: '91.5%',
    pendingRequestsCount: 1,
    status: 'Active'
  },
  {
    id: 'std-102',
    name: 'Rahul V Sharma',
    usn: '1MS24CS092',
    email: 'rahul.s@student.college.edu',
    department: 'Computer Science and Engineering',
    program: 'B.E. Computer Science and Engineering',
    year: '3rd Year',
    cgpa: '8.85',
    attendance: '87.0%',
    pendingRequestsCount: 2,
    status: 'Active'
  },
  {
    id: 'std-103',
    name: 'Priya N Kulkarni',
    usn: '1MS24CS084',
    email: 'priya.k@student.college.edu',
    department: 'Computer Science and Engineering',
    program: 'B.E. Computer Science and Engineering',
    year: '3rd Year',
    cgpa: '9.50',
    attendance: '94.2%',
    pendingRequestsCount: 0,
    status: 'Active'
  },
  {
    id: 'std-104',
    name: 'Aditya P Nair',
    usn: '1MS23CS012',
    email: 'aditya.n@student.college.edu',
    department: 'Computer Science and Engineering',
    program: 'B.E. Computer Science and Engineering',
    year: '4th Year',
    cgpa: '8.12',
    attendance: '86.4%',
    pendingRequestsCount: 1,
    status: 'Active'
  },
  {
    id: 'std-105',
    name: 'Sneha M Rao',
    usn: '1MS25CS140',
    email: 'sneha.r@student.college.edu',
    department: 'Computer Science and Engineering',
    program: 'B.E. Computer Science and Engineering',
    year: '2nd Year',
    cgpa: '9.01',
    attendance: '96.0%',
    pendingRequestsCount: 0,
    status: 'Active'
  }
];

export const mockFacultyList: FacultyItem[] = [
  {
    id: 'fac-201',
    name: 'Dr. Ananya Rao',
    title: 'Associate Professor',
    email: 'ananya.rao@college.edu',
    department: 'Computer Science and Engineering',
    specialization: 'Artificial Intelligence & Natural Language Processing',
    coursesAssigned: ['CS501: Operating Systems', 'CS504: Machine Learning'],
    activeResearchGrants: 2,
    status: 'Active'
  },
  {
    id: 'fac-202',
    name: 'Dr. Suresh V Hebbar',
    title: 'Professor',
    email: 'suresh.h@college.edu',
    department: 'Computer Science and Engineering',
    specialization: 'Distributed Systems & Cloud Computing',
    coursesAssigned: ['CS602: Distributed Systems', 'CS701: Cloud Architecture'],
    activeResearchGrants: 4,
    status: 'Active'
  },
  {
    id: 'fac-203',
    name: 'Prof. Kavitha B S',
    title: 'Assistant Professor',
    email: 'kavitha.bs@college.edu',
    department: 'Computer Science and Engineering',
    specialization: 'Database Systems & Information Retrieval',
    coursesAssigned: ['CS403: DBMS', 'CS505: Data Mining'],
    activeResearchGrants: 1,
    status: 'Active'
  },
  {
    id: 'fac-204',
    name: 'Dr. Vikramaditya M',
    title: 'Associate Professor',
    email: 'vikram.m@college.edu',
    department: 'Computer Science and Engineering',
    specialization: 'Cybersecurity & Cryptography',
    coursesAssigned: ['CS604: Network Security'],
    activeResearchGrants: 3,
    status: 'Active'
  }
];

// ============================================================================
// DOCUMENTS
// ============================================================================

export const initialDocuments: KnowledgeDocument[] = [
  {
    id: 'doc-101',
    title: 'Student Services Procedure',
    category: 'Procedure',
    pages: 42,
    chunkCount: 184,
    status: 'Indexed',
    updatedAt: '2026-02-14',
    fileType: 'PDF',
    department: 'Student Affairs',
    uploadedBy: 'Registrar Office',
    description: 'Standard operating procedures for student administrative services including certificates, identity cards, and official verification.',
    sections: [
      {
        id: 'sec-101-1',
        title: 'Section 4.2: Bonafide Certificate Issuance Procedure',
        pageNumber: 18,
        content: 'To request a Bonafide Certificate, an enrolled student must initiate the designated institutional application. The process requires specifying the exact purpose (Passport, Bank Loan, Internship, Bus Pass, Visa), confirming personal & academic credentials, and submitting the request for Student Services verification. Standard processing SLA is 24-48 institutional hours.'
      },
      {
        id: 'sec-101-2',
        title: 'Section 4.3: Fee Receipt Verification',
        pageNumber: 20,
        content: 'Fee verification receipts must be attached or referenced via USN validation prior to document endorsement by the Registrar.'
      }
    ]
  },
  {
    id: 'doc-102',
    title: 'Academic Procedures Handbook',
    category: 'Handbook',
    pages: 96,
    chunkCount: 340,
    status: 'Indexed',
    updatedAt: '2026-01-10',
    fileType: 'PDF',
    department: 'Academic Section',
    uploadedBy: 'Dean Academics',
    description: 'Comprehensive guidelines on course registration, attendance policies, certificate requests, credit transfer, and academic evaluation.',
    sections: [
      {
        id: 'sec-102-1',
        title: 'Section 4.2: Official Institutional Documents & Credentials',
        pageNumber: 34,
        content: 'All official student certificates (Bonafide, Conduct, Transcript) require pre-authorization through the digital workflow approval pipeline. Students must submit an explicit request outlining administrative purpose.'
      }
    ]
  },
  {
    id: 'doc-103',
    title: 'Academic Regulations 2026',
    category: 'Regulation',
    pages: 128,
    chunkCount: 450,
    status: 'Indexed',
    updatedAt: '2026-01-05',
    fileType: 'PDF',
    department: 'Academic Council',
    uploadedBy: 'Academic Registrar',
    description: 'Governance rules detailing attendance requirement (min 85%), grading schemes, CGPA calculation, and re-evaluation procedures.',
    sections: [
      {
        id: 'sec-103-1',
        title: 'Article 8: Attendance Norms',
        pageNumber: 22,
        content: 'Minimum 85% attendance is mandatory in all registered courses. Condonation up to 10% may be granted on medical grounds upon HOD recommendation.'
      }
    ]
  },
  {
    id: 'doc-104',
    title: 'Faculty Code of Conduct & Teaching Protocols',
    category: 'Policy',
    pages: 48,
    chunkCount: 160,
    status: 'Indexed',
    updatedAt: '2026-01-15',
    fileType: 'PDF',
    department: 'Academic Affairs',
    uploadedBy: 'HOD CSE',
    description: 'Faculty responsibilities, course syllabus coverage timelines, evaluation moderation, and consultancy project approval norms.',
    sections: []
  },
  {
    id: 'doc-105',
    title: 'CSE Department Research Subsidy Circular 2026',
    category: 'Circular',
    pages: 12,
    chunkCount: 44,
    status: 'Needs Review',
    updatedAt: '2026-03-10',
    fileType: 'PDF',
    department: 'Computer Science and Engineering',
    uploadedBy: 'Dr. Ananya Rao',
    description: 'Internal departmental guidelines for faculty travel grants and student publication fee reimbursement.',
    sections: []
  }
];

// ============================================================================
// MEMORIES
// ============================================================================

export const initialMemoryItems: MemoryItem[] = [
  {
    id: 'mem-001',
    category: 'Academic Context',
    title: 'Program Enrollment',
    description: 'B.E. Computer Science and Engineering',
    date: 'Active context',
    enabled: true,
    key: 'Program',
    value: 'Computer Science and Engineering',
    ownerId: 'usr-student'
  },
  {
    id: 'mem-002',
    category: 'Academic Context',
    title: 'Academic Level',
    description: 'Third Year (Semester 5)',
    date: 'Active context',
    enabled: true,
    key: 'Year',
    value: 'Third Year',
    ownerId: 'usr-student'
  },
  {
    id: 'mem-003',
    category: 'Preferences',
    title: 'Communication Style',
    description: 'Concise, source-grounded answers with direct policy references.',
    date: 'Set by user',
    enabled: true,
    key: 'Preferred Communication',
    value: 'Concise',
    ownerId: 'usr-student'
  },
  {
    id: 'mem-004',
    category: 'Academic Context',
    title: 'Faculty Teaching Specialization',
    description: 'CS504 Machine Learning & CS501 Operating Systems',
    date: 'Active context',
    enabled: true,
    key: 'Specialization',
    value: 'AI & Machine Learning',
    ownerId: 'usr-faculty'
  },
  {
    id: 'mem-005',
    category: 'Academic Context',
    title: 'Departmental Governance Priorities',
    description: 'NBA Accreditation compliance & AI Research Grant Allocations',
    date: 'Active context',
    enabled: true,
    key: 'HOD Directives',
    value: 'Accreditation & Grants',
    ownerId: 'usr-hod'
  }
];

// ============================================================================
// WORKFLOWS BY ROLE
// ============================================================================

export const initialWorkflows: Workflow[] = [
  {
    id: 'wf-bonafide',
    title: 'Bonafide Certificate Request',
    category: 'Student Credentials',
    description: 'Prepare an official bonafide certificate request using institutional procedures and verified student context.',
    requiredInfo: ['Purpose of Request', 'Department Verification', 'Passport/Loan/Bank details'],
    approvalRequirement: 'HOD / Student Services Sign-off',
    currentStatus: 'Available',
    targetDepartment: 'Student Services Department',
    allowedRoles: ['student']
  },
  {
    id: 'wf-leave',
    title: 'Student Leave Request (OD / Medical)',
    category: 'Academic Attendance',
    description: 'Submit leave request for sports competitions, hackathons, or medical reasons under Section 8.4 attendance policy.',
    requiredInfo: ['Leave Type', 'Start & End Dates', 'Supporting Certificate'],
    approvalRequirement: 'Class Advisor & HOD Approval',
    currentStatus: 'Available',
    targetDepartment: 'Department of Computer Science',
    allowedRoles: ['student']
  },
  {
    id: 'wf-doc-request',
    title: 'Official Document & Transcript Request',
    category: 'Academic Credentials',
    description: 'Request official grade cards, transcript copies, or duplicate ID cards from Registrar Office.',
    requiredInfo: ['Document Type', 'Number of copies', 'Fee Payment Reference'],
    approvalRequirement: 'Registrar Academic Sign-off',
    currentStatus: 'Available',
    targetDepartment: 'Registrar Office',
    allowedRoles: ['student']
  },
  {
    id: 'wf-faculty-grant',
    title: 'Faculty Research Grant Application',
    category: 'Academic & R&D',
    description: 'Submit proposal for seed research funding, conference travel subsidy, or lab equipment acquisition.',
    requiredInfo: ['Research Title', 'Budget Breakup', 'Target Journal / Conference'],
    approvalRequirement: 'HOD & Dean R&D Sign-off',
    currentStatus: 'Available',
    targetDepartment: 'CSE R&D Committee',
    allowedRoles: ['faculty']
  },
  {
    id: 'wf-faculty-leave',
    title: 'Faculty Duty Leave / Conference OD',
    category: 'Faculty Administration',
    description: 'Apply for academic duty leave for attending faculty development programs (FDP) or evaluation duty.',
    requiredInfo: ['Event Name', 'Dates', 'Alternate Class Arrangement'],
    approvalRequirement: 'HOD Sign-off',
    currentStatus: 'Available',
    targetDepartment: 'Department Head Office',
    allowedRoles: ['faculty']
  },
  {
    id: 'wf-hod-approval',
    title: 'Departmental Policy & Circular Endorsement',
    category: 'Department Management',
    description: 'Issue official departmental notifications, syllabus revisions, or lab access policy updates.',
    requiredInfo: ['Policy Subject', 'Target Audience', 'Effective Date'],
    approvalRequirement: 'HOD Executive Approval',
    currentStatus: 'Available',
    targetDepartment: 'Computer Science and Engineering',
    allowedRoles: ['hod']
  },
  {
    id: 'wf-hod-budget',
    title: 'Departmental Budget & Lab Allocation',
    category: 'Resource Management',
    description: 'Approve capital expenditure for AI computing servers, lab upgrade purchases, or guest lectures.',
    requiredInfo: ['Item Description', 'Estimated Expense', 'Vendor Quotation'],
    approvalRequirement: 'HOD & Principal Sign-off',
    currentStatus: 'Available',
    targetDepartment: 'Finance & Purchase Office',
    allowedRoles: ['hod']
  }
];

// ============================================================================
// SOURCES
// ============================================================================

export const sampleBonafideSources: Source[] = [
  {
    documentId: 'doc-101',
    documentTitle: 'Student Services Procedure',
    category: 'Procedure',
    pageNumber: 18,
    sectionTitle: 'Section 4.2: Bonafide Certificate Issuance Procedure',
    excerpt: 'To request a Bonafide Certificate, an enrolled student must initiate the designated institutional application. The process requires specifying the exact purpose, confirming student details, and submitting the request for approval.',
    relevanceScore: 0.96
  },
  {
    documentId: 'doc-102',
    documentTitle: 'Academic Procedures Handbook',
    category: 'Handbook',
    pageNumber: 34,
    sectionTitle: 'Section 4.2: Official Institutional Documents',
    excerpt: 'All official student certificates require pre-authorization through the digital workflow approval pipeline. Students must submit an explicit request outlining administrative purpose.',
    relevanceScore: 0.88
  }
];

// ============================================================================
// APPROVALS QUEUE
// ============================================================================

export const initialApprovals: ApprovalItem[] = [
  {
    id: 'app-501',
    applicationId: 'draft-901',
    workflowTitle: 'Bonafide Certificate Request',
    requestedAction: 'Submit application to Student Services Department',
    createdDate: 'Today, 2:42 PM',
    status: 'Pending Approval',
    assignedToRole: 'hod',
    applicantName: 'Trisha D M',
    applicantRole: 'student',
    department: 'Computer Science and Engineering',
    draft: {
      id: 'draft-901',
      workflowId: 'wf-bonafide',
      workflowTitle: 'Bonafide Certificate Request',
      recipientDepartment: 'Student Services Department',
      subject: 'Request for Issue of Bonafide Certificate — Trisha D M (1MS24CS108)',
      applicantName: 'Trisha D M',
      applicantId: '1MS24CS108',
      applicantRole: 'student',
      program: 'B.E. Computer Science and Engineering (3rd Year)',
      purpose: 'Passport Application and Administrative Verification',
      additionalInfo: 'Requires institutional seal endorsement for RPO verification.',
      generatedBody: `To,\nThe Head of Department / Student Services Officer,\nDepartment of Student Services,\nMSRIT Campus.\n\nSubject: Application for Issue of Bonafide Certificate\n\nRespected Sir/Madam,\n\nI am Trisha D M, currently enrolled as a Third Year student in the B.E. Computer Science and Engineering program (USN: 1MS24CS108) for the academic year 2025-2026.\n\nI kindly request you to issue a Bonafide Certificate for the purpose of Passport Application and Administrative Verification. As per Section 4.2 of the Student Services Procedure, I have attached all required academic identification details.\n\nThanking you.\n\nYours sincerely,\nTrisha D M\nUSN: 1MS24CS108\nDepartment of Computer Science & Engineering`,
      createdAt: 'Today, 2:42 PM',
      status: 'Pending Approval',
      sourcesUsed: sampleBonafideSources,
      policyReference: 'Student Services Procedure (Page 18, Section 4.2)'
    }
  },
  {
    id: 'app-502',
    applicationId: 'draft-902',
    workflowTitle: 'Faculty Duty Leave & Travel Grant',
    requestedAction: 'Approve Conference Duty Leave for Dr. Ananya Rao',
    createdDate: 'Yesterday, 11:15 AM',
    status: 'Pending Approval',
    assignedToRole: 'hod',
    applicantName: 'Dr. Ananya Rao',
    applicantRole: 'faculty',
    department: 'Computer Science and Engineering',
    draft: {
      id: 'draft-902',
      workflowId: 'wf-faculty-leave',
      workflowTitle: 'Faculty Duty Leave & Travel Grant',
      recipientDepartment: 'Department Head Office',
      subject: 'Duty Leave Application — International AI Conference Presentation',
      applicantName: 'Dr. Ananya Rao',
      applicantId: 'FAC-201',
      applicantRole: 'faculty',
      program: 'Associate Professor (CSE)',
      purpose: 'Paper presentation at IEEE AI Summit 2026',
      additionalInfo: 'Alternate teaching duty assigned to Prof. Kavitha B S.',
      generatedBody: `To,\nThe Head of Department,\nDepartment of Computer Science and Engineering,\nMSRIT Campus.\n\nSubject: Request for Duty Leave for IEEE AI Summit 2026\n\nRespected HOD,\n\nI request duty leave from March 28 to March 30, 2026, to present our accepted research paper at the IEEE AI Summit.\n\nI have arranged for Prof. Kavitha B S to handle my CS504 lectures during this duration.\n\nYours faithfully,\nDr. Ananya Rao\nAssociate Professor, CSE`,
      createdAt: 'Yesterday, 11:15 AM',
      status: 'Pending Approval',
      sourcesUsed: [
        {
          documentId: 'doc-104',
          documentTitle: 'Faculty Code of Conduct & Teaching Protocols',
          category: 'Policy',
          pageNumber: 14,
          sectionTitle: 'Section 3.1: Academic Duty Leave Norms',
          excerpt: 'Faculty members are eligible for up to 10 days of duty leave per academic year for presenting research papers at indexed international conferences.',
          relevanceScore: 0.95
        }
      ],
      policyReference: 'Faculty Code of Conduct (Page 14, Section 3.1)'
    }
  }
];

// ============================================================================
// AUDIT LOGS
// ============================================================================

export const initialAuditLogs: AuditEvent[] = [
  {
    id: 'audit-001',
    timestamp: '2026-09-25T14:42:00.000Z',
    timeFormatted: '2:42 PM',
    actor: 'Trisha D M (Student)',
    actorRole: 'student',
    action: 'Query Executed',
    resource: 'Ask CampusIQ / Chat Pipeline',
    status: 'Success',
    category: 'Questions',
    details: 'User asked: "What is the procedure for applying for a bonafide certificate?"',
    department: 'Computer Science and Engineering'
  },
  {
    id: 'audit-002',
    timestamp: '2026-09-25T14:42:05.000Z',
    timeFormatted: '2:42 PM',
    actor: 'CampusIQ RAG Engine',
    actorRole: 'system' as any,
    action: 'Document Retrieval',
    resource: 'Student Services Procedure (Page 18, Sec 4.2)',
    status: 'Success',
    category: 'Retrieval',
    details: 'Retrieved 2 relevant chunks from Student Services Procedure and Academic Procedures Handbook.',
    department: 'Computer Science and Engineering'
  },
  {
    id: 'audit-003',
    timestamp: '2026-09-25T14:43:00.000Z',
    timeFormatted: '2:43 PM',
    actor: 'CampusIQ Memory Layer',
    actorRole: 'system' as any,
    action: 'Persistent Memory Injected',
    resource: 'Academic Context (CSE 3rd Year)',
    status: 'Success',
    category: 'Memory',
    details: 'Loaded active student profile: Program = Computer Science and Engineering, Level = 3rd Year.',
    department: 'Computer Science and Engineering'
  },
  {
    id: 'audit-004',
    timestamp: '2026-09-25T14:43:30.000Z',
    timeFormatted: '2:43 PM',
    actor: 'CampusIQ Workflow Engine',
    actorRole: 'system' as any,
    action: 'Application Draft Prepared',
    resource: 'Bonafide Certificate Request (draft-901)',
    status: 'Success',
    category: 'Workflow',
    details: 'Generated formal bonafide request draft grounded in Student Services Procedure Sec 4.2.',
    department: 'Computer Science and Engineering'
  },
  {
    id: 'audit-005',
    timestamp: '2026-09-25T14:44:00.000Z',
    timeFormatted: '2:44 PM',
    actor: 'Trisha D M (Student)',
    actorRole: 'student',
    action: 'Action Queued for Approval',
    resource: 'Approval Queue (app-501)',
    status: 'Pending',
    category: 'Approval',
    details: 'User submitted draft for institutional sign-off. Pending HOD Approval step.',
    department: 'Computer Science and Engineering'
  },
  {
    id: 'audit-006',
    timestamp: '2026-09-25T11:15:00.000Z',
    timeFormatted: '11:15 AM',
    actor: 'Dr. Ananya Rao (Faculty)',
    actorRole: 'faculty',
    action: 'Faculty Leave Application Submitted',
    resource: 'Faculty Duty Leave (draft-902)',
    status: 'Pending',
    category: 'Workflow',
    details: 'Submitted duty leave request for IEEE AI Summit 2026.',
    department: 'Computer Science and Engineering'
  },
  {
    id: 'audit-007',
    timestamp: '2026-09-25T10:30:00.000Z',
    timeFormatted: '10:30 AM',
    actor: 'Dr. Rajesh Kumar (HOD)',
    actorRole: 'hod',
    action: 'Department Circular Endorsed',
    resource: 'Research Subsidy Circular 2026',
    status: 'Success',
    category: 'Approval',
    details: 'Approved internal departmental funding circular for CSE undergrad research.',
    department: 'Computer Science and Engineering'
  }
];

// ============================================================================
// CHAT MESSAGES BASE
// ============================================================================

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    text: 'Good morning. I am CampusIQ, your institutional AI. I have full context of college regulations, departmental procedures, and verified academic records.\n\nHow can I assist you today?',
    timestamp: '09:00 AM'
  }
];
