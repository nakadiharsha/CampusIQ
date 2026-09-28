import React, { useState } from 'react';
import { Megaphone, Plus, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnnouncementsPage: React.FC = () => {
  const { user, announcements, addAnnouncement } = useApp();
  const [title,setTitle]=useState(''); const [message,setMessage]=useState(''); const [audience,setAudience]=useState<'students'|'faculty'|'both'>('students');
  const visible = announcements.filter(a => a.audience === 'both' || a.audience === (user.role === 'student' ? 'students' : 'faculty') || user.role === 'hod');
  const publish=(e:React.FormEvent)=>{e.preventDefault(); if(!title.trim()||!message.trim())return; addAnnouncement({title,message,audience,author:user.name});setTitle('');setMessage('');};
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold text-[#1F3A5F]">Announcements</h1><p className="text-sm text-[#667085] mt-1">One shared place for department announcements and faculty meeting notices.</p></div>
    {user.role==='hod' && <form onSubmit={publish} className="bg-white border rounded-lg p-5 space-y-3"><div className="flex items-center gap-2 font-bold text-[#1F3A5F]"><Plus className="w-4 h-4"/> Publish Announcement</div><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border rounded p-2.5 text-sm"/><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Announcement message" className="w-full border rounded p-2.5 text-sm min-h-24"/><div className="flex gap-3 items-center"><select value={audience} onChange={e=>setAudience(e.target.value as typeof audience)} className="border rounded p-2.5 text-sm"><option value="students">Students</option><option value="faculty">Faculty</option><option value="both">Students + Faculty</option></select><button className="px-4 py-2 bg-[#1F3A5F] text-white rounded text-sm font-bold">Publish</button></div></form>}
    <div className="space-y-3">{visible.map(a=><div key={a.id} className="bg-white border rounded-lg p-4"><div className="flex justify-between gap-3"><div className="flex gap-3"><Megaphone className="w-5 h-5 text-[#2F7D6D] mt-0.5"/><div><h3 className="font-bold text-[#1F3A5F]">{a.title}</h3><p className="text-sm mt-1">{a.message}</p><p className="text-xs text-[#667085] mt-2">Posted by {a.author} • {a.date}</p></div></div><span className="text-[10px] font-bold uppercase text-[#667085] flex items-center gap-1"><Users className="w-3 h-3"/>{a.audience}</span></div></div>)}</div>
  </div>;
};
