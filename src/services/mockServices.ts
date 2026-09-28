import type {
  KnowledgeDocument,
  MemoryItem,
  Workflow,
  ApplicationDraft,
  ApprovalItem,
  AuditEvent,
  ChatMessage,
  Source,
  AuditCategory,
  UserRole,
  User,
  StudentItem,
  FacultyItem
} from '../types';
import {
  initialDocuments,
  initialMemoryItems,
  initialWorkflows,
  initialApprovals,
  initialAuditLogs,
  sampleBonafideSources,
  studentUser,
  mockStudentsList,
  mockFacultyList
} from '../data/mockData';

let mockDocs: KnowledgeDocument[] = [...initialDocuments];
let mockMemories: MemoryItem[] = [...initialMemoryItems];
let mockWorkflows: Workflow[] = [...initialWorkflows];
let mockApprovals: ApprovalItem[] = [...initialApprovals];
let mockAuditEvents: AuditEvent[] = [...initialAuditLogs];

const getFormattedTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ============================================================================
// KNOWLEDGE SERVICE (/api/documents, /api/search)
// ============================================================================
export const mockKnowledgeService = {
  async getDocuments(role: UserRole = 'student'): Promise<KnowledgeDocument[]> {
    if (role === 'student') {
      return mockDocs.filter((d) => d.status === 'Indexed');
    }
    return [...mockDocs];
  },

  async getDocumentById(id: string): Promise<KnowledgeDocument | undefined> {
    return mockDocs.find((doc) => doc.id === id);
  },

  async searchDocuments(query: string, categoryFilter: string = 'All', role: UserRole = 'student'): Promise<KnowledgeDocument[]> {
    const q = query.toLowerCase().trim();
    const availableDocs = await this.getDocuments(role);
    return availableDocs.filter((doc) => {
      const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;
      const matchesQuery =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  },

  async addDocument(
    newDocData: {
      title: string;
      category: KnowledgeDocument['category'];
      department: string;
      description: string;
      pages: number;
    },
    uploaderUser: User
  ): Promise<KnowledgeDocument> {
    const status: KnowledgeDocument['status'] = uploaderUser.role === 'hod' ? 'Indexed' : 'Needs Review';

    const newDoc: KnowledgeDocument = {
      id: `doc-${Date.now()}`,
      title: newDocData.title,
      category: newDocData.category,
      pages: newDocData.pages,
      chunkCount: Math.floor(newDocData.pages * 4.2),
      status,
      updatedAt: new Date().toISOString().split('T')[0],
      fileType: 'PDF',
      department: newDocData.department,
      uploadedBy: uploaderUser.name,
      description: newDocData.description,
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          title: 'Section 1.1: Institutional Directives',
          pageNumber: 1,
          content: 'This document contains institutional policies uploaded under departmental governance.'
        }
      ]
    };
    mockDocs.unshift(newDoc);

    const audit: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeFormatted: getFormattedTime(),
      actor: `${uploaderUser.name} (${uploaderUser.role.toUpperCase()})`,
      actorRole: uploaderUser.role,
      action: status === 'Indexed' ? 'Document Uploaded & Indexed' : 'Document Uploaded (Pending Review)',
      resource: newDoc.title,
      status: 'Success',
      category: 'Retrieval',
      details: `Document "${newDoc.title}" uploaded by ${uploaderUser.name}. Status: ${status}.`,
      department: uploaderUser.department
    };
    mockAuditEvents.unshift(audit);

    return newDoc;
  }
};

// ============================================================================
// MEMORY SERVICE (/api/memory)
// ============================================================================
export const mockMemoryService = {
  async getMemories(currentUserData: User): Promise<MemoryItem[]> {
    // Privacy boundary: Users see their own personal memories or general profile context
    return mockMemories.filter((m) => !m.ownerId || m.ownerId === currentUserData.id);
  },

  async toggleMemory(id: string, enabled: boolean, currentUserData: User): Promise<MemoryItem> {
    const memory = mockMemories.find((m) => m.id === id);
    if (memory) {
      memory.enabled = enabled;
      const audit: AuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timeFormatted: getFormattedTime(),
        actor: `${currentUserData.name} (${currentUserData.role.toUpperCase()})`,
        actorRole: currentUserData.role,
        action: enabled ? 'Memory Enabled' : 'Memory Disabled',
        resource: `Memory: ${memory.title}`,
        status: 'Success',
        category: 'Memory',
        details: `Persistent memory item "${memory.title}" set to ${enabled ? 'active' : 'inactive'}.`,
        department: currentUserData.department
      };
      mockAuditEvents.unshift(audit);
    }
    return memory || mockMemories[0];
  }
};

// ============================================================================
// CHAT & RAG SERVICE (/api/chat)
// ============================================================================
export const mockChatService = {
  async sendQuestion(
    question: string,
    activeMemories: MemoryItem[],
    currentUserData: User
  ): Promise<{ responseMessage: ChatMessage; newAuditEvents: AuditEvent[] }> {
    const qLower = question.toLowerCase();
    const createdAudits: AuditEvent[] = [];

    const audit1: AuditEvent = {
      id: `audit-${Date.now()}-1`,
      timestamp: new Date().toISOString(),
      timeFormatted: getFormattedTime(),
      actor: `${currentUserData.name} (${currentUserData.role.toUpperCase()})`,
      actorRole: currentUserData.role,
      action: 'Query Executed',
      resource: `Ask CampusIQ (${currentUserData.role})`,
      status: 'Success',
      category: 'Questions',
      details: `User asked: "${question}"`,
      department: currentUserData.department
    };
    createdAudits.push(audit1);

    const isBonafide = qLower.includes('bonafide') || qLower.includes('certificate') || qLower.includes('procedure');
    const isPrepare = qLower.includes('prepare') || qLower.includes('application') || qLower.includes('draft') || qLower.includes('create');
    const isPendingQuery = qLower.includes('pending') || qLower.includes('requests') || qLower.includes('approvals');

    let assistantText = '';
    let sources: Source[] = [];
    let suggestedFollowUps: string[] = [];
    let actionOffer: ChatMessage['actionOffer'];

    if (currentUserData.role === 'hod' && isPendingQuery) {
      // HOD Department Level Query
      const audit2: AuditEvent = {
        id: `audit-${Date.now()}-2`,
        timestamp: new Date().toISOString(),
        timeFormatted: getFormattedTime(),
        actor: 'CampusIQ Reasoning Engine',
        actorRole: 'system' as any,
        action: 'Department Analytics Search',
        resource: 'CSE Department Request Queue',
        status: 'Success',
        category: 'Retrieval',
        details: 'Retrieved department statistics: 14 pending requests across 842 students.',
        department: currentUserData.department
      };
      createdAudits.push(audit2);

      assistantText = `Good morning, ${currentUserData.title} ${currentUserData.name}.\n\nAccording to the **CSE Department Dashboard**:\n- **Pending Student Requests**: 14 total (7 requiring immediate HOD approval).\n- **Pending Faculty Grants**: 2 proposals awaiting research budget endorsement.\n- **Department Documents**: 128 indexed policy handbooks.\n\nWould you like me to open the HOD Approval Review drawer for the pending Bonafide and Duty Leave applications?`;

      sources = [
        {
          documentId: 'doc-104',
          documentTitle: 'Faculty Code of Conduct & Teaching Protocols',
          category: 'Policy',
          pageNumber: 14,
          sectionTitle: 'Section 3.1: HOD Approval Authorities',
          excerpt: 'The Head of Department is authorized to endorse student certificate requests, faculty duty leave applications, and research subsidies.',
          relevanceScore: 0.96
        }
      ];

      suggestedFollowUps = [
        'Open Pending Approvals Queue',
        'Show Department Analytics',
        'Review Faculty Leave Request'
      ];

      actionOffer = {
        workflowId: 'wf-hod-approval',
        title: 'Departmental Approval Review',
        description: 'Review pending student and faculty requests requiring HOD sign-off.'
      };
    } else if (currentUserData.role === 'faculty' && (qLower.includes('academic') || qLower.includes('course') || isPendingQuery)) {
      // Faculty Query Response
      assistantText = `Hello ${currentUserData.name}.\n\nBased on **Academic Procedures Handbook** & your active teaching assignments (${currentUserData.department}):\n1. **Attendance Condonation**: Students below 85% attendance require advisor recommendation prior to HOD sign-off.\n2. **Pending Student Requests**: 6 requests assigned to your courses for attendance verification.\n3. **Research Subsidies**: Travel grant applications for indexed IEEE conferences require submission 14 days prior to event.`;

      sources = [
        {
          documentId: 'doc-102',
          documentTitle: 'Academic Procedures Handbook',
          category: 'Handbook',
          pageNumber: 34,
          sectionTitle: 'Section 4.2: Course Instructor Authorization',
          excerpt: 'Faculty members are authorized to review student leave requests for assigned course modules.',
          relevanceScore: 0.92
        }
      ];

      suggestedFollowUps = [
        'Review Student Requests',
        'Apply for Faculty Research Grant',
        'Start Faculty Duty Leave Workflow'
      ];
    } else if (isPrepare || (qLower.includes('can you') && isBonafide)) {
      const audit2: AuditEvent = {
        id: `audit-${Date.now()}-2`,
        timestamp: new Date().toISOString(),
        timeFormatted: getFormattedTime(),
        actor: 'CampusIQ Reasoning Engine',
        actorRole: 'system' as any,
        action: 'Application Generation Triggered',
        resource: 'Bonafide Certificate Workflow',
        status: 'Success',
        category: 'Workflow',
        details: `Loaded user credentials for ${currentUserData.name} (${currentUserData.role.toUpperCase()}) and pre-filled form.`,
        department: currentUserData.department
      };
      createdAudits.push(audit2);

      assistantText = `I have loaded your profile credentials (${currentUserData.name}, ${currentUserData.role.toUpperCase()}, ${currentUserData.department}) and matched them with **Section 4.2 of the Student Services Procedure**.\n\nI can prepare the application draft for you. Remember that CampusIQ prepares the document, but human approval is mandatory before official submission.`;

      sources = sampleBonafideSources;
      suggestedFollowUps = [
        'Review and generate application draft',
        'What documents do I need to attach?',
        'How long does approval take?'
      ];
      actionOffer = {
        workflowId: 'wf-bonafide',
        title: 'Bonafide Certificate Request',
        description: 'Launch workflow builder pre-filled with your verified context.'
      };
    } else if (isBonafide) {
      const audit2: AuditEvent = {
        id: `audit-${Date.now()}-2`,
        timestamp: new Date().toISOString(),
        timeFormatted: getFormattedTime(),
        actor: 'CampusIQ RAG Engine',
        actorRole: 'system' as any,
        action: 'Document Retrieval',
        resource: 'Student Services Procedure (Page 18, Sec 4.2)',
        status: 'Success',
        category: 'Retrieval',
        details: 'Retrieved Section 4.2 from Student Services Procedure.',
        department: currentUserData.department
      };
      createdAudits.push(audit2);

      assistantText = `According to the **Student Services Procedure**, a bonafide certificate request requires submitting details through the designated institutional workflow.\n\nSteps:\n1. Select the certificate request.\n2. State the administrative purpose (Passport, Bank Loan, Visa).\n3. Confirm student credentials (${currentUserData.name}, ${currentUserData.program || currentUserData.department}).\n4. Submit for HOD / Student Services sign-off.\n\nI found this in **Student Services Procedure (Page 18, Sec 4.2)**.`;

      sources = sampleBonafideSources;
      suggestedFollowUps = [
        'Can you prepare the application for me?',
        'Can I submit this online?',
        'What documents are required?'
      ];
      actionOffer = {
        workflowId: 'wf-bonafide',
        title: 'Bonafide Certificate Request',
        description: 'Prepare an official bonafide certificate request.'
      };
    } else {
      assistantText = `I searched the institutional knowledge base for "${question}".\n\nContext loaded for **${currentUserData.name}** (${currentUserData.role.toUpperCase()} • ${currentUserData.department}):\n1. All institutional requests require digital logging.\n2. Approvals route to HOD or Dean based on role permissions.\n\nWould you like me to find specific policy references or launch a workflow?`;

      sources = [
        {
          documentId: 'doc-102',
          documentTitle: 'Academic Procedures Handbook',
          category: 'Handbook',
          pageNumber: 12,
          sectionTitle: 'Section 1.4: Administrative Directives',
          excerpt: 'All administrative submissions require digital logging and formal sign-off.',
          relevanceScore: 0.82
        }
      ];
      suggestedFollowUps = [
        'What is the procedure for applying for a bonafide certificate?',
        'Show available workflows',
        'Search Knowledge Base'
      ];
    }

    mockAuditEvents.unshift(...createdAudits);

    const responseMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      text: assistantText,
      timestamp: getFormattedTime(),
      sources,
      contextUsed: {
        userContext: [`Name: ${currentUserData.name}`, `Role: ${currentUserData.role.toUpperCase()}`, `Dept: ${currentUserData.department}`],
        memoriesUsed: activeMemories.filter((m) => m.enabled).map((m) => `${m.title}: ${m.value || m.description}`)
      },
      suggestedFollowUps,
      actionOffer
    };

    return { responseMessage, newAuditEvents: createdAudits };
  }
};

// ============================================================================
// WORKFLOW SERVICE (/api/workflows)
// ============================================================================
export const mockWorkflowService = {
  async getWorkflows(role: UserRole = 'student'): Promise<Workflow[]> {
    return mockWorkflows.filter((w) => w.allowedRoles.includes(role));
  },

  async generateApplicationDraft(
    params: {
      workflowId: string;
      purpose: string;
      department: string;
      additionalInfo?: string;
    },
    currentUserData: User
  ): Promise<{ draft: ApplicationDraft; newApproval: ApprovalItem; auditEvents: AuditEvent[] }> {
    const wf = mockWorkflows.find((w) => w.id === params.workflowId) || mockWorkflows[0];
    const createdAudits: AuditEvent[] = [];

    const draftId = `draft-${Date.now()}`;
    const approvalId = `app-${Date.now()}`;

    const draftBody = `To,\nThe Officer-in-Charge / Head of Department,\n${params.department},\nMSRIT Campus.\n\nSubject: Request for ${wf.title} — ${currentUserData.name}\n\nRespected Sir/Madam,\n\nI am ${currentUserData.name} (${currentUserData.role.toUpperCase()}, ${currentUserData.department}).\n\nI am writing to formally request a ${wf.title} for the following institutional purpose:\n"${params.purpose}".\n\n${params.additionalInfo ? `Additional Details: ${params.additionalInfo}\n\n` : ''}This request is prepared in alignment with institutional procedures.\n\nThanking you,\n\nYours faithfully,\n${currentUserData.name}\n${currentUserData.department}`;

    const draft: ApplicationDraft = {
      id: draftId,
      workflowId: wf.id,
      workflowTitle: wf.title,
      recipientDepartment: params.department,
      subject: `Request for ${wf.title} — ${currentUserData.name}`,
      applicantName: currentUserData.name,
      applicantId: currentUserData.usn || currentUserData.id,
      applicantRole: currentUserData.role,
      program: currentUserData.program || currentUserData.title || currentUserData.department,
      purpose: params.purpose,
      additionalInfo: params.additionalInfo || '',
      generatedBody: draftBody,
      createdAt: getFormattedTime(),
      status: 'Pending Approval',
      sourcesUsed: sampleBonafideSources,
      policyReference: 'Student Services Procedure (Page 18, Section 4.2)'
    };

    const approvalItem: ApprovalItem = {
      id: approvalId,
      applicationId: draftId,
      workflowTitle: `${wf.title}`,
      requestedAction: `Submit official application to ${params.department}`,
      createdDate: `Today, ${getFormattedTime()}`,
      status: 'Pending Approval',
      assignedToRole: 'hod',
      applicantName: currentUserData.name,
      applicantRole: currentUserData.role,
      department: currentUserData.department,
      draft
    };

    mockApprovals.unshift(approvalItem);

    const audit1: AuditEvent = {
      id: `audit-${Date.now()}-wf1`,
      timestamp: new Date().toISOString(),
      timeFormatted: getFormattedTime(),
      actor: `${currentUserData.name} (${currentUserData.role.toUpperCase()})`,
      actorRole: currentUserData.role,
      action: 'Application Draft Generated',
      resource: `${wf.title} (${draftId})`,
      status: 'Success',
      category: 'Workflow',
      details: `Generated application for: "${params.purpose}".`,
      department: currentUserData.department
    };

    const audit2: AuditEvent = {
      id: `audit-${Date.now()}-wf2`,
      timestamp: new Date().toISOString(),
      timeFormatted: getFormattedTime(),
      actor: `${currentUserData.name} (${currentUserData.role.toUpperCase()})`,
      actorRole: currentUserData.role,
      action: 'Action Sent to Approval Queue',
      resource: `Approval Queue (${approvalId})`,
      status: 'Pending',
      category: 'Approval',
      details: `Queued for HOD approval.`,
      department: currentUserData.department
    };

    createdAudits.push(audit1, audit2);
    mockAuditEvents.unshift(...createdAudits);

    return { draft, newApproval: approvalItem, auditEvents: createdAudits };
  }
};

// ============================================================================
// APPROVAL SERVICE (/api/approvals)
// ============================================================================
export const mockApprovalService = {
  async getPendingApprovals(role: UserRole = 'student', userName?: string): Promise<ApprovalItem[]> {
    if (role === 'student') {
      // Student sees approvals for their own requests
      return mockApprovals.filter((a) => a.applicantName === userName || a.draft.applicantName === userName);
    }
    if (role === 'faculty') {
      // Faculty sees approvals for student requests or faculty requests
      return mockApprovals.filter((a) => a.applicantRole === 'student' || a.applicantName === userName);
    }
    // HOD sees department approval queue
    return mockApprovals.filter((a) => a.assignedToRole === 'hod' || a.status === 'Pending Approval');
  },

  async approveAction(approvalId: string, reviewerUser: User, notes?: string): Promise<{ approval: ApprovalItem; auditEvents: AuditEvent[] }> {
    const item = mockApprovals.find((a) => a.id === approvalId);
    const createdAudits: AuditEvent[] = [];

    if (item) {
      item.status = 'Approved';
      item.draft.status = 'Approved';
      if (notes) item.reviewerNotes = notes;

      const audit1: AuditEvent = {
        id: `audit-${Date.now()}-app1`,
        timestamp: new Date().toISOString(),
        timeFormatted: getFormattedTime(),
        actor: `${reviewerUser.name} (${reviewerUser.role.toUpperCase()})`,
        actorRole: reviewerUser.role,
        action: 'Human Approval Granted',
        resource: item.workflowTitle,
        status: 'Success',
        category: 'Approval',
        details: `${reviewerUser.name} approved request for ${item.draft.applicantName}.`,
        department: reviewerUser.department
      };

      const audit2: AuditEvent = {
        id: `audit-${Date.now()}-app2`,
        timestamp: new Date().toISOString(),
        timeFormatted: getFormattedTime(),
        actor: 'CampusIQ Gateway',
        actorRole: 'system' as any,
        action: 'Official Application Submitted',
        resource: item.draft.recipientDepartment,
        status: 'Success',
        category: 'System',
        details: `Application #${item.draft.id} submitted to ${item.draft.recipientDepartment}.`,
        department: reviewerUser.department
      };

      createdAudits.push(audit1, audit2);
      mockAuditEvents.unshift(...createdAudits);
    }

    return { approval: item || mockApprovals[0], auditEvents: createdAudits };
  },

  async rejectAction(approvalId: string, reviewerUser: User, reason?: string): Promise<{ approval: ApprovalItem; auditEvents: AuditEvent[] }> {
    const item = mockApprovals.find((a) => a.id === approvalId);
    const createdAudits: AuditEvent[] = [];

    if (item) {
      item.status = 'Rejected';
      item.draft.status = 'Rejected';

      const audit: AuditEvent = {
        id: `audit-${Date.now()}-rej`,
        timestamp: new Date().toISOString(),
        timeFormatted: getFormattedTime(),
        actor: `${reviewerUser.name} (${reviewerUser.role.toUpperCase()})`,
        actorRole: reviewerUser.role,
        action: 'Application Rejected',
        resource: item.workflowTitle,
        status: 'Failed',
        category: 'Approval',
        details: `Request rejected by ${reviewerUser.name}. Reason: ${reason || 'Not approved.'}`,
        department: reviewerUser.department
      };

      createdAudits.push(audit);
      mockAuditEvents.unshift(...createdAudits);
    }

    return { approval: item || mockApprovals[0], auditEvents: createdAudits };
  }
};

// ============================================================================
// AUDIT SERVICE (/api/audit)
// ============================================================================
export const mockAuditService = {
  async getAuditLogs(category: AuditCategory = 'All', role: UserRole = 'student', userName?: string): Promise<AuditEvent[]> {
    let baseLogs = [...mockAuditEvents];

    if (role === 'student') {
      // Student sees only their own actions
      baseLogs = baseLogs.filter(
        (log) => log.actor.includes(userName || 'Trisha') || log.actorRole === 'student' || log.category === 'Questions'
      );
    } else if (role === 'faculty') {
      // Faculty sees their actions & student workflow items
      baseLogs = baseLogs.filter(
        (log) => log.actorRole === 'faculty' || log.category === 'Workflow' || log.category === 'Approval'
      );
    }

    if (category === 'All') {
      return baseLogs;
    }
    return baseLogs.filter((event) => event.category === category);
  }
};

// ============================================================================
// DEPARTMENT SERVICES (/api/students, /api/faculty)
// ============================================================================
export const mockDepartmentService = {
  async getStudents(role: UserRole = 'hod'): Promise<StudentItem[]> {
    if (role === 'student') {
      return mockStudentsList.filter((s) => s.name === studentUser.name);
    }
    return [...mockStudentsList];
  },

  async getFaculty(role: UserRole = 'hod'): Promise<FacultyItem[]> {
    if (role === 'student') return [];
    return [...mockFacultyList];
  }
};
