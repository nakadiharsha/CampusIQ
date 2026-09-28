export type UserRole = 'student' | 'faculty' | 'hod' | 'admin';

export type Permission =
  | 'knowledge.read'
  | 'knowledge.upload'
  | 'knowledge.edit'
  | 'knowledge.delete'
  | 'memory.read.self'
  | 'memory.edit.self'
  | 'workflow.create'
  | 'workflow.read.self'
  | 'workflow.read.department'
  | 'workflow.approve.self'
  | 'workflow.approve.department'
  | 'students.read.self'
  | 'students.read.department'
  | 'faculty.read.department'
  | 'analytics.read.department'
  | 'audit.read.self'
  | 'audit.read.department'
  | 'department.manage'
  | 'approval.manage.department';

export type PageId =
  | 'overview'
  | 'timetable'
  | 'attendance'
  | 'study-planner'
  | 'notes'
  | 'announcements'
  | 'events'
  | 'ask'
  | 'knowledge'
  | 'memory'
  | 'workflows'
  | 'workflow-builder'
  | 'approvals'
  | 'requests'
  | 'students'
  | 'faculty-members'
  | 'department-info'
  | 'analytics'
  | 'audit'
  | 'settings'
  | 'access-restricted';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  departmentName: string;
  department: string; // compatibility
  title?: string;
  program?: string;
  year?: string;
  usn?: string;
  avatar: string;
  permissions: Permission[];
}

export interface StudentItem {
  id: string;
  name: string;
  usn: string;
  email: string;
  department: string;
  program: string;
  year: string;
  cgpa: string;
  attendance: string;
  pendingRequestsCount: number;
  status: 'Active' | 'On Leave' | 'Graduated';
}

export interface FacultyItem {
  id: string;
  name: string;
  title: string;
  email: string;
  department: string;
  specialization: string;
  coursesAssigned: string[];
  activeResearchGrants: number;
  status: 'Active' | 'On Sabattical' | 'Visiting';
}

export interface DepartmentStats {
  facultyCount: number;
  studentCount: number;
  pendingRequestsCount: number;
  departmentDocumentsCount: number;
  pendingApprovalsCount: number;
  activeCoursesCount: number;
}

export type DocumentCategory =
  | 'Policy'
  | 'Regulation'
  | 'Procedure'
  | 'Circular'
  | 'Handbook';

export type DocumentStatus = 'Indexed' | 'Processing' | 'Needs Review';

export interface DocumentSection {
  id: string;
  title: string;
  pageNumber: number;
  content: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  pages: number;
  chunkCount: number;
  status: DocumentStatus;
  updatedAt: string;
  fileType: string;
  department: string;
  uploadedBy?: string;
  description: string;
  sections: DocumentSection[];
}

export interface Source {
  documentId: string;
  documentTitle: string;
  category: DocumentCategory;
  pageNumber: number;
  sectionTitle: string;
  excerpt: string;
  relevanceScore: number;
}

export type MemoryCategory = 'Academic Context' | 'Preferences' | 'Recent Context';

export interface MemoryItem {
  id: string;
  category: MemoryCategory;
  title: string;
  description: string;
  date: string;
  enabled: boolean;
  key?: string;
  value?: string;
  ownerId?: string; // Privacy: owner of memory
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: Source[];
  contextUsed?: {
    userContext: string[];
    memoriesUsed: string[];
  };
  suggestedFollowUps?: string[];
  actionOffer?: {
    workflowId: string;
    title: string;
    description: string;
  };
}

export interface Workflow {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredInfo: string[];
  approvalRequirement: string;
  currentStatus: 'Available' | 'In Progress' | 'Pending Approval' | 'Approved';
  targetDepartment: string;
  allowedRoles: UserRole[];
}

export interface ApplicationDraft {
  id: string;
  workflowId: string;
  workflowTitle: string;
  recipientDepartment: string;
  subject: string;
  applicantName: string;
  applicantId: string;
  applicantRole?: UserRole;
  program: string;
  purpose: string;
  additionalInfo: string;
  generatedBody: string;
  createdAt: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected';
  sourcesUsed: Source[];
  policyReference: string;
}

export interface ApprovalItem {
  id: string;
  applicationId: string;
  workflowTitle: string;
  requestedAction: string;
  createdDate: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  draft: ApplicationDraft;
  reviewerNotes?: string;
  assignedToRole: UserRole;
  applicantName: string;
  applicantRole: UserRole;
  department: string;
}

export type AuditCategory =
  | 'All'
  | 'Questions'
  | 'Retrieval'
  | 'Memory'
  | 'Workflow'
  | 'Approval'
  | 'System';

export interface AuditEvent {
  id: string;
  timestamp: string;
  timeFormatted: string;
  actor: string;
  actorRole?: UserRole;
  action: string;
  resource: string;
  status: 'Success' | 'Pending' | 'Warning' | 'Failed';
  category: AuditCategory;
  details?: string;
  department?: string;
}

export type PipelineStage =
  | 'ASK'
  | 'RETRIEVE'
  | 'REMEMBER'
  | 'REASON'
  | 'PREPARE'
  | 'APPROVE'
  | 'AUDIT';

export interface RouteConfig {
  path: string;
  pageId: PageId;
  title: string;
  roles: UserRole[];
  permission?: Permission;
}
