import React from 'react';
import { Building } from 'lucide-react';

export const DepartmentInfoPage: React.FC = () => {
  return (
    <div className="space-y-6 text-[#17202A]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#D9DEE5] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#1F3A5F]">Department Information</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Department of Computer Science and Engineering • Governance & Academic Overview
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-[#1F3A5F] bg-[#F7F8FA] px-3 py-1.5 rounded border border-[#D9DEE5]">
          NBA & NAAC A++ Accredited
        </span>
      </div>

      <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] border-b border-[#D9DEE5] pb-2 flex items-center gap-2">
          <Building className="w-4 h-4 text-[#315A7D]" />
          Departmental Governance & Vision
        </h2>

        <p className="text-xs leading-relaxed text-[#17202A] bg-[#F7F8FA] p-3.5 rounded border border-[#D9DEE5]">
          The Department of Computer Science and Engineering offers state-of-the-art undergraduate and postgraduate programs. Integrated with CampusIQ private AI, all academic handbooks, research grants, syllabus regulations, and administrative student workflows are fully digitized and grounded.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 border border-[#D9DEE5] rounded">
            <span className="text-[#667085] block">Head of Department</span>
            <span className="font-bold text-[#1F3A5F] text-sm block mt-0.5">Dr. Rajesh Kumar</span>
            <span className="text-[11px] text-[#667085]">rajesh.kumar@college.edu</span>
          </div>

          <div className="p-3 border border-[#D9DEE5] rounded">
            <span className="text-[#667085] block">Academic Block</span>
            <span className="font-bold text-[#17202A] text-sm block mt-0.5">Apex Science Block - Floor 3</span>
            <span className="text-[11px] text-[#667085]">Labs 301 - 312</span>
          </div>

          <div className="p-3 border border-[#D9DEE5] rounded">
            <span className="text-[#667085] block">Active Student Strength</span>
            <span className="font-bold text-[#2F7D6D] text-sm block mt-0.5">842 Students</span>
            <span className="text-[11px] text-[#667085]">32 Full-time Faculty</span>
          </div>
        </div>
      </div>
    </div>
  );
};
