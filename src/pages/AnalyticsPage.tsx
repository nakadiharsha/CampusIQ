import React from 'react';
import { BarChart3, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 text-[#17202A]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#D9DEE5] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#1F3A5F]">Department Analytics & Governance Metrics</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Department of Computer Science and Engineering • Executive SLA & Usage Overview
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-[#2F7D6D] bg-[#EBF5F3] px-3 py-1.5 rounded border border-[#BCE1D9]">
          Real-time Audit Synchronized
        </span>
      </div>

      {/* Overview Analytics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-4">
          <span className="text-xs text-[#667085] block">Average Approval SLA</span>
          <div className="text-2xl font-extrabold text-[#2F7D6D] mt-1">18.4 Hours</div>
          <span className="text-[11px] text-[#2F7D6D] font-medium block mt-0.5">Target: &lt; 24.0 Hours</span>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-lg p-4">
          <span className="text-xs text-[#667085] block">RAG Retrieval Precision</span>
          <div className="text-2xl font-extrabold text-[#1F3A5F] mt-1">96.8%</div>
          <span className="text-[11px] text-[#667085] font-medium block mt-0.5">Verified page grounding</span>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-lg p-4">
          <span className="text-xs text-[#667085] block">Monthly Completed Requests</span>
          <div className="text-2xl font-extrabold text-[#1F3A5F] mt-1">248</div>
          <span className="text-[11px] text-[#2F7D6D] font-medium block mt-0.5">100% human sign-off</span>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-lg p-4">
          <span className="text-xs text-[#667085] block">Document Vector Chunks</span>
          <div className="text-2xl font-extrabold text-[#315A7D] mt-1">12,480</div>
          <span className="text-[11px] text-[#667085] font-medium block mt-0.5">128 Department Handbooks</span>
        </div>
      </div>

      {/* Breakdown Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Types Breakdown */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] border-b border-[#D9DEE5] pb-2 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#315A7D]" />
            Workflow Submissions Breakdown (This Semester)
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Bonafide Certificate Requests</span>
                <span>124 Requests (50%)</span>
              </div>
              <div className="w-full bg-[#F7F8FA] h-2.5 rounded overflow-hidden border border-[#D9DEE5]">
                <div className="bg-[#1F3A5F] h-full w-[50%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Student Duty Leave (OD / Sports)</span>
                <span>68 Requests (27%)</span>
              </div>
              <div className="w-full bg-[#F7F8FA] h-2.5 rounded overflow-hidden border border-[#D9DEE5]">
                <div className="bg-[#2F7D6D] h-full w-[27%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Faculty Duty & Travel Grants</span>
                <span>36 Requests (15%)</span>
              </div>
              <div className="w-full bg-[#F7F8FA] h-2.5 rounded overflow-hidden border border-[#D9DEE5]">
                <div className="bg-[#315A7D] h-full w-[15%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Transcript & Official Verification</span>
                <span>20 Requests (8%)</span>
              </div>
              <div className="w-full bg-[#F7F8FA] h-2.5 rounded overflow-hidden border border-[#D9DEE5]">
                <div className="bg-[#B7791F] h-full w-[8%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* SLA & Governance Quality */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] border-b border-[#D9DEE5] pb-2 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2F7D6D]" />
            Department Governance Quality Indicators
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#EBF5F3] border border-[#BCE1D9] rounded flex items-start gap-2 text-[#2F7D6D]">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">100% Grounded Policy Compliance</span>
                All generated drafts were validated against indexed institutional procedures before human review.
              </div>
            </div>

            <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded space-y-1">
              <span className="font-bold text-[#1F3A5F] block">Zero Unauthorized Actions</span>
              <p className="text-[#667085]">
                No action was submitted without explicit human sign-off from HOD or Faculty advisor.
              </p>
            </div>

            <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded space-y-1">
              <span className="font-bold text-[#1F3A5F] block">Immutable Audit Compliance</span>
              <p className="text-[#667085]">
                100% of user queries, vector retrieval steps, and sign-offs are logged with timestamped actor IDs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
