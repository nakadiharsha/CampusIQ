import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import type { UserRole } from '../types';

interface AccessRestrictedPageProps {
  requiredRole?: UserRole;
  requiredPermission?: string;
}

export const AccessRestrictedPage: React.FC<AccessRestrictedPageProps> = ({
  requiredRole = 'hod',
  requiredPermission
}) => {
  const { user } = useAuth();
  const { setActivePage } = useApp();

  return (
    <div className="bg-white border border-[#D9DEE5] rounded-lg p-8 max-w-xl mx-auto text-center space-y-5 my-8 shadow-sm">
      <div className="w-14 h-14 bg-[#FFF5F5] border border-[#FEB2B2] text-[#B54747] rounded-full flex items-center justify-center mx-auto">
        <ShieldAlert className="w-7 h-7" />
      </div>

      <div>
        <h1 className="text-xl font-extrabold text-[#1F3A5F]">Access Restricted</h1>
        <p className="text-xs text-[#667085] mt-1">
          You don't have permission to access this area of CampusIQ.
        </p>
      </div>

      <div className="bg-[#F7F8FA] border border-[#D9DEE5] rounded p-4 text-xs text-left space-y-2">
        <div className="flex justify-between border-b border-[#D9DEE5] pb-2">
          <span className="text-[#667085]">Authenticated Account:</span>
          <span className="font-bold text-[#17202A]">{user?.name || 'User'}</span>
        </div>
        <div className="flex justify-between border-b border-[#D9DEE5] pb-2">
          <span className="text-[#667085]">Your Active Role:</span>
          <span className="font-bold uppercase text-[#B7791F] bg-[#FEFCBF] px-2 py-0.5 rounded border border-[#F6E05E] text-[10px]">
            {user?.role || 'student'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#667085]">Required Authorization:</span>
          <span className="font-mono font-semibold text-[#1F3A5F]">
            {requiredRole.toUpperCase()} {requiredPermission ? `(${requiredPermission})` : ''}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-[#667085] leading-relaxed">
        CampusIQ strictly enforces role-based authorization to protect student data and departmental administrative functions.
      </p>

      <div className="pt-2">
        <button
          onClick={() => setActivePage('overview')}
          className="px-5 py-2.5 bg-[#1F3A5F] text-white text-xs font-bold rounded hover:bg-[#172D4A] inline-flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to my dashboard</span>
        </button>
      </div>
    </div>
  );
};
