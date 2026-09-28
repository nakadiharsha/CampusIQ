import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Code } from 'lucide-react';
import type { UserRole } from '../types';

export const LoginPage: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState('trisha@student.college.edu');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError('Invalid institutional credentials. Use a demo account below.');
    }
  };

  const handleDemoSelect = (role: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    switchDemoRole(role);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center p-4 text-[#17202A] select-none">
      <div className="w-full max-w-md bg-white border border-[#D9DEE5] rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#1F3A5F] text-white text-center border-b border-[#172D4A]">
          <div className="w-12 h-12 bg-[#2F7D6D] rounded-md flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-2 border border-[#3E9A87] shadow-sm">
            C
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">CampusIQ</h1>
          <p className="text-xs text-[#A0AEC0] mt-1">Private Institutional AI for Higher Education</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="text-center mb-2">
            <h2 className="text-sm font-bold text-[#1F3A5F]">Sign in to your institution</h2>
            <p className="text-xs text-[#667085]">Enter your campus single sign-on credentials</p>
          </div>

          {error && (
            <div className="p-3 bg-[#FFF5F5] border border-[#FEB2B2] rounded text-xs text-[#B54747] font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#1F3A5F] mb-1">Institutional Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="w-full pl-9 pr-3 py-2.5 border border-[#D9DEE5] rounded bg-[#F7F8FA] text-[#17202A] focus:outline-none focus:border-[#1F3A5F] focus:bg-white"
                />
                <Mail className="w-4 h-4 text-[#667085] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1F3A5F] mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-[#D9DEE5] rounded bg-[#F7F8FA] text-[#17202A] focus:outline-none focus:border-[#1F3A5F] focus:bg-white"
                />
                <Lock className="w-4 h-4 text-[#667085] absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1F3A5F] text-white text-xs font-bold rounded hover:bg-[#172D4A] cursor-pointer flex items-center justify-center gap-2 transition-colors"
            >
              <span>{loading ? 'Authenticating...' : 'Sign in to CampusIQ'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Dev Demo Account Selector */}
          <div className="mt-6 pt-4 border-t border-[#D9DEE5] bg-[#F7F8FA] -mx-6 -mb-6 p-4 rounded-b-lg">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#315A7D] uppercase tracking-wider mb-2">
              <Code className="w-3.5 h-3.5 text-[#2F7D6D]" />
              <span>Development Demo Role Switcher</span>
            </div>
            <p className="text-[11px] text-[#667085] mb-3 leading-snug">
              Click any role below to automatically authenticate as that persona:
            </p>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleDemoSelect('student', 'trisha@student.college.edu')}
                className="p-2 bg-white border border-[#D9DEE5] hover:border-[#1F3A5F] rounded text-center cursor-pointer transition-colors"
              >
                <span className="font-bold text-[#1F3A5F] block">Student</span>
                <span className="text-[9px] text-[#667085] block truncate">Trisha D M</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('faculty', 'ananya.rao@college.edu')}
                className="p-2 bg-white border border-[#D9DEE5] hover:border-[#1F3A5F] rounded text-center cursor-pointer transition-colors"
              >
                <span className="font-bold text-[#315A7D] block">Faculty</span>
                <span className="text-[9px] text-[#667085] block truncate">Dr. Ananya</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('hod', 'rajesh.kumar@college.edu')}
                className="p-2 bg-white border border-[#D9DEE5] hover:border-[#1F3A5F] rounded text-center cursor-pointer transition-colors"
              >
                <span className="font-bold text-[#2F7D6D] block">HOD</span>
                <span className="text-[9px] text-[#667085] block truncate">Dr. Rajesh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-[#667085] flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#2F7D6D]" />
        <span>Grounded Knowledge • Role-Based Security • Institutional Governance</span>
      </div>
    </div>
  );
};
