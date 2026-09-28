import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Brain, ToggleLeft, ToggleRight, CheckCircle2 } from 'lucide-react';

export const MemoryPage: React.FC = () => {
  const { memories, toggleMemory } = useApp();
  const [activeTab, setActiveTab] = useState<string>('All');

  const categories: string[] = ['All', 'Academic Context', 'Preferences', 'Recent Context'];

  const filteredMemories = memories.filter((mem) => {
    if (activeTab === 'All') return true;
    return mem.category === activeTab;
  });

  const activeCount = memories.filter((m) => m.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#1F3A5F]">CampusIQ Memory</h1>
        <p className="text-xs text-[#667085] mt-0.5">
          CampusIQ can retain approved context from previous interactions to provide more relevant answers.
        </p>
      </div>

      {/* Explanation Banner */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg p-4 flex items-start gap-3">
        <div className="p-2 bg-[#EBF5F3] text-[#2F7D6D] rounded shrink-0">
          <Brain className="w-5 h-5" />
        </div>
        <div className="text-xs text-[#17202A] space-y-1">
          <span className="font-bold text-[#1F3A5F] block">Persistent Context Governance</span>
          <p className="text-[#667085] leading-relaxed">
            Unlike stateless chatbots, CampusIQ links verified institutional documents with your active student credentials, interaction history, and explicit communication preferences. You maintain full control: enable or disable individual memories below.
          </p>
          <div className="pt-1 flex items-center gap-2 text-[11px]">
            <span className="font-bold text-[#2F7D6D]">{activeCount} of {memories.length} Memories Active</span>
            <span className="text-[#667085]">• Changes apply to all new queries immediately</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#D9DEE5] pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === cat
                ? 'bg-[#1F3A5F] text-white'
                : 'bg-[#F7F8FA] text-[#17202A] border border-[#D9DEE5] hover:bg-[#D9DEE5]/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className={`bg-white border rounded-lg p-4 transition-all ${
              mem.enabled
                ? 'border-[#2F7D6D] shadow-xs'
                : 'border-[#D9DEE5] opacity-75 bg-[#F7F8FA]'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#315A7D] bg-[#F7F8FA] px-1.5 py-0.5 rounded border border-[#D9DEE5]">
                  {mem.category}
                </span>
                <h3 className="text-sm font-bold text-[#1F3A5F] mt-1">{mem.title}</h3>
              </div>

              {/* Toggle Control */}
              <button
                onClick={() => toggleMemory(mem.id)}
                className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
              >
                {mem.enabled ? (
                  <>
                    <span className="text-[#2F7D6D] text-[11px]">Use memory</span>
                    <ToggleRight className="w-6 h-6 text-[#2F7D6D]" />
                  </>
                ) : (
                  <>
                    <span className="text-[#667085] text-[11px]">Disabled</span>
                    <ToggleLeft className="w-6 h-6 text-[#667085]" />
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-[#17202A] bg-[#F7F8FA] p-2.5 rounded border border-[#D9DEE5] mb-2 leading-relaxed">
              {mem.description}
            </p>

            <div className="flex items-center justify-between text-[11px] text-[#667085] pt-1">
              <span>Timestamp: {mem.date}</span>
              {mem.enabled && (
                <span className="text-[#2F7D6D] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Injected into RAG
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
