// Discovery Feed - Cosmic Glassmorphism Swipe Interface
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { API_URL } from '../services/supabase.js';
import CosmicBackground from '../components/CosmicBackground.js';
import { 
  Heart, 
  X, 
  Star, 
  BookOpen, 
  ArrowLeft, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Profile {
  id: string;
  display_name: string;
  photos: string[];
  faculty: string;
  year_of_study: number;
  bio?: string;
  interests: string[];
  gender?: string;
  universities?: { name: string; short_name: string };
}

export default function Discovery() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [swipesRemaining, setSwipesRemaining] = useState(15);
  const [showMatch, setShowMatch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch profiles
  const fetchProfiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = JSON.parse(localStorage.getItem('campusconnect_session') || '{}');
      const token = session?.access_token || session?.session?.access_token;

      const response = await fetch(`${API_URL}/swipes/discover?limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setProfiles(result.profiles);
        setSwipesRemaining(result.swipesRemaining || 0);
      } else {
        setError(result.error || 'Failed to load profiles');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Handle swipe
  const handleSwipe = async (swipeDirection: 'like' | 'pass' | 'super_like') => {
    if (currentIndex >= profiles.length) return;

    const profile = profiles[currentIndex];
    
    // Visual feedback
    if (swipeDirection === 'like') setDirection('right');
    else if (swipeDirection === 'pass') setDirection('left');
    else if (swipeDirection === 'super_like') setDirection('up');

    // Wait for animation
    setTimeout(async () => {
      try {
        const session = JSON.parse(localStorage.getItem('campusconnect_session') || '{}');
        const token = session?.access_token || session?.session?.access_token;

        const response = await fetch(`${API_URL}/swipes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            swipedId: profile.id,
            direction: swipeDirection
          })
        });

        const result = await response.json();

        if (result.isMatch) {
          setShowMatch(true);
          setTimeout(() => setShowMatch(false), 3000);
        }

        if (result.success) {
          setSwipesRemaining(prev => Math.max(0, prev - 1));
        }
      } catch (err) {
        console.error('Swipe error:', err);
      }

      // Move to next card
      setDirection(null);
      setCurrentIndex(prev => prev + 1);

      // Fetch more if running low
      if (currentIndex >= profiles.length - 3) {
        fetchProfiles();
      }
    }, 400);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleSwipe('pass');
      if (e.key === 'ArrowRight') handleSwipe('like');
      if (e.key === 'ArrowUp') handleSwipe('super_like');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, profiles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <CosmicBackground />
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-white/60">Discovering cosmic connections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <CosmicBackground />
        <div className="glass-card p-8 text-center max-w-md w-full">
          <p className="text-rose-400 mb-4">{error}</p>
          <button 
            onClick={fetchProfiles}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  if (!currentProfile || swipesRemaining === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <CosmicBackground />
        <div className="glass-card p-8 text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-6 glow-purple">
            <Heart className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {swipesRemaining === 0 ? 'No swipes left!' : 'No more profiles'}
          </h2>
          <p className="text-white/60 mb-6">
            {swipesRemaining === 0 
              ? 'Upgrade to CampusPlus for unlimited swipes or return tomorrow.'
              : 'Check back later for more students to discover.'}
          </p>
          
          <div className="flex flex-col gap-3">
            <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            {swipesRemaining === 0 && (
              <Link to="/premium" className="btn-secondary glow-purple flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Upgrade to CampusPlus
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const nextProfile = profiles[currentIndex + 1];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <CosmicBackground />
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="gradient-text font-bold">Discover</span>
          </div>
          <div className="glass-card px-3 py-1.5 flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-400" />
            <span className={`font-semibold ${swipesRemaining <= 3 ? 'text-rose-400' : 'text-white'}`}>
              {swipesRemaining}
            </span>
            <span className="text-white/40 text-sm">/15</span>
          </div>
        </div>
      </header>

      {/* Main card area */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="relative w-full max-w-sm aspect-[3/4]">
          
          {/* Next card (stacked behind) */}
          {nextProfile && (
            <div 
              className="absolute inset-0 glass-card scale-95 opacity-50"
              style={{ transform: 'scale(0.9) translateY(10px)' }}
            >
              <div className="h-full bg-gradient-to-br from-purple-900/50 to-teal-900/50 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white/20" />
              </div>
            </div>
          )}

          {/* Current card */}
          <div 
            className={`
              absolute inset-0 glass-card overflow-hidden
              transition-all duration-500 ease-out
              ${direction === 'left' ? '-translate-x-[120%] -rotate-12 opacity-0' : ''}
              ${direction === 'right' ? 'translate-x-[120%] rotate-12 opacity-0' : ''}
              ${direction === 'up' ? '-translate-y-[120%] opacity-0 scale-90' : ''}
            `}
          >
            {/* Photo placeholder */}
            <div className="h-3/4 bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-teal-600/30 flex items-center justify-center relative">
              {/* Cosmic glow behind placeholder */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B2E] via-transparent to-transparent" />
              
              <div className="text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-4 mx-auto glow-purple">
                  <span className="text-5xl">
                    {currentProfile.gender === 'female' ? '👩‍🎓' : currentProfile.gender === 'male' ? '👨‍🎓' : '🎓'}
                  </span>
                </div>
              </div>

              {/* Swipe indicators */}
              <div className={`
                absolute top-6 left-6 border-4 border-teal-400 rounded-xl px-4 py-2 transform -rotate-12
                transition-all duration-300
                ${direction === 'right' ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}
              `}>
                <span className="text-2xl font-bold text-teal-400 uppercase tracking-wider">LIKE</span>
              </div>
              <div className={`
                absolute top-6 right-6 border-4 border-rose-400 rounded-xl px-4 py-2 transform rotate-12
                transition-all duration-300
                ${direction === 'left' ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}
              `}>
                <span className="text-2xl font-bold text-rose-400 uppercase tracking-wider">NOPE</span>
              </div>
            </div>

            {/* Info section */}
            <div className="h-1/4 p-5 bg-gradient-to-t from-[#0B0B2E] to-transparent">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {currentProfile.display_name}
                  </h3>
                  <div className="flex items-center gap-3 text-white/70 text-sm">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {currentProfile.faculty}
                    </span>
                    <span>•</span>
                    <span>Year {currentProfile.year_of_study}</span>
                  </div>
                </div>
              </div>
              
              {currentProfile.bio && (
                <p className="text-white/60 text-sm mt-2 line-clamp-2">
                  {currentProfile.bio}
                </p>
              )}

              {/* Interest tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {currentProfile.interests?.slice(0, 4).map((interest) => (
                  <span key={interest} className="tag text-xs">
                    {interest}
                  </span>
                ))}
                {currentProfile.interests?.length > 4 && (
                  <span className="tag text-xs text-white/40">
                    +{currentProfile.interests.length - 4}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Action buttons */}
      <footer className="relative z-10 px-6 pb-8">
        <div className="max-w-sm mx-auto flex items-center justify-center gap-4">
          {/* Pass */}
          <button
            onClick={() => handleSwipe('pass')}
            disabled={swipesRemaining <= 0}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 hover:border-rose-400/50 hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-300 hover:scale-110"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Super Like */}
          <button
            onClick={() => handleSwipe('super_like')}
            disabled={swipesRemaining <= 0}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur border border-blue-400/30 flex items-center justify-center text-blue-400 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110"
          >
            <Star className="w-6 h-6" />
          </button>

          {/* Like */}
          <button
            onClick={() => handleSwipe('like')}
            disabled={swipesRemaining <= 0}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 backdrop-blur border border-teal-400/30 flex items-center justify-center text-teal-400 hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 hover:scale-110 glow-teal"
          >
            <Heart className="w-7 h-7" />
          </button>
        </div>
        
        <p className="text-center text-white/40 text-sm mt-4">
          Use arrow keys: ← Pass • → Like • ↑ Super Like
        </p>
      </footer>

      {/* Match modal */}
      {showMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMatch(false)} />
          <div className="glass-card p-8 text-center relative max-w-sm w-full glow-purple">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold gradient-text mb-2">It's a Match!</h2>
            <p className="text-white/70 mb-6">
              You and {currentProfile?.display_name} liked each other
            </p>
            <div className="flex gap-3">
              <Link to="/messages" className="flex-1 btn-primary">
                Send Message
              </Link>
              <button onClick={() => setShowMatch(false)} className="flex-1 btn-secondary">
                Keep Swiping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
