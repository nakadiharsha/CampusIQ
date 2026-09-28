import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { AuditCategory } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { PipelineBanner } from '../components/common/PipelineBanner';
import { ShieldCheck, Filter, Search } from 'lucide-react';

export const AuditPage: React.FC = () => {
  const { auditLogs, filterAuditLogs, activeAuditFilter } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filterCategories: AuditCategory[] = [
    'All',
    'Questions',
    'Retrieval',
    'Memory',
    'Workflow',
    'Approval',
    'System'
  ];

  const displayedLogs = auditLogs.filter((log) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.actor.toLowerCase().includes(q) ||
      log.resource.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Pipeline Banner */}
      <PipelineBanner currentStage="AUDIT" compact />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#D9DEE5] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#1F3A5F]">Audit Logs</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Track decisions, retrieved knowledge, injected context, and approved institutional actions.
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-[#2F7D6D] bg-[#EBF5F3] px-3 py-1.5 rounded border border-[#BCE1D9] flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-[#2F7D6D]" />
          <span>Immutable Trail Active ({auditLogs.length} Events Logged)</span>
        </div>
      </div>

      {/* Audit Guarantee Banner */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg p-4 flex items-start gap-3">
        <div className="p-2 bg-[#F7F8FA] text-[#1F3A5F] rounded shrink-0 border border-[#D9DEE5]">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-[#17202A] space-y-1">
          <span className="font-bold text-[#1F3A5F] block">Institutional Transparency & Accountability</span>
          <p className="text-[#667085] leading-relaxed">
            Every step of the CampusIQ pipeline — from vector retrieval and memory injection to draft generation and human sign-off — is recorded with timestamps, actor IDs, and exact document chunk identifiers.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-[#667085] shrink-0" />
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => filterAuditLogs(cat)}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  activeAuditFilter === cat
                    ? 'bg-[#1F3A5F] text-white'
                    : 'bg-[#F7F8FA] text-[#17202A] border border-[#D9DEE5] hover:bg-[#D9DEE5]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Local Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-[#D9DEE5] rounded bg-[#F7F8FA] text-[#17202A] focus:outline-none focus:border-[#1F3A5F] focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-[#667085] absolute left-2.5 top-2" />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#17202A]">
            <thead className="bg-[#F7F8FA] border-b border-[#D9DEE5] text-[#1F3A5F] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Target Resource / Document</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE5]">
              {displayedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#667085]">
                    No audit records matching criteria.
                  </td>
                </tr>
              ) : (
                displayedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="p-3.5 font-mono text-[#667085] whitespace-nowrap">
                      <div className="font-bold text-[#17202A]">{log.timeFormatted}</div>
                      <div className="text-[10px] text-[#A0AEC0]">{log.timestamp.split('T')[0]}</div>
                    </td>
                    <td className="p-3.5 font-bold text-[#1F3A5F] whitespace-nowrap">{log.actor}</td>
                    <td className="p-3.5 font-semibold text-[#17202A]">
                      <div>{log.action}</div>
                      {log.details && (
                        <div className="text-[11px] text-[#667085] font-normal font-mono mt-0.5 max-w-md line-clamp-2">
                          {log.details}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-[#315A7D] font-mono text-[11px] font-medium max-w-xs truncate">
                      {log.resource}
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-semibold text-[#1F3A5F] bg-[#F7F8FA] px-2 py-0.5 rounded border border-[#D9DEE5]">
                        {log.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={log.status} />
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
