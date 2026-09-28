import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PipelineBanner } from '../components/common/PipelineBanner';
import { CheckSquare, ShieldCheck, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react';

export const ApprovalsPage: React.FC = () => {
  const { approvals, setSelectedApproval } = useApp();

  const pendingApprovals = approvals.filter((a) => a.status === 'Pending Approval');
  const completedApprovals = approvals.filter((a) => a.status !== 'Pending Approval');

  return (
    <div className="space-y-6">
      {/* Pipeline Banner */}
      <PipelineBanner currentStage="APPROVE" compact />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#1F3A5F]">Pending Approvals</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Review and grant explicit human authorization for CampusIQ-prepared administrative actions.
          </p>
        </div>
        <span className="text-xs font-bold text-[#B7791F] bg-[#FEFCBF] px-3 py-1 rounded border border-[#F6E05E]">
          {pendingApprovals.length} Action{pendingApprovals.length === 1 ? '' : 's'} Awaiting Approval
        </span>
      </div>

      {/* Product Principle Callout */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg p-4 flex items-start gap-3">
        <div className="p-2 bg-[#FEFCBF] text-[#B7791F] rounded shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-[#17202A] space-y-1">
          <span className="font-bold text-[#1F3A5F] block">Controlled Actions & Human-in-the-Loop</span>
          <p className="text-[#667085] leading-relaxed">
            CampusIQ adheres strictly to institutional governance. AI system agents reason and prepare formal letters, but official submission to college departments is strictly gated until an authorized human approves the proposed request.
          </p>
        </div>
      </div>

      {/* Pending Items Table / Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#B7791F]" />
          Action Queue Requiring Sign-off
        </h2>

        {pendingApprovals.length === 0 ? (
          <div className="bg-white border border-[#D9DEE5] rounded-lg p-8 text-center text-xs text-[#667085]">
            <CheckCircle2 className="w-8 h-8 text-[#2F7D6D] mx-auto mb-2" />
            <span className="font-bold text-[#1F3A5F] block">All Pending Approvals Processed</span>
            <p className="text-[11px] mt-0.5">No actions currently require human approval sign-off.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#D9DEE5] rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#17202A]">
                <thead className="bg-[#F7F8FA] border-b border-[#D9DEE5] text-[#1F3A5F] font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Workflow Title</th>
                    <th className="p-3.5">Requested Action</th>
                    <th className="p-3.5">Target Department</th>
                    <th className="p-3.5">Created Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9DEE5]">
                  {pendingApprovals.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="p-3.5 font-bold text-[#1F3A5F]">{item.workflowTitle}</td>
                      <td className="p-3.5 font-medium text-[#17202A]">{item.requestedAction}</td>
                      <td className="p-3.5 text-[#667085]">{item.draft.recipientDepartment}</td>
                      <td className="p-3.5 font-mono text-[#667085]">{item.createdDate}</td>
                      <td className="p-3.5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedApproval(item)}
                          className="px-3.5 py-1.5 bg-[#2F7D6D] text-white text-xs font-bold rounded hover:bg-[#266457] flex items-center gap-1.5 ml-auto cursor-pointer shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review & Approve</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Completed Approvals History */}
      {completedApprovals.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[#D9DEE5]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#2F7D6D]" />
            Processed Approvals History
          </h2>

          <div className="bg-white border border-[#D9DEE5] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs text-[#17202A]">
              <thead className="bg-[#F7F8FA] border-b border-[#D9DEE5] text-[#1F3A5F] font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3">Workflow</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE5]">
                {completedApprovals.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F8FA]">
                    <td className="p-3 font-bold text-[#1F3A5F]">{item.workflowTitle}</td>
                    <td className="p-3 text-[#17202A]">{item.requestedAction}</td>
                    <td className="p-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedApproval(item)}
                        className="px-2.5 py-1 bg-[#F7F8FA] border border-[#D9DEE5] rounded text-[11px] text-[#315A7D] hover:bg-[#1F3A5F] hover:text-white cursor-pointer"
                      >
                        Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
