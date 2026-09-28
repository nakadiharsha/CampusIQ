import React from 'react';
import { Clock } from 'lucide-react';
const classes=[['09:00','Computer Networks','Room 301'],['10:00','Operating Systems','Lab 2'],['11:30','DBMS','Room 204'],['14:00','Software Engineering','Room 105']];
export const TimetablePage:React.FC=()=> <div className="space-y-6"><div><h1 className="text-2xl font-bold text-[#1F3A5F]">My Timetable</h1><p className="text-sm text-[#667085] mt-1">Today’s class schedule.</p></div><div className="bg-white border rounded-lg divide-y">{classes.map(c=><div key={c[0]} className="p-4 flex items-center gap-4"><Clock className="w-5 h-5 text-[#2F7D6D]"/><span className="font-bold w-20">{c[0]}</span><div><div className="font-semibold">{c[1]}</div><div className="text-xs text-[#667085]">{c[2]}</div></div></div>)}</div></div>;
