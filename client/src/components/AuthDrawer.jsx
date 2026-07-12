import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthDrawer({ isOpen, onClose, initialMode = 'login' }) {
  const { login } = useAuth();
  const [mode, setMode] = useState(initialMode);

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // Sync mode when drawer opens with a specific mode
  useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);

  // Reset fields when drawer opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setEmail(''); setPassword('');
      setName(''); setRegEmail(''); setRegPassword('');
      setLoading(false);
    }
  }, [isOpen, mode]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', { name, email: regEmail, password: regPassword });
      login(data.token, data.user);
      toast.success(`Welcome to Casa de Matilda, ${data.user.name.split(' ')[0]}!`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-stone-800">
          <div className="flex gap-1">
            <button
              onClick={() => setMode('login')}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-amber-500 text-stone-900' : 'text-amber-100 hover:text-amber-400'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors ${mode === 'register' ? 'bg-amber-500 text-stone-900' : 'text-amber-100 hover:text-amber-400'}`}
            >
              Register
            </button>
          </div>
          <button onClick={onClose} className="text-amber-100 hover:text-white p-1 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto px-6 py-8">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <p className="text-stone-500 text-sm mb-6">Welcome back! Sign in to your Casa de Matilda account.</p>
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1.5 text-sm">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1.5 text-sm">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-stone-900 font-bold py-3 rounded-2xl transition-colors shadow mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-center text-stone-500 text-sm pt-2">
                Don't have an account?{' '}
                <button type="button" onClick={() => setMode('register')} className="text-teal-600 hover:text-teal-700 font-semibold">
                  Register here
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <p className="text-stone-500 text-sm mb-6">Create your account and start your staycation journey.</p>
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1.5 text-sm">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1.5 text-sm">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1.5 text-sm">Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-stone-900 font-bold py-3 rounded-2xl transition-colors shadow mt-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              <p className="text-center text-stone-500 text-sm pt-2">
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')} className="text-teal-600 hover:text-teal-700 font-semibold">
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
