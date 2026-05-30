import { useState } from 'react';
import { Link } from 'react-router-dom';
import CosmicBackground from '../components/CosmicBackground.js';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ChevronLeft,
  Sparkles,
  Music,
  BookOpen,
  Trophy,
  PartyPopper
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'social' | 'academic' | 'sports' | 'party';
  host: string;
  attendees: number;
  isRsvped: boolean;
  isFeatured?: boolean;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Valentine\'s Day Mixer',
    description: 'Join us for a night of music, dancing, and meeting new people!',
    date: '2026-02-14',
    time: '7:00 PM',
    location: 'Student Center Hall',
    category: 'party',
    host: 'Campus Events Club',
    attendees: 124,
    isRsvped: false,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Tech Talk: AI in Education',
    description: 'Learn how AI is transforming the classroom experience.',
    date: '2026-02-16',
    time: '2:00 PM',
    location: 'Engineering Building 301',
    category: 'academic',
    host: 'Computer Science Society',
    attendees: 45,
    isRsvped: true
  },
  {
    id: '3',
    title: 'Inter-Faculty Football',
    description: 'Business vs Engineering - Who will win the trophy?',
    date: '2026-02-18',
    time: '4:00 PM',
    location: 'Main Sports Field',
    category: 'sports',
    host: 'Sports Committee',
    attendees: 89,
    isRsvped: false
  },
  {
    id: '4',
    title: 'Campus Karaoke Night',
    description: 'Show off your singing skills or just enjoy the show!',
    date: '2026-02-20',
    time: '8:00 PM',
    location: 'Cafeteria Terrace',
    category: 'social',
    host: 'Entertainment Guild',
    attendees: 67,
    isRsvped: false
  },
  {
    id: '5',
    title: 'Study Group: Finals Prep',
    description: 'Collaborative study session for upcoming exams.',
    date: '2026-02-22',
    time: '10:00 AM',
    location: 'Library 2nd Floor',
    category: 'academic',
    host: 'Academic Success Center',
    attendees: 23,
    isRsvped: true
  },
  {
    id: '6',
    title: 'End of Semester Party',
    description: 'Celebrate the end of exams with music, food, and fun!',
    date: '2026-02-28',
    time: '9:00 PM',
    location: 'Campus Amphitheater',
    category: 'party',
    host: 'Student Government',
    attendees: 256,
    isRsvped: false,
    isFeatured: true
  }
];

const categoryIcons = {
  social: PartyPopper,
  academic: BookOpen,
  sports: Trophy,
  party: Music
};

const categoryColors = {
  social: 'from-pink-500 to-rose-500',
  academic: 'from-blue-500 to-cyan-500',
  sports: 'from-orange-500 to-yellow-500',
  party: 'from-purple-500 to-pink-500'
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredEvents = filteredEvents.filter(e => e.isFeatured);
  const regularEvents = filteredEvents.filter(e => !e.isFeatured);

  const handleRsvp = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isRsvped: !event.isRsvped, attendees: event.isRsvped ? event.attendees - 1 : event.attendees + 1 }
        : event
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  return (
    <div className="min-h-screen relative">
      <CosmicBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold gradient-text">Campus Events</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-full glass-card max-w-md">
            <Search className="w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`tag ${selectedCategory === 'all' ? 'tag-active' : ''}`}
            >
              All Events
            </button>
            {Object.entries(categoryIcons).map(([cat, Icon]) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`tag ${selectedCategory === cat ? 'tag-active' : ''} flex items-center gap-1.5`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid - Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
          
          {/* Featured Events */}
          {featuredEvents.map(event => {
            const { day, month } = formatDate(event.date);
            const Icon = categoryIcons[event.category];
            return (
              <div 
                key={event.id} 
                className="glass-card p-6 md:col-span-2 relative overflow-hidden group hover:border-purple-400/30 transition-all"
              >
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${categoryColors[event.category]} opacity-20 rounded-full blur-3xl`} />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                  {/* Date Badge */}
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${categoryColors[event.category]} flex flex-col items-center justify-center text-white shadow-lg`}>
                      <span className="text-2xl font-bold">{day}</span>
                      <span className="text-xs font-medium opacity-80">{month}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 text-sm font-medium capitalize">{event.category}</span>
                      <span className="text-white/30">•</span>
                      <span className="text-white/50 text-sm">{event.time}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-white/60 text-sm mb-4">{event.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.attendees} attending
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleRsvp(event.id)}
                        className={`btn-primary text-sm ${event.isRsvped ? 'opacity-50' : ''}`}
                      >
                        {event.isRsvped ? '✓ RSVPed' : 'RSVP Now'}
                      </button>
                      <span className="text-white/40 text-xs">
                        Hosted by {event.host}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Regular Events */}
          {regularEvents.map(event => {
            const { day, month } = formatDate(event.date);
            const Icon = categoryIcons[event.category];
            return (
              <div 
                key={event.id} 
                className="glass-card p-5 relative overflow-hidden group hover:border-purple-400/30 transition-all"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${categoryColors[event.category]} opacity-10 rounded-full blur-2xl`} />
                
                <div className="relative z-10">
                  {/* Date & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${categoryColors[event.category]} text-white text-xs font-medium`}>
                      {month} {day}
                    </div>
                    <Icon className="w-4 h-4 text-white/40" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{event.title}</h3>
                  
                  {/* Details */}
                  <div className="space-y-2 text-sm text-white/50 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {event.attendees} going
                    </span>
                  </div>

                  {/* RSVP Button */}
                  <button
                    onClick={() => handleRsvp(event.id)}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                      event.isRsvped
                        ? 'bg-white/10 text-white/60'
                        : 'bg-gradient-to-r from-purple-500 to-teal-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
                    }`}
                  >
                    {event.isRsvped ? '✓ Going' : 'RSVP'}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="md:col-span-3 text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
              <p className="text-white/50">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
