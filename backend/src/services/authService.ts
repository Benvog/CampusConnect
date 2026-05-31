import { supabaseAdmin, supabase } from '../config/supabase';
import { SignupRequest, LoginRequest, Profile } from '../types/index';

// Check if email is from a .ac.ke domain (student verification)
function isStudentEmail(email: string): boolean {
  return email.toLowerCase().endsWith('.ac.ke');
}

// Extract domain from email
function getEmailDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() || '';
}

// Sign up a new user
export async function signupUser(data: SignupRequest) {
  try {
    console.log(`Signup attempt for: ${data.email}`);
    
    // TEMP: Commented out .ac.ke check for testing
    // if (!isStudentEmail(data.email)) {
    //   return {
    //     success: false,
    //     error: 'Only university emails (.ac.ke) are allowed'
    //   };
    // }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: false, // Require email verification
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || 'Failed to create user'
      };
    }

    const userId = authData.user.id;

    // Only create profile if onboarding data provided
    // Otherwise profile will be created during /onboarding
    if (data.displayName && data.universityId) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          display_name: data.displayName,
          faculty: data.faculty,
          year_of_study: data.yearOfStudy,
          university_id: data.universityId,
          is_verified_student: true,
          is_email_verified: false,
          photos: [],
          interests: []
        });

      if (profileError) {
        // Rollback: delete the auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return {
          success: false,
          error: 'Failed to create profile: ' + profileError.message
        };
      }
    }

    // Send email verification OTP
    console.log(`Sending OTP to: ${data.email}`);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: data.email,
    });
    
    if (otpError) {
      console.error('OTP send error:', otpError);
      // Don't fail - user is created, they can resend later
    } else {
      console.log('OTP sent successfully');
    }

    return {
      success: true,
      message: 'Account created! Check your email for verification code.',
      userId: userId
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Signup failed'
    };
  }
}

// Verify email with OTP
export async function verifyEmail(email: string, token: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Update profile to mark email as verified
    if (data.user) {
      await supabaseAdmin
        .from('profiles')
        .update({ is_email_verified: true, verification_date: new Date().toISOString() })
        .eq('id', data.user.id);
    }

    return { 
      success: true, 
      message: 'Email verified successfully!',
      user: data.user,
      session: data.session
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Login user
export async function loginUser(data: LoginRequest) {
  try {
    console.log(`Login attempt: ${data.email}`);
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error('Supabase auth error:', error.message);
      return { success: false, error: error.message };
    }

    if (!authData.user) {
      console.error('No user returned from Supabase');
      return { success: false, error: 'Login failed' };
    }

    console.log('Auth successful, fetching profile for:', authData.user.id);

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return { success: false, error: 'Profile not found' };
    }

    console.log('Login successful for:', data.email);
    return {
      success: true,
      message: 'Login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        profile: profile as Profile
      },
      session: authData.session
    };
  } catch (error: any) {
    console.error('Login exception:', error);
    return { success: false, error: error.message };
  }
}

// Logout user
export async function logoutUser(token: string) {
  try {
    // Sign out on server side
    const { error } = await supabaseAdmin.auth.admin.signOut(token);
    
    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'Logout successful' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get user by token
export async function getUserFromToken(token: string) {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    // Get profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email,
      profile: profile as Profile
    };
  } catch {
    return null;
  }
}
