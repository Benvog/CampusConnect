import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Send, 
  ArrowLeft, 
  Sparkles,
  MoreVertical,
  MessageCircle,
  Heart,
  ChevronLeft
} from 'lucide-react';
import CosmicBackground from '../components/CosmicBackground.js';

interface Match {
  id: string;
  display_name: string;
  photos: string[];
  last_message?: string;
  last_message_time?: string;
  is_online?: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export default function Messages() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch matches
  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      // Mock matches for testing
      const mockMatches: Match[] = [
        {
          id: '1',
          display_name: 'Sarah',
          photos: [],
          last_message: 'Haha that\'s so funny! 😂',
          last_message_time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
          is_online: true
        },
        {
          id: '2',
          display_name: 'Michael',
          photos: [],
          last_message: 'Want to grab coffee tomorrow?',
          last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          is_online: false
        },
        {
          id: '3',
          display_name: 'Jessica',
          photos: [],
          last_message: 'I love that band too! 🎵',
          last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          is_online: true
        }
      ];
      setMatches(mockMatches);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load mock messages when selecting a match
  const loadMockMessages = (matchId: string) => {
    const mockConversations: Record<string, Message[]> = {
      '1': [
        { id: '1', sender_id: '1', content: 'Hey! Nice to match with you 👋', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), is_read: true },
        { id: '2', sender_id: user?.id || 'me', content: 'Hi Sarah! Thanks, you too 😊', created_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), is_read: true },
        { id: '3', sender_id: '1', content: 'So what are you studying?', created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), is_read: true },
        { id: '4', sender_id: user?.id || 'me', content: 'Business! Third year. You?', created_at: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(), is_read: true },
        { id: '5', sender_id: '1', content: 'Same! Well, Business too but year 2', created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), is_read: true },
        { id: '6', sender_id: '1', content: 'Have you taken Marketing 301 yet?', created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), is_read: true },
        { id: '7', sender_id: user?.id || 'me', content: 'Yes! Last semester. It was tough but interesting', created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), is_read: true },
        { id: '8', sender_id: '1', content: 'Haha that\'s so funny! 😂', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), is_read: false },
      ],
      '2': [
        { id: '1', sender_id: '2', content: 'Hey there! Matched!', created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), is_read: true },
        { id: '2', sender_id: user?.id || 'me', content: 'Hey Michael! What\'s up?', created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), is_read: true },
        { id: '3', sender_id: '2', content: 'Not much, just finished a coding project. You?', created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), is_read: true },
        { id: '4', sender_id: user?.id || 'me', content: 'Nice! I\'m procrastinating on my essay 😅', created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), is_read: true },
        { id: '5', sender_id: '2', content: 'Want to grab coffee tomorrow?', created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), is_read: true },
      ],
      '3': [
        { id: '1', sender_id: '3', content: 'Hello! Saw you like Arctic Monkeys 🎸', created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), is_read: true },
        { id: '2', sender_id: user?.id || 'me', content: 'Yes!! Obsessed with them lately', created_at: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(), is_read: true },
        { id: '3', sender_id: '3', content: 'Have you heard their new album?', created_at: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(), is_read: true },
        { id: '4', sender_id: user?.id || 'me', content: 'Not yet! Is it good?', created_at: new Date(Date.now() - 1000 * 60 * 60 * 45).toISOString(), is_read: true },
        { id: '5', sender_id: '3', content: 'Amazing! You have to listen to track 4', created_at: new Date(Date.now() - 1000 * 60 * 60 * 44).toISOString(), is_read: true },
        { id: '6', sender_id: user?.id || 'me', content: 'Will do! Thanks for the rec', created_at: new Date(Date.now() - 1000 * 60 * 60 * 43).toISOString(), is_read: true },
        { id: '7', sender_id: '3', content: 'I love that band too! 🎵', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), is_read: true },
      ]
    };
    setMessages(mockConversations[matchId] || []);
  };

  // Load messages when match selected
  useEffect(() => {
    if (selectedMatch) {
      loadMockMessages(selectedMatch.id);
    }
  }, [selectedMatch]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch) return;

    const message: Message = {
      id: Date.now().toString(),
      sender_id: user?.id || '',
      content: newMessage,
      created_at: new Date().toISOString(),
      is_read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <CosmicBackground />
        <div className="z-10">
          <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative">
      <CosmicBackground />
      
      {/* Sidebar - Matches List */}
      <div className={`w-full md:w-80 flex-shrink-0 border-r border-white/10 glass-card ${selectedMatch ? 'hidden md:block' : 'block'}`}>
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h1 className="text-xl font-bold gradient-text">Messages</h1>
            </div>
          </div>
          
          {/* Search */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10">
            <Search className="w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search matches..."
              className="bg-transparent outline-none text-sm w-full text-white placeholder-white/40"
            />
          </div>
        </div>

        {/* Matches List */}
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {matches.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-400" />
              </div>
              <p className="text-white/60 text-sm">
                No matches yet. Start swiping to find connections!
              </p>
            </div>
          ) : (
            matches.map(match => (
              <button
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition border-b border-white/5 ${
                  selectedMatch?.id === match.id ? 'bg-white/10 border-l-4 border-l-purple-500' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-lg font-bold text-white">
                    {match.display_name[0]}
                  </div>
                  {match.is_online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-teal-400 rounded-full border-2 border-[#0B0B2E]" />
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white text-sm">{match.display_name}</h3>
                  <p className="text-xs text-white/50 truncate">
                    {match.last_message || 'Start a conversation...'}
                  </p>
                </div>
                
                {/* Time */}
                {match.last_message_time && (
                  <span className="text-xs text-white/30">
                    {formatTime(match.last_message_time)}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedMatch ? (
        <div className="flex-1 flex flex-col md:bg-transparent">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <button 
              onClick={() => setSelectedMatch(null)}
              className="md:hidden p-2 -ml-2 text-white/60 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-sm font-bold text-white">
              {selectedMatch.display_name[0]}
            </div>
            
            <div className="flex-1">
              <h2 className="font-semibold text-white">{selectedMatch.display_name}</h2>
              <p className="text-xs text-white/50">
                {selectedMatch.is_online ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-teal-400 rounded-full" />
                    Online
                  </span>
                ) : 'Offline'}
              </p>
            </div>
            
            <button className="p-2 rounded-full hover:bg-white/10 text-white/60">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-6 rounded-2xl glass-card">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mx-auto mb-4 glow-purple">
                    <MessageCircle className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">New Match!</h3>
                  <p className="text-white/60 text-sm">
                    Say hi to {selectedMatch.display_name}
                  </p>
                  <p className="text-white/40 text-xs mt-2">
                    Send a message to break the ice 🧊
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                      isMe 
                        ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white' 
                        : 'glass-card text-white'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <span className={`text-xs mt-1 block ${isMe ? 'text-white/70' : 'text-white/50'}`}>
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-white/10">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/40"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className={`p-2 rounded-full transition ${
                  newMessage.trim()
                    ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
                    : 'bg-white/5 text-white/30'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Empty State - Desktop only */
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 flex items-center justify-center glow-purple">
              <MessageCircle className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
            <p className="text-white/50">
              Choose a match from the sidebar to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
