import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const FacultyPage: React.FC = () => {
  const { facultyMembers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaculty = facultyMembers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-[#17202A]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#D9DEE5] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#1F3A5F]">Department Faculty Directory</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Department of Computer Science and Engineering • Faculty & Research Staff
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-[#1F3A5F] bg-[#F7F8FA] px-3 py-1.5 rounded border border-[#D9DEE5] shrink-0">
          32 Faculty Members
        </span>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty name, specialization, or title..."
            className="w-full text-xs pl-8 pr-3 py-2 border border-[#D9DEE5] rounded bg-[#F7F8FA] text-[#17202A] focus:outline-none focus:border-[#1F3A5F] focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-[#667085] absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFaculty.map((fac) => (
          <div key={fac.id} className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-3 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#315A7D] bg-[#F7F8FA] px-2 py-0.5 rounded border border-[#D9DEE5]">
                  {fac.title}
                </span>
                <h3 className="text-base font-bold text-[#1F3A5F] mt-1">{fac.name}</h3>
                <span className="text-xs text-[#667085]">{fac.email}</span>
              </div>
              <StatusBadge status={fac.status} />
            </div>

            <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded text-xs space-y-1">
              <span className="font-bold text-[#1F3A5F] block">Specialization:</span>
              <p className="text-[#17202A]">{fac.specialization}</p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-[#667085] block text-[11px] uppercase tracking-wider">
                Assigned Teaching Modules:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {fac.coursesAssigned.map((c, i) => (
                  <span key={i} className="bg-[#EBF5F3] text-[#2F7D6D] px-2 py-0.5 rounded border border-[#BCE1D9] text-[11px]">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#D9DEE5] flex justify-between text-xs text-[#667085]">
              <span>Active Research Grants: <strong className="text-[#1F3A5F]">{fac.activeResearchGrants}</strong></span>
              <span className="text-[#315A7D] font-medium">Department CSE</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
