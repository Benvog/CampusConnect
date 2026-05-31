import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/supabase.js';
import CosmicBackground from '../components/CosmicBackground.js';
import { 
  ChevronLeft,
  Sparkles,
  User,
  Camera,
  Edit3,
  Save,
  X,
  BookOpen,
  Heart,
  LogOut,
  Trash2,
  Plus
} from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  isPrimary: boolean;
}

const INTERESTS_OPTIONS = [
  'Music', 'Sports', 'Reading', 'Gaming', 'Travel', 'Food', 'Movies', 
  'Art', 'Photography', 'Fitness', 'Dancing', 'Coding', 'Politics',
  'Nature', 'Fashion', 'Tech', 'Writing', 'Languages'
];

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'details' | 'settings'>('photos');
  
  // Load dev profile from localStorage
  const devProfile = (() => {
    try {
      const saved = localStorage.getItem('campusconnect_profile');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  })();
  
  // Mock photos
  const [photos] = useState<Photo[]>([
    { id: '1', url: '', isPrimary: true },
  ]);
  
  // Form state - use localStorage for dev mode, otherwise use user profile
  const [formData, setFormData] = useState({
    displayName: devProfile?.display_name || user?.profile?.display_name || '',
    bio: devProfile?.bio || '',
    faculty: devProfile?.faculty || user?.profile?.faculty || '',
    yearOfStudy: (devProfile?.year_of_study?.toString() || user?.profile?.year_of_study?.toString()) || '',
    interests: devProfile?.interests || [],
    gender: devProfile?.gender || 'other'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('campusconnect_session') || '{}');
      const token = session?.access_token || session?.session?.access_token;

      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setIsEditing(false);
        alert('Profile saved successfully!');
      } else {
        alert('Failed to save profile: ' + result.error);
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      <CosmicBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-xl font-bold gradient-text">Your Profile</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="btn-ghost text-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleSave}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Header Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500/30 to-teal-500/30 flex items-center justify-center glow-purple">
                <span className="text-5xl">🎓</span>
              </div>
              {isEditing && (
                <button 
                  onClick={handlePhotoUpload}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white hover:bg-purple-600 transition shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  // Handle file upload
                  console.log('File selected:', e.target.files?.[0]);
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user?.profile?.display_name || 'Student'}
              </h1>
              <p className="text-white/60 flex items-center justify-center md:justify-start gap-2 mb-2">
                <BookOpen className="w-4 h-4" />
                {user?.profile?.faculty || 'Faculty not set'}
                <span className="text-white/30">•</span>
                <span>Year {user?.profile?.year_of_study || '?'}</span>
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="tag tag-active flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Verified Student
                </span>
                <span className="tag">Kabarak University</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'photos', label: 'Photos', icon: Camera },
            { id: 'details', label: 'Details', icon: User },
            { id: 'settings', label: 'Settings', icon: Edit3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          
          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-400" />
                Your Photos
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map(photo => (
                  <div 
                    key={photo.id} 
                    className="aspect-square rounded-xl bg-gradient-to-br from-purple-500/20 to-teal-500/20 flex items-center justify-center relative group overflow-hidden"
                  >
                    <span className="text-4xl">👤</span>
                    {photo.isPrimary && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                        Main
                      </span>
                    )}
                    {isEditing && (
                      <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-rose-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                {isEditing && photos.length < 6 && (
                  <button 
                    onClick={handlePhotoUpload}
                    className="aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 hover:border-purple-400/50 hover:bg-white/5 transition"
                  >
                    <Plus className="w-8 h-8 text-white/40" />
                    <span className="text-white/40 text-sm">Add Photo</span>
                  </button>
                )}
              </div>
              
              <p className="text-white/40 text-sm mt-4">
                Add up to 6 photos. Your first photo will be your main profile picture.
              </p>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <>
              {/* Bio Section */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">About You</h3>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell others about yourself..."
                    className="input-cosmic min-h-[120px] resize-none"
                    maxLength={500}
                  />
                ) : (
                  <p className="text-white/60">
                    {'No bio yet. Click Edit to add one!'}
                  </p>
                )}
              </div>

              {/* Personal Info */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Personal Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Display Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        className="input-cosmic"
                      />
                    ) : (
                      <p className="text-white">{user?.profile?.display_name || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Faculty</label>
                    {isEditing ? (
                      <select
                        value={formData.faculty}
                        onChange={(e) => setFormData(prev => ({ ...prev, faculty: e.target.value }))}
                        className="input-cosmic"
                      >
                        <option value="">Select Faculty</option>
                        <option value="Business">Business</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Law">Law</option>
                        <option value="Education">Education</option>
                        <option value="Arts">Arts</option>
                        <option value="Science">Science</option>
                      </select>
                    ) : (
                      <p className="text-white">{user?.profile?.faculty || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Year of Study</label>
                    {isEditing ? (
                      <select
                        value={formData.yearOfStudy}
                        onChange={(e) => setFormData(prev => ({ ...prev, yearOfStudy: e.target.value }))}
                        className="input-cosmic"
                      >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="5">5th Year+</option>
                      </select>
                    ) : (
                      <p className="text-white">{user?.profile?.year_of_study ? `Year ${user?.profile?.year_of_study}` : 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Gender</label>
                    {isEditing ? (
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                        className="input-cosmic"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="text-white">{'Not set'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_OPTIONS.map(interest => {
                    const isSelected = formData.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => isEditing && handleInterestToggle(interest)}
                        disabled={!isEditing}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                        } ${!isEditing && !isSelected ? 'opacity-50' : ''}`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
                {isEditing && (
                  <p className="text-white/40 text-sm mt-3">
                    Select up to 10 interests
                  </p>
                )}
              </div>
            </>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <>
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
                
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <div className="text-left">
                      <p className="text-white font-medium">Change Password</p>
                      <p className="text-white/40 text-sm">Update your account password</p>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-white/40 rotate-180" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <div className="text-left">
                      <p className="text-white font-medium">Email Preferences</p>
                      <p className="text-white/40 text-sm">Manage notification settings</p>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-white/40 rotate-180" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
                    <div className="text-left">
                      <p className="text-white font-medium">Privacy Settings</p>
                      <p className="text-white/40 text-sm">Control who can see your profile</p>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-white/40 rotate-180" />
                  </button>
                </div>
              </div>

              <div className="glass-card p-6 border-rose-500/30">
                <h3 className="text-lg font-semibold text-rose-400 mb-4">Danger Zone</h3>
                
                <div className="space-y-4">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition">
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
