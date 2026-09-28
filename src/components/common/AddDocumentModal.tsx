import React, { useState } from 'react';
import type { DocumentCategory } from '../../types';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (docData: {
    title: string;
    category: DocumentCategory;
    department: string;
    description: string;
    pages: number;
  }) => void;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Procedure');
  const [department, setDepartment] = useState('Student Affairs');
  const [description, setDescription] = useState('');
  const [pages, setPages] = useState<number>(12);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      onAdd({
        title,
        category,
        department,
        description: description || 'Institutional document indexed into CampusIQ RAG vector store.',
        pages: Number(pages) || 10
      });
      setIsProcessing(false);
      setTitle('');
      setDescription('');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#17202A]/40 backdrop-blur-none flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-lg border border-[#D9DEE5] shadow-lg overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-[#D9DEE5] bg-[#F7F8FA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#1F3A5F] text-white rounded">
              <Upload className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-[#17202A]">Add Institutional Document</h2>
          </div>
          <button onClick={onClose} className="text-[#667085] hover:text-[#17202A] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs text-[#17202A]">
          <div>
            <label className="block font-bold text-[#1F3A5F] mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Campus Safety & IT Access Guidelines 2026"
              className="w-full p-2.5 border border-[#D9DEE5] rounded focus:outline-none focus:border-[#1F3A5F] bg-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1F3A5F] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full p-2.5 border border-[#D9DEE5] rounded focus:outline-none focus:border-[#1F3A5F] bg-white text-xs"
              >
                <option value="Policy">Policy</option>
                <option value="Regulation">Regulation</option>
                <option value="Procedure">Procedure</option>
                <option value="Circular">Circular</option>
                <option value="Handbook">Handbook</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1F3A5F] mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Academic Section"
                className="w-full p-2.5 border border-[#D9DEE5] rounded focus:outline-none focus:border-[#1F3A5F] bg-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1F3A5F] mb-1">Estimated Page Count</label>
              <input
                type="number"
                min={1}
                max={500}
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
                className="w-full p-2.5 border border-[#D9DEE5] rounded focus:outline-none focus:border-[#1F3A5F] bg-white text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1F3A5F] mb-1">Vector Chunk Preview</label>
              <div className="p-2.5 bg-[#F7F8FA] border border-[#D9DEE5] rounded text-[#667085] font-mono">
                ~{Math.floor(pages * 4.2)} chunks
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1F3A5F] mb-1">Short Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of policies or rules contained..."
              className="w-full p-2.5 border border-[#D9DEE5] rounded focus:outline-none focus:border-[#1F3A5F] bg-white text-xs"
            />
          </div>

          {/* Mock File upload box */}
          <div className="border-2 border-dashed border-[#D9DEE5] rounded-lg p-4 text-center bg-[#F7F8FA]">
            <FileText className="w-6 h-6 text-[#315A7D] mx-auto mb-1" />
            <span className="text-xs font-semibold text-[#1F3A5F] block">Select PDF Document File</span>
            <span className="text-[11px] text-[#667085] block mt-0.5">Prototype simulates ingestion & chunking automatically</span>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#D9DEE5]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 border border-[#D9DEE5] rounded bg-white font-semibold text-[#17202A] hover:bg-[#F7F8FA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 bg-[#1F3A5F] text-white font-semibold rounded hover:bg-[#172D4A] flex items-center gap-1.5"
            >
              {isProcessing ? (
                <span>Indexing Chunks...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D6D]" />
                  Index Document
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
