import { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link, useNavigate } from 'react-router-dom';
import { saveSession } from '../services/auth.js';
import CosmicBackground from '../components/CosmicBackground.js';
import { Heart, Mail, Lock, Sparkles, Zap } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Attempting login with:', { email, passwordLength: password.length });

    try {
      const result = await login(email, password);
      console.log('Login result:', result);
      setIsLoading(false);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login exception:', err);
      setIsLoading(false);
      setError('Network error - check console');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <CosmicBackground />
      
      <div className="glass-card p-8 w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-teal-500/30 flex items-center justify-center glow-purple">
              <Heart className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-white/60">Sign in to continue your journey</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-200 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              University Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.ac.ke"
                className="input-cosmic pl-12"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-cosmic pl-12"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Dev Bypass Button */}
          <button
            type="button"
            onClick={() => {
              // Create fake dev session
              saveSession({
                user: {
                  id: 'dev-user-123',
                  email: 'dev@campusconnect.test',
                  profile: {
                    display_name: 'Dev User',
                    faculty: 'Computer Science',
                    year_of_study: 3,
                    is_email_verified: true
                  }
                },
                access_token: 'dev-token',
                refresh_token: 'dev-refresh',
                expires_at: Date.now() + 86400000
              });
              // Reload to trigger AuthContext useEffect
              window.location.href = '/dashboard';
            }}
            className="w-full mt-4 py-3 rounded-full border border-purple-400/30 text-purple-300 hover:bg-purple-500/10 transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Dev Bypass (Testing Only)
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-white/60">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-400 font-semibold hover:text-purple-300 transition">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
