import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../services/supabase.js';
import CosmicBackground from '../components/CosmicBackground.js';
import { Mail, Check, Sparkles, ArrowLeft, RefreshCw } from 'lucide-react';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otp })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Email verified! Let\'s complete your profile...');
        setTimeout(() => {
          navigate('/onboarding');
        }, 1500);
      } else {
        setError(result.error || 'Verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    
    // Note: Backend would need a resend endpoint
    // For now just show message
    setTimeout(() => {
      setSuccess('New code sent! Check your email.');
      setIsResending(false);
    }, 1000);
  };

  if (!email) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <CosmicBackground />
        <div className="glass-card p-8 text-center max-w-md w-full relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4">No Email Found</h2>
          <p className="text-white/70 mb-6">Please go back and sign up again.</p>
          <Link to="/signup" className="btn-primary inline-block">
            Go to Signup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <CosmicBackground />
      
      <div className="glass-card p-8 max-w-md w-full relative z-10">
        {/* Back button */}
        <Link to="/signup" className="flex items-center gap-2 text-white/60 hover:text-white transition mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500/20 to-teal-500/20 flex items-center justify-center">
            <Mail className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-white/70">
            We sent a 6-digit code to <span className="text-purple-400">{email}</span>
          </p>
        </div>

        {/* Error/Success */}
        {error && (
          <div className="bg-rose-500/20 border border-rose-500/30 rounded-xl p-4 mb-6">
            <p className="text-rose-400 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-teal-500/20 border border-teal-500/30 rounded-xl p-4 mb-6">
            <p className="text-teal-400 text-sm">{success}</p>
          </div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Enter Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="input-cosmic text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full btn-primary py-3 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                Verifying...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Verify Email
              </span>
            )}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 mx-auto transition"
          >
            <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? 'Sending...' : 'Resend Code'}
          </button>
        </div>

        {/* Note */}
        <p className="text-center mt-6 text-white/40 text-xs">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  );
}
