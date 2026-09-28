import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  PageId,
  User,
  KnowledgeDocument,
  MemoryItem,
  Workflow,
  ApprovalItem,
  AuditEvent,
  ChatMessage,
  ApplicationDraft,
  StudentItem,
  FacultyItem
} from '../types';
import {
  mockKnowledgeService,
  mockMemoryService,
  mockChatService,
  mockWorkflowService,
  mockApprovalService,
  mockAuditService,
  mockDepartmentService
} from '../services/mockServices';
import { initialChatMessages } from '../data/mockData';
import { useAuth } from './AuthContext';

export interface CampusNote {
  id: string;
  title: string;
  subject: string;
  section: string;
  description: string;
  faculty: string;
}

export interface CampusAnnouncement {
  id: string;
  title: string;
  message: string;
  audience: 'students' | 'faculty' | 'both';
  author: string;
  date: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
  section: string;
  registeredAt: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  createdBy: string;
  registeredStudentIds: string[];
}

export interface AttendanceSummary {
  subject: string;
  present: number;
  total: number;
  percent: number;
}

interface AppContextType {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  user: User;
  documents: KnowledgeDocument[];
  memories: MemoryItem[];
  workflows: Workflow[];
  approvals: ApprovalItem[];
  auditLogs: AuditEvent[];
  messages: ChatMessage[];
  students: StudentItem[];
  facultyMembers: FacultyItem[];
  selectedWorkflowId: string | null;
  setSelectedWorkflowId: (id: string | null) => void;
  selectedDocument: KnowledgeDocument | null;
  setSelectedDocument: (doc: KnowledgeDocument | null) => void;
  selectedApproval: ApprovalItem | null;
  setSelectedApproval: (item: ApprovalItem | null) => void;
  isAddDocOpen: boolean;
  setIsAddDocOpen: (open: boolean) => void;
  isSubmittingQuestion: boolean;
  
  // Actions
  toggleMemory: (id: string) => Promise<void>;
  sendQuestion: (question: string) => Promise<ChatMessage>;
  startWorkflow: (workflowId: string) => void;
  generateDraft: (purpose: string, department: string, additionalInfo?: string) => Promise<ApplicationDraft>;
  approveAction: (approvalId: string, notes?: string) => Promise<void>;
  rejectAction: (approvalId: string, reason?: string) => Promise<void>;
  addDocument: (docData: { title: string; category: KnowledgeDocument['category']; department: string; description: string; pages: number }) => Promise<void>;
  filterAuditLogs: (category: AuditEvent['category']) => Promise<void>;
  activeAuditFilter: AuditEvent['category'];
  activeWorkflowDraft: ApplicationDraft | null;
  setActiveWorkflowDraft: (draft: ApplicationDraft | null) => void;
  quickAskQuestion: (questionText: string) => void;
  notificationCount: number;
  notes: CampusNote[];
  announcements: CampusAnnouncement[];
  events: CampusEvent[];
  attendance: AttendanceSummary[];
  addNote: (note: Omit<CampusNote, 'id'>) => void;
  deleteNote: (id: string) => void;
  addAnnouncement: (announcement: Omit<CampusAnnouncement, 'id' | 'date'>) => void;
  addEvent: (event: Omit<CampusEvent, 'id' | 'registeredStudentIds'>) => void;
  registerForEvent: (eventId: string, details: Omit<EventRegistration, 'id' | 'eventId' | 'registeredAt'>) => void;
  unregisterFromEvent: (eventId: string) => void;
  getEventRegistrations: (eventId: string) => EventRegistration[];
  setAttendance: (subject: string, present: number, total: number) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuth();
  const activeUser = authUser || {
    id: 'usr-student',
    name: 'Trisha D M',
    email: 'trisha@student.college.edu',
    role: 'student' as const,
    departmentId: 'dept-cse',
    departmentName: 'Computer Science and Engineering',
    department: 'Computer Science and Engineering',
    program: 'B.E. Computer Science and Engineering',
    year: '3rd Year',
    usn: '1MS24CS108',
    avatar: 'TD',
    permissions: []
  };

  const [activePage, setActivePage] = useState<PageId>('overview');
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [facultyMembers, setFacultyMembers] = useState<FacultyItem[]>([]);
  const [notes, setNotes] = useState<CampusNote[]>(() => JSON.parse(localStorage.getItem('campusiq_notes') || JSON.stringify([{id:'note-1',title:'Unit 3 Computer Networks Notes',subject:'Computer Networks',section:'A',description:'Routing and transport layer notes shared by faculty.',faculty:'Dr. Ananya Rao'}])));
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>(() => JSON.parse(localStorage.getItem('campusiq_announcements') || JSON.stringify([{id:'ann-1',title:'Faculty Meeting',message:'Department faculty meeting on Friday at 3:00 PM in the seminar hall.',audience:'faculty',author:'Dr. Rajesh Kumar',date:'Today'}])));
  const [events, setEvents] = useState<CampusEvent[]>(() => JSON.parse(localStorage.getItem('campusiq_events') || JSON.stringify([{id:'event-1',title:'Department Project Expo',date:'2026-10-10',location:'Main Seminar Hall',description:'Student project presentations and demonstrations.',createdBy:'Dr. Rajesh Kumar',registeredStudentIds:[]}])));
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>(() => JSON.parse(localStorage.getItem('campusiq_event_registrations') || '[]'));
  const [attendance, setAttendanceState] = useState<AttendanceSummary[]>([]);
  
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>('wf-bonafide');
  const [selectedDocument, setSelectedDocument] = useState<KnowledgeDocument | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [isAddDocOpen, setIsAddDocOpen] = useState<boolean>(false);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState<boolean>(false);
  const [activeAuditFilter, setActiveAuditFilter] = useState<AuditEvent['category']>('All');
  const [activeWorkflowDraft, setActiveWorkflowDraft] = useState<ApplicationDraft | null>(null);

  const refreshData = async () => {
    const role = activeUser.role;
    const [docs, mems, wfs, apps, audits, stds, facs] = await Promise.all([
      mockKnowledgeService.getDocuments(role),
      mockMemoryService.getMemories(activeUser),
      mockWorkflowService.getWorkflows(role),
      mockApprovalService.getPendingApprovals(role, activeUser.name),
      mockAuditService.getAuditLogs('All', role, activeUser.name),
      mockDepartmentService.getStudents(role),
      mockDepartmentService.getFaculty(role)
    ]);
    setDocuments(docs);
    setMemories(mems);
    setWorkflows(wfs);
    setApprovals(apps);
    setAuditLogs(audits);
    setStudents(stds);
    setFacultyMembers(facs);
  };

  useEffect(() => {
    refreshData();
  }, [activeUser.role, activeUser.id]);

  useEffect(() => {
    const loadLiveAttendance = async () => {
      if (activeUser.role !== 'student' || !activeUser.usn) {
        setAttendanceState([]);
        return;
      }
      try {
        const studentsResponse = await fetch('http://localhost:5000/api/students');
        if (!studentsResponse.ok) throw new Error('Could not load student data.');
        const studentList = await studentsResponse.json();
        const student = studentList.find((item: { studentId: string }) => item.studentId === activeUser.usn);
        if (!student) {
          setAttendanceState([]);
          return;
        }
        const response = await fetch(`http://localhost:5000/api/attendance/student/${student.id}`);
        if (!response.ok) throw new Error('Could not load attendance.');
        const data = await response.json();
        setAttendanceState((data.subjects || []).map((item: { subject: string; present: number; total: number; percent: number | null }) => ({
          subject: item.subject,
          present: Number(item.present || 0),
          total: Number(item.total || 0),
          percent: Number(item.percent || 0)
        })));
      } catch (error) {
        console.error('Live attendance load failed:', error);
        setAttendanceState([]);
      }
    };
    loadLiveAttendance();
  }, [activeUser.role, activeUser.usn]);

  const toggleMemory = async (id: string) => {
    const mem = memories.find((m) => m.id === id);
    if (!mem) return;
    const updated = await mockMemoryService.toggleMemory(id, !mem.enabled, activeUser);
    setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
    const updatedAudits = await mockAuditService.getAuditLogs('All', activeUser.role, activeUser.name);
    setAuditLogs(updatedAudits);
  };

  const sendQuestion = async (questionText: string): Promise<ChatMessage> => {
    setIsSubmittingQuestion(true);
    
    const userMsg: ChatMessage = {
      id: `usr-msg-${Date.now()}`,
      role: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);

    await new Promise((res) => setTimeout(res, 400));

    const activeMems = memories.filter((m) => m.enabled);
    const { responseMessage } = await mockChatService.sendQuestion(questionText, activeMems, activeUser);

    setMessages((prev) => [...prev, responseMessage]);
    
    const updatedAudits = await mockAuditService.getAuditLogs('All', activeUser.role, activeUser.name);
    setAuditLogs(updatedAudits);
    setIsSubmittingQuestion(false);

    return responseMessage;
  };

  const quickAskQuestion = (questionText: string) => {
    setActivePage('ask');
    sendQuestion(questionText);
  };

  const startWorkflow = (workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    setActivePage('workflow-builder');
  };

  const generateDraft = async (
    purpose: string,
    department: string,
    additionalInfo?: string
  ): Promise<ApplicationDraft> => {
    const wfId = selectedWorkflowId || 'wf-bonafide';
    const { draft } = await mockWorkflowService.generateApplicationDraft(
      {
        workflowId: wfId,
        purpose,
        department,
        additionalInfo
      },
      activeUser
    );

    setActiveWorkflowDraft(draft);
    
    const [updatedApps, updatedAudits] = await Promise.all([
      mockApprovalService.getPendingApprovals(activeUser.role, activeUser.name),
      mockAuditService.getAuditLogs('All', activeUser.role, activeUser.name)
    ]);
    
    setApprovals(updatedApps);
    setAuditLogs(updatedAudits);
    return draft;
  };

  const approveAction = async (approvalId: string, notes?: string) => {
    await mockApprovalService.approveAction(approvalId, activeUser, notes);
    
    const [updatedApps, updatedAudits] = await Promise.all([
      mockApprovalService.getPendingApprovals(activeUser.role, activeUser.name),
      mockAuditService.getAuditLogs('All', activeUser.role, activeUser.name)
    ]);
    
    setApprovals(updatedApps);
    setAuditLogs(updatedAudits);
    setSelectedApproval(null);
  };

  const rejectAction = async (approvalId: string, reason?: string) => {
    await mockApprovalService.rejectAction(approvalId, activeUser, reason);
    
    const [updatedApps, updatedAudits] = await Promise.all([
      mockApprovalService.getPendingApprovals(activeUser.role, activeUser.name),
      mockAuditService.getAuditLogs('All', activeUser.role, activeUser.name)
    ]);
    
    setApprovals(updatedApps);
    setAuditLogs(updatedAudits);
    setSelectedApproval(null);
  };

  const addDocument = async (docData: {
    title: string;
    category: KnowledgeDocument['category'];
    department: string;
    description: string;
    pages: number;
  }) => {
    await mockKnowledgeService.addDocument(docData, activeUser);
    const [updatedDocs, updatedAudits] = await Promise.all([
      mockKnowledgeService.getDocuments(activeUser.role),
      mockAuditService.getAuditLogs('All', activeUser.role, activeUser.name)
    ]);
    setDocuments(updatedDocs);
    setAuditLogs(updatedAudits);
    setIsAddDocOpen(false);
  };

  const filterAuditLogs = async (category: AuditEvent['category']) => {
    setActiveAuditFilter(category);
    const filtered = await mockAuditService.getAuditLogs(category, activeUser.role, activeUser.name);
    setAuditLogs(filtered);
  };

  const addNote = (note: Omit<CampusNote, 'id'>) => {
    const next = [...notes, { ...note, id: `note-${Date.now()}` }];
    setNotes(next); localStorage.setItem('campusiq_notes', JSON.stringify(next));
  };
  const deleteNote = (id: string) => {
    const next = notes.filter(n => n.id !== id);
    setNotes(next); localStorage.setItem('campusiq_notes', JSON.stringify(next));
  };
  const addAnnouncement = (announcement: Omit<CampusAnnouncement, 'id' | 'date'>) => {
    const next = [{ ...announcement, id: `ann-${Date.now()}`, date: 'Today' }, ...announcements];
    setAnnouncements(next); localStorage.setItem('campusiq_announcements', JSON.stringify(next));
  };
  const addEvent = (event: Omit<CampusEvent, 'id' | 'registeredStudentIds'>) => {
    const next = [{ ...event, id: `event-${Date.now()}`, registeredStudentIds: [] }, ...events];
    setEvents(next); localStorage.setItem('campusiq_events', JSON.stringify(next));
  };
  const registerForEvent = (eventId: string, details: Omit<EventRegistration, 'id' | 'eventId' | 'registeredAt'>) => {
    if (activeUser.role !== 'student') return;
    const existing = eventRegistrations.some(r => r.eventId === eventId && r.studentId === details.studentId);
    if (existing) return;
    const registration: EventRegistration = {
      ...details,
      id: `registration-${Date.now()}`,
      eventId,
      registeredAt: new Date().toISOString()
    };
    const nextRegistrations = [...eventRegistrations, registration];
    setEventRegistrations(nextRegistrations);
    localStorage.setItem('campusiq_event_registrations', JSON.stringify(nextRegistrations));
    setEvents(prev => {
      const next = prev.map(event => event.id === eventId
        ? { ...event, registeredStudentIds: [...(event.registeredStudentIds || []), details.studentId] }
        : event);
      localStorage.setItem('campusiq_events', JSON.stringify(next));
      return next;
    });
  };

  const unregisterFromEvent = (eventId: string) => {
    if (activeUser.role !== 'student') return;
    const nextRegistrations = eventRegistrations.filter(r => !(r.eventId === eventId && r.studentId === activeUser.id));
    setEventRegistrations(nextRegistrations);
    localStorage.setItem('campusiq_event_registrations', JSON.stringify(nextRegistrations));
    setEvents(prev => {
      const next = prev.map(event => event.id === eventId
        ? { ...event, registeredStudentIds: (event.registeredStudentIds || []).filter(id => id !== activeUser.id) }
        : event);
      localStorage.setItem('campusiq_events', JSON.stringify(next));
      return next;
    });
  };

  const getEventRegistrations = (eventId: string) => eventRegistrations.filter(r => r.eventId === eventId);
  const setAttendance = (subject: string, present: number, total: number) => {
    setAttendanceState(prev => {
      const next = [...prev.filter(a => a.subject !== subject), { subject, present, total, percent: Math.round((present / total) * 100) }];
      localStorage.setItem('campusiq_attendance', JSON.stringify(next));
      return next;
    });
  };

  const pendingCount = approvals.filter((a) => a.status === 'Pending Approval').length;

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        user: activeUser,
        documents,
        memories,
        workflows,
        approvals,
        auditLogs,
        messages,
        students,
        facultyMembers,
        selectedWorkflowId,
        setSelectedWorkflowId,
        selectedDocument,
        setSelectedDocument,
        selectedApproval,
        setSelectedApproval,
        isAddDocOpen,
        setIsAddDocOpen,
        isSubmittingQuestion,
        toggleMemory,
        sendQuestion,
        startWorkflow,
        generateDraft,
        approveAction,
        rejectAction,
        addDocument,
        filterAuditLogs,
        activeAuditFilter,
        activeWorkflowDraft,
        setActiveWorkflowDraft,
        quickAskQuestion,
        notificationCount: pendingCount,
        notes,
        announcements,
        events,
        attendance,
        addNote,
        deleteNote,
        addAnnouncement,
        addEvent,
        registerForEvent,
        unregisterFromEvent,
        getEventRegistrations,
        setAttendance,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
