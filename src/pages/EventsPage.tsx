import React, { useState } from 'react';
import { CalendarDays, CheckCircle2, Plus, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EventsPage: React.FC = () => {
  const { user, events, addEvent, registerForEvent, unregisterFromEvent, getEventRegistrations } = useApp();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [form, setForm] = useState({
    studentId: user.usn || user.id,
    name: user.name,
    email: user.email,
    phone: '',
    department: user.department,
    semester: user.year || '',
    section: 'A'
  });
  const [message, setMessage] = useState('');

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !location.trim()) return;
    addEvent({ title, date, location, description, createdBy: user.name });
    setTitle(''); setDate(''); setLocation(''); setDescription('');
  };

  const openRegistration = (eventId: string) => {
    setSelectedEvent(eventId);
    setMessage('');
  };

  const submitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !form.studentId.trim() || !form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.department.trim() || !form.semester.trim() || !form.section.trim()) {
      setMessage('Please fill in all details.');
      return;
    }
    registerForEvent(selectedEvent, form);
    setMessage('Registration successful. Your details have been sent to the HOD event list.');
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F3A5F]">Events</h1>
        <p className="text-sm text-[#667085] mt-1">{user.role === 'hod' ? 'Create and manage department events and view registered students.' : 'View department events and register with your details.'}</p>
      </div>

      {user.role === 'hod' && (
        <form onSubmit={add} className="bg-white border rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-[#1F3A5F]"><Plus className="w-4 h-4"/> Create Event</div>
          <div className="grid md:grid-cols-3 gap-3">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Event title" className="border rounded p-2.5 text-sm"/>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border rounded p-2.5 text-sm"/>
            <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" className="border rounded p-2.5 text-sm"/>
          </div>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Event details" className="w-full border rounded p-2.5 text-sm"/>
          <button className="px-4 py-2 bg-[#2F7D6D] text-white rounded text-sm font-bold">Publish Event</button>
        </form>
      )}

      {message && <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 text-sm">{message}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        {events.map(ev => {
          const registered = getEventRegistrations(ev.id).some(r => r.studentId === (user.usn || user.id));
          const registrations = getEventRegistrations(ev.id);
          return (
            <div key={ev.id} className="bg-white border rounded-lg p-5">
              <div className="flex gap-3">
                <CalendarDays className="w-5 h-5 text-[#2F7D6D]"/>
                <div className="flex-1">
                  <h3 className="font-bold text-[#1F3A5F]">{ev.title}</h3>
                  <p className="text-xs text-[#667085] mt-1">{ev.date} • {ev.location}</p>
                  <p className="text-sm mt-3">{ev.description || 'Department event.'}</p>
                  {user.role === 'student' && (
                    <button onClick={() => registered ? unregisterFromEvent(ev.id) : openRegistration(ev.id)} className={`mt-4 px-4 py-2 rounded text-xs font-bold flex items-center gap-2 ${registered ? 'border border-[#2F7D6D] text-[#2F7D6D]' : 'bg-[#1F3A5F] text-white'}`}>
                      {registered && <CheckCircle2 className="w-3.5 h-3.5"/>}
                      {registered ? 'Registered — Cancel' : 'Register for Event'}
                    </button>
                  )}
                  {user.role === 'hod' && (
                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#1F3A5F]"><Users className="w-4 h-4"/> Registered Students ({registrations.length})</div>
                      {registrations.length === 0 ? <p className="text-xs text-[#667085] mt-2">No students have registered yet.</p> : (
                        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                          {registrations.map(r => (
                            <div key={r.id} className="bg-slate-50 border rounded p-3 text-xs">
                              <p className="font-bold text-[#1F3A5F]">{r.name} ({r.studentId})</p>
                              <p className="mt-1">{r.email} • {r.phone}</p>
                              <p className="mt-1">{r.department} • {r.semester} • Section {r.section}</p>
                              <p className="mt-1 text-[#667085]">Registered: {new Date(r.registeredAt).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={submitRegistration} className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1F3A5F]">Event Registration</h2>
                <p className="text-xs text-[#667085] mt-1">Enter your details. The HOD will receive this registration.</p>
              </div>
              <button type="button" onClick={() => setSelectedEvent(null)}><X className="w-5 h-5"/></button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {([['studentId','Student ID'],['name','Name'],['email','Email'],['phone','Phone'],['department','Department'],['semester','Semester'],['section','Section']] as const).map(([key,label]) => (
                <label key={key} className="text-xs font-bold text-[#344054]">
                  {label}
                  <input value={form[key]} onChange={e => setForm(prev => ({...prev, [key]: e.target.value}))} className="mt-1 w-full border rounded p-2.5 text-sm font-normal"/>
                </label>
              ))}
            </div>
            {message && <p className="text-sm text-red-600">{message}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setSelectedEvent(null)} className="px-4 py-2 border rounded text-sm">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#1F3A5F] text-white rounded text-sm font-bold">Submit Registration</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
