import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../services/supabase.js';
import CosmicBackground from '../components/CosmicBackground.js';
import { Heart, Mail, Lock, Sparkles, ArrowLeft } from 'lucide-react';

// Simple signup - just email/password, profile comes later in /onboarding

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    console.log('Creating account for:', email);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          displayName: '', // Will be filled later in onboarding
          universityId: '',
          faculty: '',
          yearOfStudy: 1
        })
      });

      const result = await response.json();
      console.log('Signup response:', result);

      if (result.success) {
        // Redirect to verify email page
        navigate('/verify-email', { state: { email } });
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <CosmicBackground />
      
      <div className="glass-card p-8 max-w-md w-full relative z-10">
        {/* Back button */}
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500/20 to-teal-500/20 flex items-center justify-center">
            <Heart className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-white/70">Start your CampusConnect journey</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-500/20 border border-rose-500/30 rounded-xl p-4 mb-6">
            <p className="text-rose-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@gmail.com"
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
                placeholder="Create a secure password"
                className="input-cosmic pl-12"
                minLength={6}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="input-cosmic pl-12"
                minLength={6}
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
                Creating...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 font-semibold hover:text-purple-300 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
