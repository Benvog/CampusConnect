import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession, saveSession, clearSession, login, signup, logout as apiLogout } from '../services/auth.js';

interface User {
  id: string;
  email: string;
  profile: {
    display_name: string;
    faculty: string;
    year_of_study: number;
    is_email_verified: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: any) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const session = getSession();
    if (session?.user) {
      setUser(session.user);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({ email, password });
      
      if (result.success && result.user) {
        setUser(result.user);
        saveSession({ 
          user: result.user, 
          access_token: result.session?.access_token,
          refresh_token: result.session?.refresh_token,
          expires_at: result.session?.expires_at
        });
        return { success: true };
      }
      
      return { success: false, error: result.error || 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const handleSignup = async (data: any) => {
    try {
      const result = await signup(data);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  const handleLogout = async () => {
    const session = getSession();
    if (session?.access_token) {
      await apiLogout(session.access_token);
    }
    clearSession();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
