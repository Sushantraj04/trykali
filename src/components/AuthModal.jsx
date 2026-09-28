import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, CheckCircle2, AlertCircle, UserPlus, LogIn, ArrowRight } from 'lucide-react';
import { cyberAuth } from '../utils/supabaseClient';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

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

        setSuccessMsg("Account successfully created! Logging you in...");
        setTimeout(() => {
          onAuthSuccess(user);
          onClose();
        }, 600);
      } else {
        // STRICT SIGN IN: Only allows registered email & correct password!
        if (!email.trim() || !password.trim()) {
          throw new Error("Please enter both email and password.");
        }

        const user = await cyberAuth.signIn({
          email: email.trim(),
          password: password.trim()
        });

        setSuccessMsg(`Welcome back, ${user.username || user.email}! Logging in...`);
        setTimeout(() => {
          onAuthSuccess(user);
          onClose();
        }, 500);
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToSignUp = () => {
    setIsSignUp(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSwitchToSignIn = () => {
    setIsSignUp(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0a0d14] border border-cyber-border rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden font-sans">
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-green via-cyber-cyan to-cyber-green" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyber-green/10 border border-cyber-green/40 flex items-center justify-center neon-border-green">
            <Shield className="w-5 h-5 text-cyber-green" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              {isSignUp ? 'Create New Account' : 'Sign In to Account'}
            </h2>
            <p className="text-xs text-slate-400">
              {isSignUp 
                ? 'Register your email to save progress, ranks & lab solutions.' 
                : 'Enter your registered credentials to access your profile.'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-[#111622] p-1 rounded-xl mb-5 border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={handleSwitchToSignIn}
            className={`py-2 rounded-lg font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              !isSignUp ? 'bg-cyber-green/15 text-cyber-green shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={handleSwitchToSignUp}
            className={`py-2 rounded-lg font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              isSignUp ? 'bg-cyber-green/15 text-cyber-green shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up (Register)</span>
          </button>
        </div>

        {/* Error Alert with Quick Switch to SignUp if user doesn't exist */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex flex-col space-y-2">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
            {errorMsg.toLowerCase().includes("no account found") && !isSignUp && (
              <button
                type="button"
                onClick={handleSwitchToSignUp}
                className="self-start text-[11px] text-cyber-green hover:underline font-mono flex items-center space-x-1"
              >
                <span>Register a new account here</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-cyber-green" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                Hacker Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. cyber_operator"
                  className="w-full bg-[#111622] border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyber-green font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#111622] border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyber-green font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 6 characters)"
                className="w-full bg-[#111622] border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyber-green font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-xl bg-cyber-green hover:bg-cyber-greenDim text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 font-mono"
          >
            <span>{loading ? 'Verifying Credentials...' : (isSignUp ? 'Register My Account' : 'Sign In')}</span>
          </button>
        </form>

        {/* Toggle between Login and Register info */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          {!isSignUp ? (
            <p>
              Need an account?{' '}
              <button
                type="button"
                onClick={handleSwitchToSignUp}
                className="text-cyber-green font-semibold hover:underline font-mono ml-1"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={handleSwitchToSignIn}
                className="text-cyber-green font-semibold hover:underline font-mono ml-1"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
