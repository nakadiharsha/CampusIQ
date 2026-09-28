import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { AccessRestrictedPage } from './pages/AccessRestrictedPage';
import { StudentDashboard } from './pages/dashboards/StudentDashboard';
import { FacultyDashboard } from './pages/dashboards/FacultyDashboard';
import { HODDashboard } from './pages/dashboards/HODDashboard';
import { AskPage } from './pages/AskPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { MemoryPage } from './pages/MemoryPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { WorkflowBuilderPage } from './pages/WorkflowBuilderPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { RequestsPage } from './pages/RequestsPage';
import { StudentsPage } from './pages/StudentsPage';
import { FacultyPage } from './pages/FacultyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DepartmentInfoPage } from './pages/DepartmentInfoPage';
import { AuditPage } from './pages/AuditPage';
import { SettingsPage } from './pages/SettingsPage';
import { TimetablePage } from './pages/TimetablePage';
import { AttendancePage } from './pages/AttendancePage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { NotesPage } from './pages/NotesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { EventsPage } from './pages/EventsPage';

const MainRouter: React.FC = () => {
  const { activePage } = useApp();
  const { user, hasPermission } = useAuth();

  if (!user) return <LoginPage />;

  switch (activePage) {
    case 'overview':
      if (user.role === 'faculty') return <FacultyDashboard />;
      if (user.role === 'hod') return <HODDashboard />;
      return <StudentDashboard />;

    case 'timetable':
      return user.role === 'student' ? <TimetablePage /> : <AccessRestrictedPage requiredRole="student" />;

    case 'attendance':
      return (user.role === 'student' || user.role === 'faculty') ? <AttendancePage /> : <AccessRestrictedPage />;

    case 'study-planner':
      return user.role === 'student' ? <StudyPlannerPage /> : <AccessRestrictedPage requiredRole="student" />;

    case 'notes':
      return (user.role === 'student' || user.role === 'faculty') ? <NotesPage /> : <AccessRestrictedPage />;

    case 'announcements':
      return (user.role === 'student' || user.role === 'faculty' || user.role === 'hod') ? <AnnouncementsPage /> : <AccessRestrictedPage />;

    case 'events':
      return (user.role === 'student' || user.role === 'faculty' || user.role === 'hod') ? <EventsPage /> : <AccessRestrictedPage />;

    case 'ask':
      return user.role === 'student' ? <AskPage /> : <AccessRestrictedPage requiredRole="student" />;

    case 'knowledge':
      return <KnowledgePage />;

    case 'memory':
      return <MemoryPage />;

    case 'workflows':
      return <WorkflowsPage />;

    case 'workflow-builder':
      return <WorkflowBuilderPage />;

    case 'approvals':
      if (user.role === 'student') return <RequestsPage />;
      return <ApprovalsPage />;

    case 'requests':
      return <RequestsPage />;

    case 'students':
      if (!hasPermission('students.read.department')) {
        return <AccessRestrictedPage requiredRole="faculty" requiredPermission="students.read.department" />;
      }
      return <StudentsPage />;

    case 'faculty-members':
      if (!hasPermission('faculty.read.department')) {
        return <AccessRestrictedPage requiredRole="hod" requiredPermission="faculty.read.department" />;
      }
      return <FacultyPage />;

    case 'analytics':
      if (!hasPermission('analytics.read.department')) {
        return <AccessRestrictedPage requiredRole="hod" requiredPermission="analytics.read.department" />;
      }
      return <AnalyticsPage />;

    case 'department-info':
      return <DepartmentInfoPage />;

    case 'audit':
      return <AuditPage />;

    case 'settings':
      return <SettingsPage />;

    case 'access-restricted':
      return <AccessRestrictedPage />;

    default:
      if (user.role === 'faculty') return <FacultyDashboard />;
      if (user.role === 'hod') return <HODDashboard />;
      return <StudentDashboard />;
  }
};

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppProvider>
      <Layout>
        <MainRouter />
      </Layout>
    </AppProvider>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;
