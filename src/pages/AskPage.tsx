import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PipelineBanner } from '../components/common/PipelineBanner';
import {
  Send,
  UserCheck,
  Brain,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import { sampleBonafideSources } from '../data/mockData';

export const AskPage: React.FC = () => {
  const {
    user,
    messages,
    sendQuestion,
    isSubmittingQuestion,
    memories,
    setSelectedDocument,
    documents,
    startWorkflow
  } = useApp();

  const [inputQuestion, setInputQuestion] = useState('');
  const [expandedContextMsgId, setExpandedContextMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSubmittingQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isSubmittingQuestion) return;
    const text = inputQuestion;
    setInputQuestion('');
    await sendQuestion(text);
  };

  const activeMemories = memories.filter((m) => m.enabled);
  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
  const currentSources = lastAssistantMsg?.sources && lastAssistantMsg.sources.length > 0
    ? lastAssistantMsg.sources
    : sampleBonafideSources;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <PipelineBanner currentStage="REASON" compact />

      {/* Main Grid: Left Chat Area (2/3), Right Context Panel (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)] min-h-[560px]">
        {/* Left Section: Conversational Chat Interface */}
        <div className="lg:col-span-2 bg-white border border-[#D9DEE5] rounded-lg flex flex-col h-full overflow-hidden shadow-sm">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-[#D9DEE5] bg-[#F7F8FA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#1F3A5F] text-white rounded">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#1F3A5F] tracking-tight">
                  CampusIQ Conversational Engine
                </h2>
                <span className="text-[10px] text-[#667085]">
                  Strictly grounded in college regulations • Privacy local-first
                </span>
              </div>
            </div>
            <span className="text-[11px] text-[#2F7D6D] bg-[#EBF5F3] px-2 py-0.5 rounded border border-[#BCE1D9] font-medium">
              Source-Grounded Active
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F7F8FA]/50">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              const isContextExpanded = expandedContextMsgId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[#667085] mb-1 px-1">
                    <span className="font-bold text-[#17202A]">
                      {isAssistant ? 'CampusIQ Assistant' : user.name}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] rounded-lg p-4 border text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-white text-[#17202A] border-[#D9DEE5] shadow-xs'
                        : 'bg-[#1F3A5F] text-white border-[#1F3A5F]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Assistant Extra UI: Context, Sources, Follow-ups, Action Offer */}
                    {isAssistant && (
                      <div className="mt-3 pt-3 border-t border-[#D9DEE5] space-y-3">
                        {/* Why this answer / Grounded Context expandable */}
                        {msg.contextUsed && (
                          <div className="border border-[#D9DEE5] rounded bg-[#F7F8FA] overflow-hidden">
                            <button
                              onClick={() =>
                                setExpandedContextMsgId(isContextExpanded ? null : msg.id)
                              }
                              className="w-full px-3 py-1.5 text-[11px] font-semibold text-[#1F3A5F] flex items-center justify-between hover:bg-[#D9DEE5]/30 cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-[#2F7D6D]" />
                                Why this answer? / Retrieved Context
                              </span>
                              {isContextExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 text-[#667085]" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
                              )}
                            </button>

                            {isContextExpanded && (
                              <div className="p-3 text-[11px] border-t border-[#D9DEE5] space-y-2 bg-white">
                                <div>
                                  <span className="font-bold text-[#17202A] block mb-0.5">
                                    User Profile & Credentials Checked:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {msg.contextUsed.userContext.map((c, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-[#F7F8FA] text-[#17202A] px-2 py-0.5 rounded border border-[#D9DEE5]"
                                      >
                                        {c}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <span className="font-bold text-[#17202A] block mb-0.5">
                                    Persistent Memories Applied:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {msg.contextUsed.memoriesUsed.map((m, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-[#EBF5F3] text-[#2F7D6D] px-2 py-0.5 rounded border border-[#BCE1D9]"
                                      >
                                        {m}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Grounded Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div>
                            <span className="text-[11px] font-bold text-[#1F3A5F] uppercase tracking-wider block mb-1.5">
                              Retrieved Sources ({msg.sources.length})
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.sources.map((src, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    const matchDoc = documents.find((d) => d.id === src.documentId);
                                    if (matchDoc) setSelectedDocument(matchDoc);
                                  }}
                                  className="p-2 bg-[#F7F8FA] border border-[#D9DEE5] rounded hover:border-[#1F3A5F] cursor-pointer transition-colors"
                                >
                                  <div className="flex items-center justify-between text-[11px] font-bold text-[#1F3A5F]">
                                    <span className="truncate">{src.documentTitle}</span>
                                    <span className="font-mono text-[10px] text-[#2F7D6D]">
                                      Page {src.pageNumber}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-[#667085] block truncate mt-0.5">
                                    {src.sectionTitle}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Offer (e.g. Prepare Application) */}
                        {msg.actionOffer && (
                          <div className="p-3 bg-[#EBF5F3] border border-[#BCE1D9] rounded flex items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-bold text-[#2F7D6D] block">
                                Ready to prepare application?
                              </span>
                              <span className="text-[11px] text-[#17202A] block">
                                {msg.actionOffer.description}
                              </span>
                            </div>
                            <button
                              onClick={() => startWorkflow(msg.actionOffer!.workflowId)}
                              className="px-3.5 py-1.5 bg-[#2F7D6D] text-white text-xs font-bold rounded hover:bg-[#266457] shrink-0 cursor-pointer flex items-center gap-1"
                            >
                              <span>Prepare Application</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Suggested Follow-up Buttons */}
                        {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block mb-1">
                              Suggested Follow-ups:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.suggestedFollowUps.map((q, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    if (q.includes('prepare') || q.includes('generate')) {
                                      startWorkflow('wf-bonafide');
                                    } else {
                                      sendQuestion(q);
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-white border border-[#D9DEE5] rounded text-[11px] text-[#1F3A5F] font-medium hover:bg-[#F7F8FA] hover:border-[#1F3A5F] cursor-pointer transition-colors flex items-center gap-1"
                                >
                                  <span>{q}</span>
                                  <ArrowRight className="w-3 h-3 text-[#315A7D]" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isSubmittingQuestion && (
              <div className="flex items-center gap-2 p-3 bg-white border border-[#D9DEE5] rounded-lg w-fit text-xs text-[#667085]">
                <div className="w-2 h-2 rounded-full bg-[#1F3A5F] animate-ping"></div>
                <span>CampusIQ retrieving grounded documents & applying persistent memory...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-[#D9DEE5] bg-white flex gap-2">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask about bonafide certificates, examination rules, leave policies..."
              className="flex-1 text-xs px-3 py-2.5 border border-[#D9DEE5] rounded bg-[#F7F8FA] text-[#17202A] focus:outline-none focus:border-[#1F3A5F] focus:bg-white"
            />
            <button
              type="submit"
              disabled={isSubmittingQuestion || !inputQuestion.trim()}
              className="px-4 py-2.5 bg-[#1F3A5F] text-white text-xs font-bold rounded hover:bg-[#172D4A] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Section: Context Panel */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg flex flex-col h-full overflow-hidden shadow-sm p-4 space-y-4">
          <div className="border-b border-[#D9DEE5] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#315A7D]" />
              Active Execution Context
            </h3>
            <span className="text-[11px] text-[#667085]">Injected automatically into RAG prompt</span>
          </div>

          {/* 1. User Context */}
          <div className="bg-[#F7F8FA] border border-[#D9DEE5] rounded p-3 text-xs space-y-1.5">
            <div className="font-bold text-[#1F3A5F] flex items-center justify-between border-b border-[#D9DEE5] pb-1">
              <span>Student Profile</span>
              <span className="text-[10px] text-[#2F7D6D] bg-[#EBF5F3] px-1.5 rounded">Verified</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#667085]">Name:</span>
              <span className="font-semibold">{user.name}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#667085]">USN:</span>
              <span className="font-mono font-semibold">{user.usn}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#667085]">Program:</span>
              <span className="font-semibold text-right max-w-[140px] truncate">{user.program}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#667085]">Academic Year:</span>
              <span className="font-semibold">{user.year}</span>
            </div>
          </div>

          {/* 2. Relevant Memory */}
          <div className="border border-[#D9DEE5] rounded p-3 text-xs space-y-2">
            <div className="font-bold text-[#1F3A5F] flex items-center justify-between border-b border-[#D9DEE5] pb-1">
              <span className="flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-[#2F7D6D]" /> Active Memory
              </span>
              <span className="text-[10px] text-[#667085]">{activeMemories.length} items</span>
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {activeMemories.map((mem) => (
                <div key={mem.id} className="bg-[#F7F8FA] p-2 rounded border border-[#D9DEE5] text-[11px]">
                  <span className="font-bold text-[#17202A] block">{mem.title}</span>
                  <span className="text-[#667085] block text-[10px]">{mem.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Retrieved Sources */}
          <div className="flex-1 border border-[#D9DEE5] rounded p-3 text-xs flex flex-col overflow-hidden">
            <div className="font-bold text-[#1F3A5F] flex items-center justify-between border-b border-[#D9DEE5] pb-1 mb-2">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#315A7D]" /> Grounded Sources
              </span>
              <span className="text-[10px] text-[#2F7D6D] font-mono">Top Similarity</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {currentSources.map((src, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const matchDoc = documents.find((d) => d.id === src.documentId);
                    if (matchDoc) setSelectedDocument(matchDoc);
                  }}
                  className="p-2.5 bg-[#F7F8FA] border border-[#D9DEE5] rounded hover:border-[#1F3A5F] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-[11px] text-[#1F3A5F]">{src.documentTitle}</span>
                    <span className="font-mono text-[10px] text-[#2F7D6D] bg-[#EBF5F3] px-1 rounded">
                      p. {src.pageNumber}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#315A7D] block">{src.sectionTitle}</span>
                  <p className="text-[10px] text-[#667085] line-clamp-2 mt-1 font-mono italic">
                    "{src.excerpt}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
