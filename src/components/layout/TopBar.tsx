import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, Cpu, ChevronDown, LogOut, Settings } from 'lucide-react';
import { DemoRoleSwitcher } from '../common/DemoRoleSwitcher';

export const TopBar: React.FC = () => {
  const { activePage, user, notificationCount, setActivePage, quickAskQuestion } = useApp();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getPageTitle = (): string => {
    switch (activePage) {
      case 'overview':
        return `${user.role.toUpperCase()} Dashboard`;
      case 'ask':
        return 'Ask CampusIQ';
      case 'knowledge':
        return user.role === 'hod' ? 'Department Knowledge Index' : 'Knowledge Base';
      case 'memory':
        return user.role === 'student' ? 'My Memory' : `${user.role.toUpperCase()} Memory`;
      case 'workflows':
        return user.role === 'hod' ? 'Department Workflows' : 'Institutional Workflows';
      case 'workflow-builder':
        return 'Workflow Builder & Draft Generator';
      case 'approvals':
        return user.role === 'hod' ? 'Executive Approvals Queue' : 'Pending Approvals';
      case 'requests':
        return 'My Requests & Submissions';
      case 'students':
        return 'Department Students Directory';
      case 'faculty-members':
        return 'Department Faculty Roster';
      case 'department-info':
        return 'Department Information';
      case 'analytics':
        return 'Department Analytics & Governance';
      case 'audit':
        return 'Audit Logs';
      case 'settings':
        return 'System & Role Configuration';
      case 'access-restricted':
        return 'Access Restricted';
      default:
        return 'CampusIQ';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    quickAskQuestion(searchQuery);
    setSearchQuery('');
  };

  return (
    <header className="h-16 bg-white border-b border-[#D9DEE5] px-6 flex items-center justify-between shrink-0 z-20 select-none">
      {/* Page Title & Role Badge */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-[#17202A] tracking-tight">{getPageTitle()}</h1>

        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border bg-[#1F3A5F] text-white border-[#172D4A]">
          {user.role}
        </span>

        {/* Local AI status indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#EBF5F3] border border-[#BCE1D9] rounded text-[11px] font-semibold text-[#2F7D6D]">
          <span className="w-2 h-2 rounded-full bg-[#2F7D6D] animate-pulse"></span>
          <Cpu className="w-3.5 h-3.5 text-[#2F7D6D]" />
          <span>Local AI Active</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Compact Demo Role Switcher */}
        <div className="hidden md:block">
          <DemoRoleSwitcher compact />
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative hidden xl:block w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search policies or ask..."
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-[#D9DEE5] rounded bg-[#F7F8FA] text-[#17202A] focus:outline-none focus:border-[#1F3A5F] focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-[#667085] absolute left-2.5 top-2.5" />
        </form>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-1.5 text-[#667085] hover:text-[#17202A] hover:bg-[#F7F8FA] border border-transparent hover:border-[#D9DEE5] rounded cursor-pointer relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#B7791F] rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#D9DEE5] rounded-md shadow-lg p-3 text-xs z-50">
              <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2 mb-2 font-bold text-[#1F3A5F]">
                <span>Notifications ({user.role.toUpperCase()})</span>
                <span className="text-[10px] text-[#667085]">{notificationCount} pending</span>
              </div>
              {notificationCount > 0 ? (
                <div
                  onClick={() => {
                    setActivePage(user.role === 'hod' ? 'approvals' : 'requests');
                    setShowNotifications(false);
                  }}
                  className="p-2 bg-[#F7F8FA] border border-[#D9DEE5] rounded hover:bg-[#EBF5F3] cursor-pointer"
                >
                  <span className="font-bold text-[#17202A] block">Pending Request Action</span>
                  <span className="text-[11px] text-[#667085] block mt-0.5">
                    {user.role === 'hod'
                      ? 'Approvals queue has requests requiring HOD sign-off.'
                      : 'You have pending application reviews.'}
                  </span>
                </div>
              ) : (
                <p className="text-[#667085] text-[11px] py-1 text-center">All approval queues up to date.</p>
              )}
            </div>
          )}
        </div>

        {/* User Profile Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 border-l border-[#D9DEE5] pl-3 hover:opacity-80 cursor-pointer"
          >
            <div className="w-7 h-7 bg-[#1F3A5F] text-white font-bold text-xs rounded flex items-center justify-center border border-[#315A7D]">
              {user.avatar}
            </div>
            <div className="hidden lg:block text-left text-xs text-[#17202A]">
              <span className="font-bold block leading-tight">{user.name}</span>
              <span className="text-[10px] text-[#667085] capitalize">{user.role} • {user.departmentName}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#D9DEE5] rounded-md shadow-lg p-3 text-xs z-50 space-y-3">
              <div className="border-b border-[#D9DEE5] pb-2">
                <span className="font-bold text-[#1F3A5F] block">{user.name}</span>
                <span className="text-[11px] text-[#667085] block">{user.email}</span>
                <span className="text-[10px] font-bold uppercase text-[#2F7D6D] bg-[#EBF5F3] px-1.5 py-0.2 rounded border border-[#BCE1D9] inline-block mt-1">
                  {user.role} • {user.departmentName}
                </span>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActivePage('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#F7F8FA] flex items-center gap-2 font-medium cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-[#315A7D]" />
                  <span>Settings & Role Configuration</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#FFF5F5] text-[#B54747] flex items-center gap-2 font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>

              {/* In-menu demo role switcher */}
              <div className="pt-2 border-t border-[#D9DEE5]">
                <DemoRoleSwitcher />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
