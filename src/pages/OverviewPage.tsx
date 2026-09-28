import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PipelineBanner } from '../components/common/PipelineBanner';
import {
  Search,
  MessageSquare,
  BookOpen,
  GitPullRequest,
  Brain,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const {
    user,
    setActivePage,
    quickAskQuestion,
    documents,
    memories,
    approvals,
    auditLogs,
    setSelectedDocument
  } = useApp();

  const [questionInput, setQuestionInput] = useState('');

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    quickAskQuestion(questionInput);
  };

  const pendingCount = approvals.filter((a) => a.status === 'Pending Approval').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1F3A5F] tracking-tight">Good morning, {user.name}</h1>
        <p className="text-sm text-[#667085] mt-0.5">Your institutional knowledge, connected.</p>
      </div>

      {/* Governance & Pipeline Banner */}
      <PipelineBanner currentStage="ASK" />

      {/* Large Central Search / Question Box */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg p-6 shadow-sm">
        <label className="block text-xs font-bold text-[#1F3A5F] uppercase tracking-wider mb-2">
          Central Institutional Query Bar
        </label>
        <form onSubmit={handleAskSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="Ask CampusIQ anything about your institution (e.g. What is the procedure for applying for a bonafide certificate?)..."
              className="w-full text-sm pl-10 pr-4 py-3 border border-[#D9DEE5] rounded bg-[#F7F8FA] text-[#17202A] focus:outline-none focus:border-[#1F3A5F] focus:bg-white transition-colors"
            />
            <Search className="w-5 h-5 text-[#667085] absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#1F3A5F] text-white text-xs font-bold rounded hover:bg-[#172D4A] transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Ask CampusIQ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Action Chips */}
        <div className="mt-4 pt-4 border-t border-[#D9DEE5] flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#667085] mr-1">Quick Actions:</span>
          <button
            onClick={() => quickAskQuestion('What is the procedure for applying for a bonafide certificate?')}
            className="px-3 py-1.5 bg-[#F7F8FA] border border-[#D9DEE5] rounded text-xs font-medium text-[#17202A] hover:bg-[#EBF5F3] hover:border-[#2F7D6D] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#2F7D6D]" />
            Ask a question
          </button>
          <button
            onClick={() => setActivePage('knowledge')}
            className="px-3 py-1.5 bg-[#F7F8FA] border border-[#D9DEE5] rounded text-xs font-medium text-[#17202A] hover:bg-[#F7F8FA] hover:border-[#315A7D] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#315A7D]" />
            Find a policy
          </button>
          <button
            onClick={() => setActivePage('workflows')}
            className="px-3 py-1.5 bg-[#F7F8FA] border border-[#D9DEE5] rounded text-xs font-medium text-[#17202A] hover:bg-[#F7F8FA] hover:border-[#1F3A5F] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <GitPullRequest className="w-3.5 h-3.5 text-[#1F3A5F]" />
            Start a workflow
          </button>
          <button
            onClick={() => setActivePage('memory')}
            className="px-3 py-1.5 bg-[#F7F8FA] border border-[#D9DEE5] rounded text-xs font-medium text-[#17202A] hover:bg-[#F7F8FA] hover:border-[#2F7D6D] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5 text-[#2F7D6D]" />
            View memory
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div
          onClick={() => setActivePage('knowledge')}
          className="bg-white border border-[#D9DEE5] rounded-lg p-4 cursor-pointer hover:border-[#1F3A5F] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667085]">Knowledge Base</span>
            <div className="p-1.5 bg-[#F7F8FA] rounded text-[#315A7D]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#1F3A5F] mt-2">1,248</div>
          <span className="text-[11px] text-[#2F7D6D] font-medium mt-0.5 block">
            {documents.length} priority docs indexed
          </span>
        </div>

        {/* Stat 2 */}
        <div
          onClick={() => setActivePage('memory')}
          className="bg-white border border-[#D9DEE5] rounded-lg p-4 cursor-pointer hover:border-[#1F3A5F] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667085]">Memory</span>
            <div className="p-1.5 bg-[#F7F8FA] rounded text-[#2F7D6D]">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#1F3A5F] mt-2">24</div>
          <span className="text-[11px] text-[#667085] font-medium mt-0.5 block">
            {memories.filter((m) => m.enabled).length} active memory preferences
          </span>
        </div>

        {/* Stat 3 */}
        <div
          onClick={() => setActivePage('approvals')}
          className="bg-white border border-[#D9DEE5] rounded-lg p-4 cursor-pointer hover:border-[#1F3A5F] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667085]">Pending Approvals</span>
            <div className="p-1.5 bg-[#FEFCBF] rounded text-[#B7791F]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#B7791F] mt-2">{pendingCount}</div>
          <span className="text-[11px] text-[#B7791F] font-medium mt-0.5 block">
            Requires human approval sign-off
          </span>
        </div>

        {/* Stat 4 */}
        <div
          onClick={() => setActivePage('audit')}
          className="bg-white border border-[#D9DEE5] rounded-lg p-4 cursor-pointer hover:border-[#1F3A5F] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#667085]">Audit Events</span>
            <div className="p-1.5 bg-[#F7F8FA] rounded text-[#1F3A5F]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#1F3A5F] mt-2">{auditLogs.length + 180}</div>
          <span className="text-[11px] text-[#2F7D6D] font-medium mt-0.5 block">
            100% decision trail logged
          </span>
        </div>
      </div>

      {/* Main Grid: Activity & Frequently Used Knowledge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-[#D9DEE5] rounded-lg p-5">
          <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-3 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#315A7D]" />
              Recent Institutional Activity
            </h2>
            <button
              onClick={() => setActivePage('audit')}
              className="text-xs font-semibold text-[#315A7D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View full audit log</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-white border border-[#D9DEE5] rounded text-[#2F7D6D] mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#17202A] block">{log.action}</span>
                    <span className="text-[#667085] text-[11px] block mt-0.5">{log.details || log.resource}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-[11px] text-[#667085]">{log.timeFormatted}</span>
                  <span className="block text-[10px] text-[#315A7D] font-medium mt-0.5">{log.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Used Knowledge */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-5">
          <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-3 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2F7D6D]" />
              Frequently Used Knowledge
            </h2>
            <button
              onClick={() => setActivePage('knowledge')}
              className="text-xs font-semibold text-[#315A7D] hover:underline cursor-pointer"
            >
              All docs
            </button>
          </div>

          <div className="space-y-3">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocument(doc)}
                className="p-3 border border-[#D9DEE5] rounded hover:border-[#1F3A5F] bg-[#F7F8FA] hover:bg-white transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#1F3A5F] truncate">{doc.title}</span>
                  <span className="text-[10px] font-semibold text-[#2F7D6D] bg-[#EBF5F3] px-1.5 py-0.2 rounded border border-[#BCE1D9]">
                    {doc.category}
                  </span>
                </div>
                <p className="text-[11px] text-[#667085] line-clamp-1">{doc.description}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D9DEE5] text-[10px] text-[#667085]">
                  <span>{doc.pages} pages • {doc.chunkCount} chunks</span>
                  <span className="font-medium text-[#315A7D]">Inspect PDF →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
