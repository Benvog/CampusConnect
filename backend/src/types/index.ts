// User types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  date_of_birth?: string;
  university_id?: string;
  faculty: string;
  year_of_study: number;
  bio?: string;
  photos: string[];
  interests: string[];
  relationship_intent?: 'friendship' | 'casual' | 'serious' | 'open' | 'not_sure';
  is_verified_student: boolean;
  is_email_verified: boolean;
  swipe_count_today: number;
  created_at: string;
  updated_at: string;
}

// Auth types
export interface SignupRequest {
  email: string;
  password: string;
  displayName: string;
  faculty: string;
  yearOfStudy: number;
  universityId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
