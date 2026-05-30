import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link } from 'react-router-dom';
import CosmicBackground from '../components/CosmicBackground.js';
import { API_URL } from '../services/supabase.js';
import { 
  ChevronLeft,
  Sparkles,
  Heart,
  X,
  Star,
  MapPin,
  BookOpen,
  Info,
  RefreshCw,
  MessageCircle
} from 'lucide-react';

interface Profile {
  id: string;
  display_name: string;
  age: number;
  faculty: string;
  year_of_study: number;
  bio: string;
  photos: string[];
  interests: string[];
  distance: string;
}


// Mock profiles for testing
const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    display_name: 'Sarah',
    age: 21,
    faculty: 'Business',
    year_of_study: 3,
    bio: 'Coffee lover, bookworm, and aspiring entrepreneur. Always up for deep conversations about life and startups.',
    photos: [],
    interests: ['Reading', 'Coffee', 'Startups', 'Travel'],
    distance: '0.5 km away'
  },
  {
    id: '2',
    display_name: 'Michael',
    age: 22,
    faculty: 'Engineering',
    year_of_study: 4,
    bio: 'Coding by day, gaming by night. Looking for someone to explore the campus with.',
    photos: [],
    interests: ['Coding', 'Gaming', 'Movies', 'Tech'],
    distance: '1.2 km away'
  },
  {
    id: '3',
    display_name: 'Jessica',
    age: 20,
    faculty: 'Arts',
    year_of_study: 2,
    bio: 'Art student who loves music festivals and spontaneous adventures.',
    photos: [],
    interests: ['Art', 'Music', 'Photography', 'Dancing'],
    distance: '0.8 km away'
  }
];

export default function Discover() {
  useAuth();
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setLoading] = useState(false);
  const [matchModal, setMatchModal] = useState<Profile | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  // Fetch profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const session = JSON.parse(localStorage.getItem('campusconnect_session') || '{}');
      const token = session?.access_token || session?.session?.access_token;
      
      const res = await fetch(`${API_URL}/swipes/discover`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success && data.profiles) {
        setProfiles(data.profiles);
      } else {
        // Fallback to mock if API fails
        setProfiles(MOCK_PROFILES);
      }
    } catch (err) {
      console.error('Failed to load profiles:', err);
      setProfiles(MOCK_PROFILES);
    } finally {
      setLoading(false);
    }
  };


  const handleSwipe = async (direction: 'like' | 'pass' | 'super_like') => {
    if (currentIndex >= profiles.length) return;

    const profile = profiles[currentIndex];
    
    // Visual animation
    setSwipeDirection(direction === 'like' ? 'right' : direction === 'pass' ? 'left' : 'up');
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setShowInfo(false);

      // Simulate match (20% chance for demo)
      if (direction !== 'pass' && Math.random() < 0.2) {
        setMatchModal(profile);
      }
    }, 300);

    // Record swipe to backend
    try {
      const session = JSON.parse(localStorage.getItem('campusconnect_session') || '{}');
      const token = session?.access_token || session?.session?.access_token;
      
      await fetch(`${API_URL}/swipes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          swipedId: profile.id,
          direction
        })
      });
    } catch (err) {
      console.error('Failed to record swipe:', err);
    }
  };

  // Touch/Mouse handlers for drag swiping
  const handleDragStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    currentX.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current) return;
    
    currentX.current = clientX;
    const diff = currentX.current - startX.current;
    
    // Only rotate if dragged more than 10px
    if (Math.abs(diff) > 10 && cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const diff = currentX.current - startX.current;
    const threshold = 100;

    if (diff > threshold) {
      handleSwipe('like');
    } else if (diff < -threshold) {
      handleSwipe('pass');
    } else {
      // Snap back to center
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s ease';
        cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transition = '';
          }
        }, 300);
      }
    }
  };

  const currentProfile = profiles[currentIndex];
  const noMoreProfiles = currentIndex >= profiles.length;

  return (
    <div className="min-h-screen relative pb-20">
      <CosmicBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="font-bold gradient-text">Discover</span>
            </div>
            
            <Link to="/premium" className="flex items-center gap-1 text-yellow-400 text-sm">
              <Star className="w-4 h-4" />
              <span>Premium</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto px-4 py-4">
        {/* Profile Card */}
        {!noMoreProfiles && currentProfile ? (
          <div className="relative">
            <div
              ref={cardRef}
              className={`
                glass-card overflow-hidden transition-all duration-300 select-none
                ${swipeDirection === 'right' ? 'translate-x-full rotate-12 opacity-0' : ''}
                ${swipeDirection === 'left' ? '-translate-x-full -rotate-12 opacity-0' : ''}
                ${swipeDirection === 'up' ? '-translate-y-full opacity-0' : ''}
              `}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              {/* Photo Area */}
              <div className="relative h-[420px] bg-gradient-to-br from-purple-500/30 to-teal-500/30 flex items-center justify-center">
                <span className="text-8xl">👤</span>
                
                {/* Photo indicators */}
                <div className="absolute top-4 left-4 right-4 flex gap-1">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex-1 h-1 rounded-full bg-white/30" />
                  ))}
                </div>

                {/* Info button */}
                <button 
                  onClick={() => setShowInfo(!showInfo)}
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/80 hover:text-white"
                >
                  <Info className="w-5 h-5" />
                </button>

                {/* Like/Pass stamps */}
                <div className={`
                  absolute top-20 left-8 border-4 border-green-400 text-green-400 
                  font-bold text-2xl px-4 py-2 rounded-lg transform -rotate-12
                  ${swipeDirection === 'right' ? 'opacity-100' : 'opacity-0'}
                `}>
                  LIKE
                </div>
                <div className={`
                  absolute top-20 right-8 border-4 border-rose-400 text-rose-400 
                  font-bold text-2xl px-4 py-2 rounded-lg transform rotate-12
                  ${swipeDirection === 'left' ? 'opacity-100' : 'opacity-0'}
                `}>
                  NOPE
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {currentProfile.display_name}, {currentProfile.age}
                    </h2>
                    <p className="text-white/60 flex items-center gap-2 text-sm mt-1">
                      <BookOpen className="w-4 h-4" />
                      {currentProfile.faculty}, Year {currentProfile.year_of_study}
                    </p>
                    <p className="text-white/40 flex items-center gap-2 text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      {currentProfile.distance}
                    </p>
                  </div>
                </div>

                {/* Bio (shown when info clicked) */}
                <div className={`
                  overflow-hidden transition-all duration-300
                  ${showInfo ? 'max-h-28 opacity-100 mt-2' : 'max-h-0 opacity-0'}
                `}>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {currentProfile.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interests.map(interest => (
                      <span key={interest} className="tag text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => handleSwipe('pass')}
                className="w-16 h-16 rounded-full glass-card flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition hover:scale-110"
              >
                <X className="w-8 h-8" />
              </button>
              
              <button
                onClick={() => handleSwipe('super_like')}
                className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition hover:scale-110"
              >
                <Star className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => handleSwipe('like')}
                className="w-16 h-16 rounded-full glass-card flex items-center justify-center text-green-400 hover:bg-green-500/20 transition hover:scale-110"
              >
                <Heart className="w-8 h-8" />
              </button>
            </div>

          </div>
        ) : (
          /* No More Profiles State */
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No more profiles
            </h3>
            <p className="text-white/60 mb-6 max-w-xs mx-auto">
              You've seen everyone for now. Come back later or adjust your preferences.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setCurrentIndex(0);
                  setSwipeDirection(null);
                }}
                className="btn-primary"
              >
                Start Over
              </button>
              <Link to="/premium" className="btn-secondary">
                Upgrade for More
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Match Modal */}
      {matchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-sm w-full text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mx-auto mb-4 glow-purple">
              <Heart className="w-10 h-10 text-pink-400" />
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">It's a Match!</h2>
            <p className="text-white/60 mb-6">
              You and {matchModal.display_name} liked each other
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setMatchModal(null)}
                className="flex-1 btn-secondary"
              >
                Keep Swiping
              </button>
              <Link 
                to="/messages"
                onClick={() => setMatchModal(null)}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
