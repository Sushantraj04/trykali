import React, { useState } from 'react';
import { Terminal, Shield, Lock, Mail, User, CheckCircle2, AlertCircle, UserPlus, LogIn, Sparkles, ArrowRight } from 'lucide-react';
import { cyberAuth } from '../utils/supabaseClient';

export function AuthGate({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!email.trim() || !password.trim()) {
          throw new Error("Both email and password are required.");
        }
        if (password.trim().length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }

        const user = await cyberAuth.signUp({
          email: email.trim(),
          password: password.trim(),
          username: username.trim()
        });

        setSuccessMsg("Account successfully registered! Initializing sandbox...");
        setTimeout(() => {
          onAuthSuccess(user);
        }, 500);
      } else {
        if (!email.trim() || !password.trim()) {
          throw new Error("Please enter both email and password.");
        }

        const user = await cyberAuth.signIn({
          email: email.trim(),
          password: password.trim()
        });

        setSuccessMsg(`Welcome back, ${user.username || user.email}! Launching workspace...`);
        setTimeout(() => {
          onAuthSuccess(user);
        }, 400);
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-20 font-sans">
      <div className="relative w-full max-w-md bg-[#070b16]/95 border border-cyber-green/40 rounded-3xl shadow-[0_0_80px_rgba(0,255,136,0.18)] p-6 sm:p-8 backdrop-blur-2xl overflow-hidden space-y-6">
        {/* Subtle Ambient Top Edge Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-green to-transparent" />

        {/* Brand Logo & Security Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyber-green via-cyan-400 to-purple-600 p-[1.5px] shadow-lg shadow-cyber-green/20">
                <div className="w-full h-full bg-[#080d18] rounded-[14px] flex items-center justify-center">
                  <Terminal className="w-8 h-8 text-cyber-green" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyber-green border-2 border-[#070b16]"></span>
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
              CYBER<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyber-green to-cyan-300">KALI</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Restricted Access • Operator Authentication Required
            </p>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 gap-1 bg-[#040711] p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              !isSignUp 
                ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/30 shadow-sm' 
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              isSignUp 
                ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/30 shadow-sm' 
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register ID</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-start space-x-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2 font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-cyber-green" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Operator Handle / Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. shadow_hacker"
                  className="w-full bg-[#040711] border border-slate-800 focus:border-cyber-green rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none font-mono transition-colors shadow-inner"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@security.org"
                className="w-full bg-[#040711] border border-slate-800 focus:border-cyber-green rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none font-mono transition-colors shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 6 characters)"
                className="w-full bg-[#040711] border border-slate-800 focus:border-cyber-green rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none font-mono transition-colors shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-cyber-green via-emerald-400 to-teal-300 hover:from-emerald-400 hover:to-teal-200 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-cyber-green/20 hover:shadow-cyber-green/40 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 font-display cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : (isSignUp ? 'Register & Enter Sandbox' : 'Sign In to Station')}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </form>

        {/* Security Notice */}
        <div className="pt-2 text-center text-[11px] font-mono text-slate-500 border-t border-slate-800/80">
          <span>🔒 End-to-End Encrypted Session • Zero-Trust Platform Security</span>
        </div>
      </div>
    </div>
  );
}
