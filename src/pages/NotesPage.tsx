import React, { useState } from 'react';
import { BookOpen, Download, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotesPage: React.FC = () => {
  const { user, notes, addNote, deleteNote } = useApp();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [section, setSection] = useState('A');
  const [description, setDescription] = useState('');

  const visibleNotes = user.role === 'student'
    ? notes.filter((n) => n.section === (user.year?.includes('3rd') ? 'A' : n.section))
    : notes;

  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) return;
    addNote({ title, subject, section, description, faculty: user.name });
    setTitle(''); setSubject(''); setDescription('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F3A5F]">Notes</h1>
        <p className="text-sm text-[#667085] mt-1">{user.role === 'faculty' ? 'Share notes with your students.' : 'Notes shared by your faculty.'}</p>
      </div>

      {user.role === 'faculty' && (
        <form onSubmit={publish} className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 font-bold text-[#1F3A5F]"><Plus className="w-4 h-4" /> Send Notes to Students</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Note title" className="border rounded p-2.5 text-sm" />
            <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" className="border rounded p-2.5 text-sm" />
            <select value={section} onChange={e=>setSection(e.target.value)} className="border rounded p-2.5 text-sm"><option>A</option><option>B</option><option>C</option></select>
          </div>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Short description" className="w-full border rounded p-2.5 text-sm min-h-20" />
          <button className="px-4 py-2 bg-[#1F3A5F] text-white rounded text-sm font-bold">Publish Note</button>
        </form>
      )}

      <div className="grid gap-3">
        {visibleNotes.length === 0 ? <div className="bg-white border rounded-lg p-6 text-sm text-[#667085]">No notes available yet.</div> : visibleNotes.map(note => (
          <div key={note.id} className="bg-white border border-[#D9DEE5] rounded-lg p-4 flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="p-2 bg-[#EBF5F3] rounded text-[#2F7D6D]"><BookOpen className="w-5 h-5" /></div>
              <div><h3 className="font-bold text-[#1F3A5F]">{note.title}</h3><p className="text-xs text-[#667085] mt-1">{note.subject} • Section {note.section} • {note.faculty}</p><p className="text-sm mt-2">{note.description || 'Study notes shared by faculty.'}</p></div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border rounded text-xs font-semibold flex items-center gap-1"><Download className="w-3.5 h-3.5" /> View</button>
              {user.role === 'faculty' && <button onClick={()=>deleteNote(note.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
