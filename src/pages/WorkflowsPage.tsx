import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ArrowRight } from 'lucide-react';

export const WorkflowsPage: React.FC = () => {
  const { workflows, startWorkflow } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#1F3A5F]">Institutional Workflows</h1>
        <p className="text-xs text-[#667085] mt-0.5">
          CampusIQ connects grounded policies directly to automated, context-aware application workflows.
        </p>
      </div>

      {/* Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="bg-white border border-[#D9DEE5] rounded-lg p-5 flex flex-col justify-between hover:border-[#1F3A5F] transition-all shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#315A7D] bg-[#F7F8FA] px-2 py-0.5 rounded border border-[#D9DEE5]">
                  {wf.category}
                </span>
                <StatusBadge status={wf.currentStatus} />
              </div>

              <h3 className="text-base font-bold text-[#1F3A5F] mb-1">{wf.title}</h3>
              <p className="text-xs text-[#17202A] bg-[#F7F8FA] p-3 rounded border border-[#D9DEE5] leading-relaxed mb-3">
                {wf.description}
              </p>

              {/* Required Info */}
              <div className="space-y-2 text-xs mb-4">
                <div>
                  <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block mb-1">
                    Required Student Information:
                  </span>
                  <ul className="space-y-1">
                    {wf.requiredInfo.map((info, i) => (
                      <li key={i} className="text-[11px] text-[#17202A] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D6D]"></span>
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#D9DEE5]">
                  <span className="text-[11px] text-[#667085] block">Approval Level:</span>
                  <span className="font-bold text-[#1F3A5F] text-[11px]">{wf.approvalRequirement}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => startWorkflow(wf.id)}
              className="w-full py-2.5 bg-[#1F3A5F] text-white text-xs font-bold rounded hover:bg-[#172D4A] flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Start Workflow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
