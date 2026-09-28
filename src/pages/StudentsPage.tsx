import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShieldCheck, UserCheck } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const StudentsPage: React.FC = () => {
  const { students } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.program.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-[#17202A]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#D9DEE5] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#1F3A5F]">Department Students Directory</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Department of Computer Science and Engineering • Authorized HOD & Faculty Roster View
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-[#2F7D6D] bg-[#EBF5F3] px-3 py-1.5 rounded border border-[#BCE1D9] shrink-0">
          842 Enrolled Students
        </span>
      </div>

      {/* Student Privacy Boundary Callout */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg p-4 flex items-start gap-3">
        <div className="p-2 bg-[#F7F8FA] text-[#1F3A5F] rounded shrink-0 border border-[#D9DEE5]">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-[#17202A] space-y-1">
          <span className="font-bold text-[#1F3A5F] block">Student Privacy & Scope Authorization</span>
          <p className="text-[#667085] leading-relaxed">
            Faculty and HOD views display verified academic credentials, attendance, and official submitted requests. **Private student memories, personal conversation history, and unsubmitted draft notes are strictly restricted and invisible.**
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student name, USN, or academic year..."
            className="w-full text-xs pl-8 pr-3 py-2 border border-[#D9DEE5] rounded bg-[#F7F8FA] text-[#17202A] focus:outline-none focus:border-[#1F3A5F] focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-[#667085] absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#17202A]">
            <thead className="bg-[#F7F8FA] border-b border-[#D9DEE5] text-[#1F3A5F] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">USN</th>
                <th className="p-3.5">Academic Level</th>
                <th className="p-3.5 text-center">CGPA</th>
                <th className="p-3.5 text-center">Attendance</th>
                <th className="p-3.5 text-center">Active Requests</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE5]">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-[#F7F8FA] transition-colors">
                  <td className="p-3.5 font-bold text-[#1F3A5F] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#315A7D]" />
                    <div>
                      <span>{std.name}</span>
                      <span className="block text-[10px] text-[#667085] font-normal">{std.email}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono font-medium">{std.usn}</td>
                  <td className="p-3.5 text-[#667085]">{std.year} ({std.program})</td>
                  <td className="p-3.5 text-center font-bold text-[#1F3A5F]">{std.cgpa}</td>
                  <td className="p-3.5 text-center font-bold text-[#2F7D6D]">{std.attendance}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-[#B7791F]">
                    {std.pendingRequestsCount}
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={std.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
