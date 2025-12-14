import React, { useState } from 'react';
import { ScanLine, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 space-y-8 animate-fade-in-up">
        <div className="text-center space-y-3">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-200 mb-6 transform rotate-3">
            <ScanLine className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">BillScanner AI</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Turn your paper receipts into digital spreadsheets instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
              Username / Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50 text-slate-900 placeholder:text-slate-400 font-medium"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center group"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100">
             <p className="text-center text-xs text-slate-400">
                No password required. Secure & Private.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;