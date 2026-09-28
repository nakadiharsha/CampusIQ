import React from 'react';
import type { KnowledgeDocument } from '../../types';
import { X, FileText, Calendar, Layers, Hash, CheckCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface DocumentDetailDrawerProps {
  document: KnowledgeDocument | null;
  onClose: () => void;
}

export const DocumentDetailDrawer: React.FC<DocumentDetailDrawerProps> = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#17202A]/40 backdrop-blur-none flex justify-end">
      <div className="bg-white w-full max-w-xl h-full border-l border-[#D9DEE5] flex flex-col shadow-lg overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#D9DEE5] bg-[#F7F8FA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1F3A5F] text-white rounded">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17202A] leading-snug">{document.title}</h2>
              <span className="text-xs text-[#667085]">{document.category} • {document.department}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#667085] hover:text-[#17202A] hover:bg-[#D9DEE5]/50 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* Status & Overview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F7F8FA] p-3 rounded border border-[#D9DEE5]">
              <span className="text-xs text-[#667085] block mb-1">Indexing Status</span>
              <StatusBadge status={document.status} />
            </div>
            <div className="bg-[#F7F8FA] p-3 rounded border border-[#D9DEE5]">
              <span className="text-xs text-[#667085] block mb-1">Last Updated</span>
              <span className="text-sm font-semibold text-[#17202A] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#315A7D]" />
                {document.updatedAt}
              </span>
            </div>
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 border border-[#D9DEE5] rounded text-center">
              <span className="text-xs text-[#667085] block">Page Count</span>
              <span className="text-lg font-bold text-[#1F3A5F] flex items-center justify-center gap-1">
                <Layers className="w-4 h-4 text-[#315A7D]" />
                {document.pages}
              </span>
            </div>
            <div className="p-3 border border-[#D9DEE5] rounded text-center">
              <span className="text-xs text-[#667085] block">Indexed Chunks</span>
              <span className="text-lg font-bold text-[#2F7D6D] flex items-center justify-center gap-1">
                <Hash className="w-4 h-4" />
                {document.chunkCount}
              </span>
            </div>
            <div className="p-3 border border-[#D9DEE5] rounded text-center">
              <span className="text-xs text-[#667085] block">Format</span>
              <span className="text-sm font-bold text-[#17202A] mt-1 block">
                {document.fileType}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-[#1F3A5F] uppercase tracking-wider mb-1.5">Description</h4>
            <p className="text-sm text-[#17202A] bg-[#F7F8FA] p-3 rounded border border-[#D9DEE5] leading-relaxed">
              {document.description}
            </p>
          </div>

          {/* Sections Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-[#1F3A5F] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Document Sections & Excerpts</span>
              <span className="text-[11px] text-[#667085] font-normal">{document.sections.length} sections extracted</span>
            </h4>
            
            {document.sections.length === 0 ? (
              <div className="text-xs text-[#667085] bg-[#F7F8FA] p-4 rounded border border-[#D9DEE5] text-center">
                All {document.chunkCount} vector chunks are indexed. Full section details available in repository.
              </div>
            ) : (
              <div className="space-y-3">
                {document.sections.map((sec) => (
                  <div key={sec.id} className="border border-[#D9DEE5] rounded p-3 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#1F3A5F]">{sec.title}</span>
                      <span className="text-[11px] font-mono text-[#667085] bg-[#F7F8FA] px-1.5 py-0.5 rounded border border-[#D9DEE5]">
                        Page {sec.pageNumber}
                      </span>
                    </div>
                    <p className="text-xs text-[#17202A] bg-[#F7F8FA] p-2.5 rounded border border-[#D9DEE5] leading-relaxed font-mono">
                      "{sec.content}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grounding System Guarantee */}
          <div className="bg-[#EBF5F3] border border-[#BCE1D9] rounded p-3 text-xs text-[#2F7D6D] flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Institutional RAG Index Guarantee</span>
              All chunks from this document are vector indexed locally. Answers mentioning this document are directly verifiable back to page & paragraph.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D9DEE5] bg-[#F7F8FA] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#17202A] bg-white border border-[#D9DEE5] rounded hover:bg-[#F7F8FA] cursor-pointer"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};
