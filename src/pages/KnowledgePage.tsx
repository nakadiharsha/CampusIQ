import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Search,
  Plus,
  BookOpen,
  FileText,
  Filter,
  CheckCircle,
  Layers
} from 'lucide-react';

export const KnowledgePage: React.FC = () => {
  const { documents, setSelectedDocument, setIsAddDocOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories: string[] = ['All', 'Policy', 'Regulation', 'Procedure', 'Circular', 'Handbook'];

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;
    const matchesSearch =
      !searchTerm ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = documents.reduce((acc, d) => acc + d.pages, 0);
  const totalChunks = documents.reduce((acc, d) => acc + d.chunkCount, 0);

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1F3A5F]">Knowledge Base</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Search, inspect, and manage verified institutional knowledge documents.
          </p>
        </div>
        <button
          onClick={() => setIsAddDocOpen(true)}
          className="px-4 py-2 bg-[#1F3A5F] text-white text-xs font-bold rounded hover:bg-[#172D4A] flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add document</span>
        </button>
      </div>

      {/* Index Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#D9DEE5] rounded p-3 flex items-center gap-3">
          <div className="p-2 bg-[#F7F8FA] text-[#1F3A5F] rounded">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#667085] block">Indexed Documents</span>
            <span className="text-lg font-bold text-[#1F3A5F]">{documents.length} Files</span>
          </div>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded p-3 flex items-center gap-3">
          <div className="p-2 bg-[#F7F8FA] text-[#315A7D] rounded">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#667085] block">Total Pages</span>
            <span className="text-lg font-bold text-[#17202A]">{totalPages} Pages</span>
          </div>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded p-3 flex items-center gap-3">
          <div className="p-2 bg-[#EBF5F3] text-[#2F7D6D] rounded">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#667085] block">Vector Embeddings</span>
            <span className="text-lg font-bold text-[#2F7D6D]">{totalChunks} Chunks</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search document title, department, or keywords..."
              className="w-full text-xs pl-8 pr-3 py-2 border border-[#D9DEE5] rounded bg-[#F7F8FA] text-[#17202A] focus:outline-none focus:border-[#1F3A5F] focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-[#667085] absolute left-2.5 top-2.5" />
          </div>

          {/* Filter Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-[#667085] shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#1F3A5F] text-white'
                    : 'bg-[#F7F8FA] text-[#17202A] border border-[#D9DEE5] hover:bg-[#D9DEE5]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#17202A]">
            <thead className="bg-[#F7F8FA] border-b border-[#D9DEE5] text-[#1F3A5F] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Document Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5 text-center">Pages</th>
                <th className="p-3.5 text-center">Chunks</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Updated</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE5]">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#667085]">
                    No documents found matching "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDocument(doc)}
                    className="hover:bg-[#F7F8FA] cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 font-bold text-[#1F3A5F] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#315A7D] shrink-0" />
                      <div>
                        <span>{doc.title}</span>
                        <span className="block text-[10px] text-[#667085] font-normal truncate max-w-xs">
                          {doc.description}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium">{doc.category}</td>
                    <td className="p-3.5 text-[#667085]">{doc.department}</td>
                    <td className="p-3.5 text-center font-mono font-medium">{doc.pages}</td>
                    <td className="p-3.5 text-center font-mono text-[#2F7D6D] font-bold">{doc.chunkCount}</td>
                    <td className="p-3.5">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="p-3.5 text-[#667085] font-mono">{doc.updatedAt}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDocument(doc);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#315A7D] bg-[#F7F8FA] border border-[#D9DEE5] rounded hover:bg-[#1F3A5F] hover:text-white transition-colors cursor-pointer"
                      >
                        Inspect →
                      </button>
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
