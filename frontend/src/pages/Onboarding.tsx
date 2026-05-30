import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/supabase.js';
import CosmicBackground from '../components/CosmicBackground.js';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Mail, 
  Lock, 
  User, 
  BookOpen, 
  Heart, 
  Sparkles
} from 'lucide-react';

interface University {
  id: string;
  name: string;
  short_name: string;
  domain: string;
}

const STEPS = [
  // TEMP: Changed from 'Institutional Email' for testing
  { id: 'email', title: 'Email Address', icon: Mail },
  // REMOVED: verify step - now happens after signup on separate page
  { id: 'profile', title: 'Your Profile', icon: User },
  { id: 'details', title: 'Details', icon: BookOpen },
  { id: 'interests', title: 'Interests', icon: Sparkles },
  { id: 'intent', title: 'Intent', icon: Heart }
];

const FACULTIES = [
  'Computer Science', 'Engineering', 'Medicine', 'Law', 'Business',
  'Arts & Humanities', 'Social Sciences', 'Natural Sciences', 'Education'
];

const INTERESTS = [
  'Music', 'Sports', 'Reading', 'Gaming', 'Photography', 'Travel',
  'Cooking', 'Art', 'Fitness', 'Movies', 'Dancing', 'Technology',
  'Writing', 'Fashion', 'Nature', 'Volunteering', 'Debating', 'Entrepreneurship'
];

const RELATIONSHIP_INTENTS = [
  { id: 'friendship', label: 'Friendship', description: 'Meet new people and make friends' },
  { id: 'casual', label: 'Casual Dating', description: 'Go on dates, see where it goes' },
  { id: 'relationship', label: 'Relationship', description: 'Looking for something serious' },
  { id: 'networking', label: 'Networking', description: 'Professional connections' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    universityId: '',
    faculty: '',
    yearOfStudy: 1,
    bio: '',
    gender: '',
    interests: [] as string[],
    intent: '',
    otp: ''
  });

  // Fetch universities on mount
  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await fetch(`${API_URL}/universities`);
      const result = await response.json();
      if (result.success) {
        setUniversities(result.universities);
      }
    } catch (err) {
      console.error('Failed to fetch universities');
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
      setError('');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setError('');
  };

  const validateStep = () => {
    const step = STEPS[currentStep].id;
    
    switch (step) {
      case 'email':
        // TEMP: Allow any email for testing (was: .ac.ke only)
        if (!formData.email || !formData.email.includes('@')) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!formData.password || formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        return true;
      // REMOVED: verify case - now handled on separate page after signup
      case 'profile':
        if (!formData.displayName.trim()) {
          setError('Please enter your display name');
          return false;
        }
        if (!formData.universityId) {
          setError('Please select your university');
          return false;
        }
        return true;
      case 'details':
        if (!formData.faculty) {
          setError('Please select your faculty');
          return false;
        }
        if (!formData.gender) {
          setError('Please select your gender');
          return false;
        }
        return true;
      case 'interests':
        if (formData.interests.length < 3) {
          setError('Please select at least 3 interests');
          return false;
        }
        return true;
      case 'intent':
        if (!formData.intent) {
          setError('Please select your relationship intent');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    console.log('Submitting signup for:', formData.email);
    
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          universityId: formData.universityId,
          faculty: formData.faculty,
          yearOfStudy: formData.yearOfStudy,
          gender: formData.gender,
          bio: formData.bio,
          interests: formData.interests,
          intent: formData.intent,
          otp: formData.otp
        })
      });
      
      const result = await response.json();
      console.log('Signup response:', result);
      
      if (result.success) {
        console.log('Signup successful, redirecting to verify-email');
        // Redirect to email verification page
        navigate('/verify-email', { state: { email: formData.email } });
      } else {
        console.error('Signup failed:', result.error);
        setError(result.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup exception:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col relative">
      <CosmicBackground />
      
      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold gradient-text">CampusConnect</span>
          </div>
          <div className="text-sm text-white/60">
            Step {currentStep + 1} of {STEPS.length}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="max-w-md mx-auto mt-4">
          <div className="progress-cosmic">
            <div 
              className="progress-cosmic-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
        <div className="w-full max-w-md">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
              {error}
            </div>
          )}
          
          <div className="glass-card p-8">
            {renderStep()}
          </div>
        </div>
      </main>

      {/* Footer navigation */}
      <footer className="relative z-10 px-6 py-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0 || isLoading}
            className="btn-ghost flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          {currentStep === STEPS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
              {!isLoading && <Check className="w-5 h-5" />}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );

  function renderStep() {
    const step = STEPS[currentStep].id;
    const Icon = STEPS[currentStep].icon;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 mb-4">
            <Icon className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {STEPS[currentStep].title}
          </h2>
          <p className="text-white/60 text-sm">
            {getStepDescription()}
          </p>
        </div>

        {step === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="your@email.com"
                  className="input-cosmic pl-12"
                />
              </div>
              <p className="mt-2 text-xs text-white/40">
                We'll send you a verification code
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Create a secure password"
                  className="input-cosmic pl-12"
                />
              </div>
            </div>
          </div>
        )}

        {step === 'profile' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => updateField('displayName', e.target.value)}
                  placeholder="What should we call you?"
                  className="input-cosmic pl-12"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                University
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {universities.map((uni) => (
                  <button
                    key={uni.id}
                    onClick={() => updateField('universityId', uni.id)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      formData.universityId === uni.id
                        ? 'bg-purple-500/30 border border-purple-400/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium text-white">{uni.name}</div>
                    <div className="text-xs text-white/50">{uni.domain}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Faculty
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FACULTIES.map((faculty) => (
                  <button
                    key={faculty}
                    onClick={() => updateField('faculty', faculty)}
                    className={`p-3 rounded-lg text-sm transition-all ${
                      formData.faculty === faculty
                        ? 'bg-teal-500/30 border border-teal-400/50 text-teal-300'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {faculty}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Year of Study
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((year) => (
                  <button
                    key={year}
                    onClick={() => updateField('yearOfStudy', year)}
                    className={`flex-1 py-3 rounded-lg transition-all ${
                      formData.yearOfStudy === year
                        ? 'bg-purple-500/30 border border-purple-400/50 text-white'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Gender
              </label>
              <div className="flex gap-2">
                {['male', 'female', 'other'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => updateField('gender', gender)}
                    className={`flex-1 py-3 rounded-lg capitalize transition-all ${
                      formData.gender === gender
                        ? 'bg-pink-500/30 border border-pink-400/50 text-pink-300'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'interests' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Select Your Interests ({formData.interests.length}/3 min)
              </label>
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      formData.interests.includes(interest)
                        ? 'tag tag-active'
                        : 'tag'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Bio (Optional)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Tell us a bit about yourself..."
                rows={3}
                maxLength={200}
                className="input-cosmic resize-none"
              />
              <div className="text-right text-xs text-white/40 mt-1">
                {formData.bio.length}/200
              </div>
            </div>
          </div>
        )}

        {step === 'intent' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                What are you looking for?
              </label>
              <div className="space-y-2">
                {RELATIONSHIP_INTENTS.map((intent) => (
                  <button
                    key={intent.id}
                    onClick={() => updateField('intent', intent.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      formData.intent === intent.id
                        ? 'bg-gradient-to-r from-purple-500/30 to-teal-500/30 border border-purple-400/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold text-white">{intent.label}</div>
                    <div className="text-sm text-white/60">{intent.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function getStepDescription() {
    const descriptions: Record<string, string> = {
      // TEMP: Changed from 'university credentials'
      email: 'Start with your email and password',
      // REMOVED: verify description
      profile: 'Tell us who you are',
      details: 'A bit more about you',
      interests: 'What makes you unique',
      intent: 'What brings you here'
    };
    return descriptions[STEPS[currentStep].id] || '';
  }
}
