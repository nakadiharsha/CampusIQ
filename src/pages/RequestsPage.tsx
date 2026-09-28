import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { FileText, ArrowRight } from 'lucide-react';

export const RequestsPage: React.FC = () => {
  const { approvals, setSelectedApproval, setActivePage, user } = useApp();

  return (
    <div className="space-y-6 text-[#17202A]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#D9DEE5] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#1F3A5F]">My Requests & Submitted Workflows</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Track status and progress of institutional applications logged for {user.name} ({user.role.toUpperCase()}).
          </p>
        </div>
        <button
          onClick={() => setActivePage('workflows')}
          className="px-4 py-2 bg-[#1F3A5F] text-white text-xs font-bold rounded hover:bg-[#172D4A] cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <span>Start new request</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-white border border-[#D9DEE5] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#17202A]">
            <thead className="bg-[#F7F8FA] border-b border-[#D9DEE5] text-[#1F3A5F] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Workflow Title</th>
                <th className="p-3.5">Recipient Department</th>
                <th className="p-3.5">Purpose / Subject</th>
                <th className="p-3.5">Created Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Inspect Draft</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE5]">
              {approvals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#667085]">
                    No workflow requests logged yet.
                  </td>
                </tr>
              ) : (
                approvals.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="p-3.5 font-bold text-[#1F3A5F] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#315A7D]" />
                      <span>{item.workflowTitle}</span>
                    </td>
                    <td className="p-3.5 text-[#667085]">{item.draft.recipientDepartment}</td>
                    <td className="p-3.5 max-w-xs truncate">{item.draft.purpose}</td>
                    <td className="p-3.5 font-mono text-[#667085]">{item.createdDate}</td>
                    <td className="p-3.5">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedApproval(item)}
                        className="px-3 py-1 text-[11px] font-semibold text-[#315A7D] bg-[#F7F8FA] border border-[#D9DEE5] rounded hover:bg-[#1F3A5F] hover:text-white cursor-pointer"
                      >
                        Inspect Preview →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
