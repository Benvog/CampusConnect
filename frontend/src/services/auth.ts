import { API_URL } from './supabase.js';

export interface SignupData {
  email: string;
  password: string;
  displayName: string;
  faculty: string;
  yearOfStudy: number;
  universityId: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Sign up new user
export async function signup(data: SignupData) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Login user
export async function login(data: LoginData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Verify email with OTP
export async function verifyEmail(email: string, token: string) {
  const response = await fetch(`${API_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token }),
  });
  return response.json();
}

// Logout user
export async function logout(token: string) {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  return response.json();
}

// Get current session from localStorage
export function getSession() {
  const session = localStorage.getItem('campusconnect_session');
  return session ? JSON.parse(session) : null;
}

// Save session to localStorage
export function saveSession(session: any) {
  localStorage.setItem('campusconnect_session', JSON.stringify(session));
}

// Clear session
export function clearSession() {
  localStorage.removeItem('campusconnect_session');
}

// Refresh token (call when token expires)
export async function refreshToken(refreshToken: string) {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  return response.json();
}
