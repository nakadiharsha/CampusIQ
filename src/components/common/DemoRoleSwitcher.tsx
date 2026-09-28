import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Code, UserCheck } from 'lucide-react';
import type { UserRole } from '../../types';

export const DemoRoleSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { user, switchDemoRole } = useAuth();
  const { setActivePage, refreshData } = useApp();

  const handleSwitch = (role: UserRole) => {
    switchDemoRole(role);
    refreshData();
    setActivePage('overview');
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 bg-[#F7F8FA] border border-[#D9DEE5] rounded p-1 text-[11px]">
        <span className="text-[#667085] font-semibold px-1 text-[10px] uppercase">Demo Role:</span>
        <button
          onClick={() => handleSwitch('student')}
          className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
            user?.role === 'student'
              ? 'bg-[#1F3A5F] text-white'
              : 'text-[#17202A] hover:bg-[#D9DEE5]/40'
          }`}
        >
          Student
        </button>
        <button
          onClick={() => handleSwitch('faculty')}
          className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
            user?.role === 'faculty'
              ? 'bg-[#1F3A5F] text-white'
              : 'text-[#17202A] hover:bg-[#D9DEE5]/40'
          }`}
        >
          Faculty
        </button>
        <button
          onClick={() => handleSwitch('hod')}
          className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
            user?.role === 'hod'
              ? 'bg-[#2F7D6D] text-white'
              : 'text-[#17202A] hover:bg-[#D9DEE5]/40'
          }`}
        >
          HOD
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8FA] border border-[#D9DEE5] rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-[#1F3A5F]">
        <Code className="w-4 h-4 text-[#2F7D6D]" />
        <span>Development Demo Role Switcher</span>
        <span className="text-[10px] bg-[#FEFCBF] text-[#B7791F] px-2 py-0.5 rounded border border-[#F6E05E] font-medium">
          Prototype Conveniences Only
        </span>
      </div>

      <p className="text-xs text-[#667085] leading-snug">
        Switch authenticated persona in 1-click. Navigations, route permissions, datasets, approval queues, and audit trails will update instantly.
      </p>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <button
          onClick={() => handleSwitch('student')}
          className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
            user?.role === 'student'
              ? 'bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-sm'
              : 'bg-white text-[#17202A] border-[#D9DEE5] hover:border-[#1F3A5F]'
          }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span>Student</span>
            {user?.role === 'student' && <UserCheck className="w-3.5 h-3.5 text-[#2F7D6D]" />}
          </div>
          <span className={`text-[10px] block mt-0.5 ${user?.role === 'student' ? 'text-[#E2E8F0]' : 'text-[#667085]'}`}>
            Trisha D M (3rd Year)
          </span>
        </button>

        <button
          onClick={() => handleSwitch('faculty')}
          className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
            user?.role === 'faculty'
              ? 'bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-sm'
              : 'bg-white text-[#17202A] border-[#D9DEE5] hover:border-[#1F3A5F]'
          }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span>Faculty</span>
            {user?.role === 'faculty' && <UserCheck className="w-3.5 h-3.5 text-[#2F7D6D]" />}
          </div>
          <span className={`text-[10px] block mt-0.5 ${user?.role === 'faculty' ? 'text-[#E2E8F0]' : 'text-[#667085]'}`}>
            Dr. Ananya Rao
          </span>
        </button>

        <button
          onClick={() => handleSwitch('hod')}
          className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
            user?.role === 'hod'
              ? 'bg-[#2F7D6D] text-white border-[#2F7D6D] shadow-sm'
              : 'bg-white text-[#17202A] border-[#D9DEE5] hover:border-[#2F7D6D]'
          }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span>HOD</span>
            {user?.role === 'hod' && <UserCheck className="w-3.5 h-3.5 text-white" />}
          </div>
          <span className={`text-[10px] block mt-0.5 ${user?.role === 'hod' ? 'text-[#E2E8F0]' : 'text-[#667085]'}`}>
            Dr. Rajesh Kumar
          </span>
        </button>
      </div>
    </div>
  );
};
