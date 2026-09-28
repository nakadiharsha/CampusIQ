import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DemoRoleSwitcher } from '../components/common/DemoRoleSwitcher';
import { Cpu, Shield, CheckCircle, UserCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [ragModel, setRagModel] = useState('Ollama Llama-3 8B (Local)');
  const [vectorStore, setVectorStore] = useState('ChromaDB / Qdrant Local Embeddings');
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000/api/v1');
  const [privacyMode, setPrivacyMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl text-[#17202A]">
      <div>
        <h1 className="text-xl font-bold text-[#1F3A5F]">System & Role Configuration</h1>
        <p className="text-xs text-[#667085] mt-0.5">
          Configure local RAG inference endpoints, role-based authorization bounds, and prototype settings.
        </p>
      </div>

      {/* Demo Role Switcher Block */}
      <DemoRoleSwitcher />

      {/* Profile & Permissions overview */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-3 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] flex items-center gap-2 border-b border-[#D9DEE5] pb-2">
          <UserCheck className="w-4 h-4 text-[#315A7D]" />
          Active Persona Permissions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded space-y-1">
            <span className="font-bold text-[#1F3A5F] block">Active User:</span>
            <span className="text-[#17202A] block">{user?.name} ({user?.role.toUpperCase()})</span>
            <span className="text-[11px] text-[#667085] block">{user?.email}</span>
          </div>

          <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded space-y-1">
            <span className="font-bold text-[#1F3A5F] block">Granted Permissions ({user?.permissions.length}):</span>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pt-1">
              {user?.permissions.map((p, i) => (
                <span key={i} className="text-[10px] font-mono bg-white text-[#2F7D6D] px-1.5 py-0.2 rounded border border-[#BCE1D9]">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Backend & Model Settings */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] flex items-center gap-2 border-b border-[#D9DEE5] pb-2">
            <Cpu className="w-4 h-4 text-[#315A7D]" />
            Local LLM & FastAPI Architecture Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#1F3A5F] mb-1">Inference Engine / Model</label>
              <select
                value={ragModel}
                onChange={(e) => setRagModel(e.target.value)}
                className="w-full p-2.5 border border-[#D9DEE5] rounded bg-[#F7F8FA] text-xs focus:bg-white focus:outline-none focus:border-[#1F3A5F]"
              >
                <option value="Ollama Llama-3 8B (Local)">Ollama Llama-3 8B (Local & Air-gapped)</option>
                <option value="Mistral 7B Instruct (Local)">Mistral 7B Instruct (Local)</option>
                <option value="FastAPI Remote Server">FastAPI Remote Institutional Server</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1F3A5F] mb-1">Vector Indexing Store</label>
              <select
                value={vectorStore}
                onChange={(e) => setVectorStore(e.target.value)}
                className="w-full p-2.5 border border-[#D9DEE5] rounded bg-[#F7F8FA] text-xs focus:bg-white focus:outline-none focus:border-[#1F3A5F]"
              >
                <option value="ChromaDB / Qdrant Local Embeddings">ChromaDB Local Embeddings (bge-small-en)</option>
                <option value="PGVector PostGreSQL">PGVector (PostgreSQL Institutional DB)</option>
                <option value="FAISS Vector Index">FAISS In-Memory Vector Index</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1F3A5F] mb-1">FastAPI Backend Endpoint URL</label>
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className="w-full p-2.5 border border-[#D9DEE5] rounded bg-[#F7F8FA] font-mono text-xs focus:bg-white focus:outline-none focus:border-[#1F3A5F]"
            />
            <span className="text-[11px] text-[#667085] mt-1 block">
              Frontend route and API layer structured for seamless FastAPI JWT + Role enforcement.
            </span>
          </div>
        </div>

        {/* Security & Privacy Bounds */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] flex items-center gap-2 border-b border-[#D9DEE5] pb-2">
            <Shield className="w-4 h-4 text-[#2F7D6D]" />
            Privacy & Role Boundaries
          </h2>

          <div className="flex items-center justify-between p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded">
            <div>
              <span className="font-bold text-[#17202A] block">Strict Local-First & Role Data Isolation</span>
              <span className="text-[11px] text-[#667085]">
                Prevent student private memories or unsubmitted drafts from being exposed across roles.
              </span>
            </div>
            <input
              type="checkbox"
              checked={privacyMode}
              onChange={(e) => setPrivacyMode(e.target.checked)}
              className="w-4 h-4 accent-[#2F7D6D] cursor-pointer"
            />
          </div>
        </div>

        {/* Save Controls */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs font-bold text-[#2F7D6D] flex items-center gap-1.5 bg-[#EBF5F3] px-3 py-1.5 rounded border border-[#BCE1D9]">
              <CheckCircle className="w-4 h-4 text-[#2F7D6D]" /> Settings saved to local context.
            </span>
          ) : (
            <span className="text-xs text-[#667085]">CampusIQ Prototype Configured</span>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1F3A5F] text-white text-xs font-bold rounded hover:bg-[#172D4A] cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
