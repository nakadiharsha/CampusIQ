import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import type { PageId, UserRole } from '../../types';
import {
  LayoutDashboard, MessageSquare, GitPullRequest, CheckSquare, FileText, Users, Award, BarChart3, CalendarDays, Megaphone, Shield, Settings, LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, user, notificationCount } = useApp();
  const { logout } = useAuth();

  const getNavItems = (role: UserRole) => {
    switch (role) {
      case 'student':
        return [
          { id: 'overview' as PageId, label: 'Today', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'timetable' as PageId, label: 'My Timetable', icon: <CalendarDays className="w-4 h-4" /> },
          { id: 'attendance' as PageId, label: 'My Attendance', icon: <CheckSquare className="w-4 h-4" /> },
          { id: 'ask' as PageId, label: 'Ask CampusIQ', icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'notes' as PageId, label: 'Notes', icon: <FileText className="w-4 h-4" /> },
          { id: 'announcements' as PageId, label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
          { id: 'events' as PageId, label: 'Events', icon: <CalendarDays className="w-4 h-4" /> },
          { id: 'requests' as PageId, label: 'My Requests', icon: <GitPullRequest className="w-4 h-4" /> }
        ];
      case 'faculty':
        return [
          { id: 'overview' as PageId, label: 'Faculty Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'attendance' as PageId, label: 'Update Attendance', icon: <CheckSquare className="w-4 h-4" /> },
          { id: 'notes' as PageId, label: 'Send Notes', icon: <FileText className="w-4 h-4" /> },
          { id: 'announcements' as PageId, label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
          { id: 'events' as PageId, label: 'Events', icon: <CalendarDays className="w-4 h-4" /> }
        ];
      case 'hod':
        return [
          { id: 'overview' as PageId, label: 'HOD Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'announcements' as PageId, label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
          { id: 'approvals' as PageId, label: 'Student Requests', icon: <CheckSquare className="w-4 h-4" />, badge: notificationCount },
          { id: 'events' as PageId, label: 'Manage Events', icon: <CalendarDays className="w-4 h-4" /> },
          { id: 'faculty-members' as PageId, label: 'Faculty', icon: <Award className="w-4 h-4" /> },
          { id: 'students' as PageId, label: 'Students', icon: <Users className="w-4 h-4" /> },
          { id: 'analytics' as PageId, label: 'Department Overview', icon: <BarChart3 className="w-4 h-4" /> }
        ];
      default:
        return [{ id: 'overview' as PageId, label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> }];
    }
  };

  const navItems = getNavItems(user.role);

  return (
    <aside className="w-64 bg-[#1F3A5F] text-white flex flex-col h-screen shrink-0 border-r border-[#172D4A] select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#315A7D]/40 flex items-center gap-3">
        <div className="w-9 h-9 bg-[#2F7D6D] rounded flex items-center justify-center text-white font-bold text-lg shadow-sm border border-[#3E9A87]">
          C
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white">CampusIQ</span>
            <span className="text-[10px] font-mono font-bold bg-[#2F7D6D] px-1.5 py-0.2 rounded text-white uppercase">
              v1.0
            </span>
          </div>
          <span className="text-[11px] text-[#A0AEC0] block leading-tight">Private Institutional AI</span>
        </div>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-4 py-2 bg-[#172D4A] border-b border-[#315A7D]/40 flex items-center justify-between text-xs">
        <span className="text-[#A0AEC0] font-semibold text-[11px] uppercase tracking-wider">
          Role: <strong className="text-white font-bold uppercase">{user.role}</strong>
        </span>
        <span className="text-[10px] font-mono bg-[#315A7D] px-1.5 py-0.5 rounded text-white font-medium">
          CSE Dept
        </span>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-[#A0AEC0]">
          {user.role.toUpperCase()} NAVIGATION
        </div>
        {navItems.map((item) => {
          const isActive =
            activePage === item.id ||
            (activePage === 'workflow-builder' && item.id === 'workflows');
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#315A7D] text-white shadow-sm border-l-4 border-[#2F7D6D]'
                  : 'text-[#E2E8F0] hover:bg-[#2A4C73] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-[#2F7D6D]' : 'text-[#A0AEC0]'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-[#B7791F] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Pipeline Quick Reference */}
      <div className="mx-3 my-2 p-2.5 bg-[#172D4A] rounded border border-[#315A7D]/40 text-[11px] text-[#CBD5E1]">
        <div className="flex items-center gap-1.5 font-bold text-white text-[10px] uppercase tracking-wider mb-1">
          <Shield className="w-3 h-3 text-[#2F7D6D]" /> Institutional Trust
        </div>
        <p className="text-[10px] text-[#A0AEC0] leading-tight">
          Grounded RAG • Human Approval • Persistent Audit
        </p>
      </div>

      {/* Footer Navigation & User Card */}
      <div className="border-t border-[#315A7D]/40 p-3 space-y-2">
        <button
          onClick={() => setActivePage('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold cursor-pointer ${
            activePage === 'settings'
              ? 'bg-[#315A7D] text-white'
              : 'text-[#E2E8F0] hover:bg-[#2A4C73]'
          }`}
        >
          <Settings className="w-4 h-4 text-[#A0AEC0]" />
          <span>Settings</span>
        </button>

        {/* User Profile Card */}
        <div className="p-2.5 bg-[#172D4A] rounded border border-[#315A7D]/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded bg-[#2F7D6D] text-white font-bold text-xs flex items-center justify-center shrink-0 border border-[#3E9A87]">
              {user.avatar}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-[#A0AEC0] truncate capitalize">{user.role} • {user.departmentName}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1 text-[#A0AEC0] hover:text-white hover:bg-[#315A7D] rounded cursor-pointer shrink-0"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
