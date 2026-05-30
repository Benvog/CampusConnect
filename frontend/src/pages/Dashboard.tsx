// Dashboard - Cosmic Bento Grid Layout
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { 
  Heart, 
  User, 
  Settings, 
  LogOut, 
  MessageCircle, 
  RefreshCw,
  Sparkles,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/supabase.js';
import CosmicBackground from '../components/CosmicBackground.js';

interface UserStats {
  swipesRemaining: number;
  swipesTotal: number;
  matchesCount: number;
  unreadMessages: number;
  subscriptionTier: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    swipesRemaining: 15,
    swipesTotal: 15,
    matchesCount: 0,
    unreadMessages: 0,
    subscriptionTier: 'free'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('campusconnect_session') || '{}');
      const token = session?.access_token || session?.session?.access_token;

      const response = await fetch(`${API_URL}/user/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (result.success && result.stats) {
        setStats(result.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  return (
    <div className="min-h-screen relative">
      <CosmicBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold gradient-text">CampusConnect</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchStats}
                className="p-2 text-white/60 hover:text-white transition"
                title="Refresh stats"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="p-2 text-white/60 hover:text-white transition">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="btn-ghost text-rose-400 hover:text-rose-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/30 to-teal-500/30 flex items-center justify-center glow-purple">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.profile?.display_name?.split(' ')[0] || 'Student'}!
              </h1>
              <p className="text-white/60">
                {user?.profile?.faculty} • Year {user?.profile?.year_of_study}
              </p>
            </div>
            <div className="ml-auto">
              <span className="tag tag-active flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
          
          {/* Discover Card - Large */}
          <Link to="/discover" className="glass-card p-6 md:col-span-2 relative overflow-hidden group hover:border-purple-400/30 transition-all block min-h-[180px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center glow-purple">
                    <Heart className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Discover</h3>
                    <p className="text-white/50 text-sm">Find your campus connection</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-purple-400 font-medium">
                <span>Start Swiping</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </Link>

          {/* Matches Card */}
          <div className="glass-card p-6 relative overflow-hidden group hover:border-pink-400/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Matches</h3>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{stats.matchesCount}</p>
              <p className="text-white/50 text-sm">
                {stats.matchesCount === 0 ? 'Find your first match!' : 'Keep the connection going'}
              </p>
            </div>
          </div>

          {/* Messages Card */}
          <Link to="/messages" className="glass-card p-6 relative overflow-hidden group hover:border-teal-400/30 transition-all block">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Messages</h3>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{stats.unreadMessages}</p>
              <p className="text-white/50 text-sm">
                {stats.unreadMessages === 0 ? 'No new messages' : 'Unread messages'}
              </p>
              <span className="text-teal-400 text-sm font-medium flex items-center gap-1 mt-3">
                Open Inbox
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Profile Card */}
          <Link to="/profile" className="glass-card p-6 relative overflow-hidden group hover:border-blue-400/30 transition-all block">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Your Profile</h3>
              </div>
              <p className="text-white/60 text-sm mb-4">
                Update photos, bio, and preferences
              </p>
              <span className="text-blue-400 text-sm font-medium flex items-center gap-1">
                Edit Profile
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Events Card */}
          <Link to="/events" className="glass-card p-6 relative overflow-hidden group hover:border-orange-400/30 transition-all block">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Events</h3>
              </div>
              <p className="text-white/60 text-sm mb-4">
                Campus happenings and meetups
              </p>
              <span className="text-orange-400 text-sm font-medium flex items-center gap-1">
                Browse Events
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Premium Card */}
          <Link to="/premium" className="glass-card p-6 relative overflow-hidden group hover:border-purple-400/30 transition-all block">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center glow-purple">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Upgrade</h3>
              </div>
              <p className="text-white/60 text-sm mb-4">
                Get unlimited swipes & more
              </p>
              <span className="gradient-text text-sm font-semibold flex items-center gap-1">
                Go Premium
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}
