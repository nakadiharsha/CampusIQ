import React, { useState } from 'react';
import type { ApprovalItem } from '../../types';
import { X, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, FileText, UserCheck, BookOpen } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface ApprovalDetailModalProps {
  item: ApprovalItem | null;
  onClose: () => void;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason?: string) => void;
}

export const ApprovalDetailModal: React.FC<ApprovalDetailModalProps> = ({
  item,
  onClose,
  onApprove,
  onReject
}) => {
  const [notes, setNotes] = useState('');

  if (!item) return null;

  const isPending = item.status === 'Pending Approval';

  return (
    <div className="fixed inset-0 z-50 bg-[#17202A]/40 backdrop-blur-none flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-lg border border-[#D9DEE5] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="p-4 border-b border-[#D9DEE5] bg-[#F7F8FA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1F3A5F] text-white rounded">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#17202A]">{item.workflowTitle}</h2>
                <StatusBadge status={item.status} />
              </div>
              <span className="text-xs text-[#667085]">Approval Request ID: {item.id} • Created {item.createdDate}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#667085] hover:text-[#17202A] hover:bg-[#D9DEE5]/50 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner emphasizing human approval */}
        <div className="bg-[#FEFCBF] border-b border-[#F6E05E] px-4 py-2.5 text-xs text-[#B7791F] flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#B7791F]" />
          <span>
            <strong>HUMAN APPROVAL MANDATORY:</strong> CampusIQ has prepared this draft from verified policies. No official action will be taken until you explicitly click "Approve & Submit".
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Action Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F7F8FA] p-3.5 rounded border border-[#D9DEE5]">
              <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block mb-1">
                Requested Action
              </span>
              <p className="text-sm font-bold text-[#1F3A5F]">{item.requestedAction}</p>
            </div>
            <div className="bg-[#F7F8FA] p-3.5 rounded border border-[#D9DEE5]">
              <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block mb-1">
                Target Department
              </span>
              <p className="text-sm font-bold text-[#17202A]">{item.draft.recipientDepartment}</p>
            </div>
          </div>

          {/* Generated Document Draft */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#315A7D]" />
                Generated Application Preview
              </h3>
              <span className="text-[11px] text-[#667085]">Subject: {item.draft.subject}</span>
            </div>
            <div className="bg-white border border-[#D9DEE5] rounded p-4 font-mono text-xs text-[#17202A] whitespace-pre-wrap leading-relaxed">
              {item.draft.generatedBody}
            </div>
          </div>

          {/* Institutional Grounding & Context Used */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Policy Reference */}
            <div className="border border-[#D9DEE5] rounded p-3 bg-[#F7F8FA]">
              <h4 className="text-xs font-bold text-[#1F3A5F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#2F7D6D]" />
                Policy Grounding
              </h4>
              <p className="text-xs text-[#17202A] font-semibold mb-1">{item.draft.policyReference}</p>
              {item.draft.sourcesUsed.map((src, i) => (
                <div key={i} className="text-[11px] text-[#667085] bg-white p-2 rounded border border-[#D9DEE5] mt-1.5">
                  <span className="font-semibold text-[#17202A]">{src.documentTitle} (p. {src.pageNumber})</span>
                  <p className="mt-0.5 line-clamp-2">{src.excerpt}</p>
                </div>
              ))}
            </div>

            {/* User Context Used */}
            <div className="border border-[#D9DEE5] rounded p-3 bg-[#F7F8FA]">
              <h4 className="text-xs font-bold text-[#1F3A5F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#315A7D]" />
                User Context Injected
              </h4>
              <div className="space-y-1 text-xs text-[#17202A]">
                <div className="flex justify-between py-1 border-b border-[#D9DEE5]">
                  <span className="text-[#667085]">Applicant Name:</span>
                  <span className="font-medium">{item.draft.applicantName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D9DEE5]">
                  <span className="text-[#667085]">USN / Roll No:</span>
                  <span className="font-mono font-medium">{item.draft.applicantId}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#667085]">Program:</span>
                  <span className="font-medium">{item.draft.program}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes / Comments input */}
          {isPending && (
            <div>
              <label className="block text-xs font-bold text-[#1F3A5F] uppercase tracking-wider mb-1">
                Approver Remarks / Note (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add optional notes for audit log..."
                className="w-full text-xs p-2.5 border border-[#D9DEE5] rounded focus:outline-none focus:border-[#1F3A5F] bg-white"
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#D9DEE5] bg-[#F7F8FA] flex items-center justify-between">
          <span className="text-xs text-[#667085]">
            CampusIQ Pipeline: <strong>PREPARE → APPROVE → AUDIT</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-[#17202A] bg-white border border-[#D9DEE5] rounded hover:bg-[#F7F8FA] cursor-pointer"
            >
              Close
            </button>

            {isPending && (
              <>
                <button
                  onClick={() => onReject(item.id, notes)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#B54747] rounded hover:bg-[#9B3C3C] flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => onApprove(item.id, notes)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#2F7D6D] rounded hover:bg-[#266457] flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve & Submit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
