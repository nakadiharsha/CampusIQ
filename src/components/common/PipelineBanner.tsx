import React from 'react';
import type { PipelineStage } from '../../types';
import { HelpCircle, Database, Brain, Cpu, FileText, CheckSquare, ShieldCheck } from 'lucide-react';

interface PipelineBannerProps {
  currentStage?: PipelineStage;
  compact?: boolean;
}

export const PipelineBanner: React.FC<PipelineBannerProps> = ({ currentStage, compact = false }) => {
  const stages: { stage: PipelineStage; label: string; desc: string; icon: React.ReactNode }[] = [
    { stage: 'ASK', label: 'ASK', desc: 'Institutional Question', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { stage: 'RETRIEVE', label: 'RETRIEVE', desc: 'Grounded Docs', icon: <Database className="w-3.5 h-3.5" /> },
    { stage: 'REMEMBER', label: 'REMEMBER', desc: 'Active Memory', icon: <Brain className="w-3.5 h-3.5" /> },
    { stage: 'REASON', label: 'REASON', desc: 'Policy Logic', icon: <Cpu className="w-3.5 h-3.5" /> },
    { stage: 'PREPARE', label: 'PREPARE', desc: 'Draft Action', icon: <FileText className="w-3.5 h-3.5" /> },
    { stage: 'APPROVE', label: 'APPROVE', desc: 'Human Oversight', icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { stage: 'AUDIT', label: 'AUDIT', desc: 'Immutable Trail', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  if (compact) {
    return (
      <div className="bg-[#FFFFFF] border border-[#D9DEE5] rounded-md px-3 py-2 text-xs flex items-center justify-between overflow-x-auto gap-2">
        <span className="text-[#667085] font-semibold tracking-wider text-[10px] uppercase flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2F7D6D]" /> Institutional Pipeline:
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {stages.map((item, idx) => {
            const isActive = currentStage === item.stage;
            return (
              <React.Fragment key={item.stage}>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 ${
                    isActive
                      ? 'bg-[#1F3A5F] text-white'
                      : 'bg-[#F7F8FA] text-[#17202A] border border-[#D9DEE5]'
                  }`}
                >
                  {item.label}
                </span>
                {idx < stages.length - 1 && (
                  <span className="text-[#667085] text-[10px]">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D9DEE5] rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3 border-b border-[#D9DEE5] pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2F7D6D]" />
          CampusIQ Governance & Execution Pipeline
        </h3>
        <span className="text-[11px] text-[#667085] bg-[#F7F8FA] px-2.5 py-0.5 rounded border border-[#D9DEE5] font-medium">
          Source-Grounded • Human Approved • Audited
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {stages.map((item, index) => {
          const isActive = currentStage === item.stage;
          return (
            <div
              key={item.stage}
              className={`p-2.5 rounded-md border transition-colors relative ${
                isActive
                  ? 'bg-[#1F3A5F] text-white border-[#1F3A5F]'
                  : 'bg-[#F7F8FA] text-[#17202A] border-[#D9DEE5]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold tracking-wide mb-1">
                <span className="flex items-center gap-1">
                  {item.icon}
                  {item.label}
                </span>
                <span className={`text-[10px] font-mono ${isActive ? 'text-[#A0AEC0]' : 'text-[#667085]'}`}>
                  0{index + 1}
                </span>
              </div>
              <p className={`text-[11px] leading-tight ${isActive ? 'text-[#E2E8F0]' : 'text-[#667085]'}`}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
