import { supabaseAdmin } from '../config/supabase';

// Get user dashboard stats
export async function getUserStats(userId: string) {
  try {
    // Get profile info
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('swipe_count_today, daily_swipe_reset, subscription_tier')
      .eq('id', userId)
      .single();

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // Get matches count
    const { data: matches, error: matchesError } = await supabaseAdmin
      .from('matches')
      .select('id', { count: 'exact' })
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
      .eq('is_active', true);

    // Get unread messages count
    const { data: unreadMessages, error: msgError } = await supabaseAdmin
      .from('messages')
      .select('id', { count: 'exact' })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    // Calculate remaining swipes
    const maxSwipes = profile.subscription_tier === 'campus_plus' ? 999 : 15;
    const usedSwipes = profile.swipe_count_today || 0;
    const remainingSwipes = Math.max(0, maxSwipes - usedSwipes);

    return {
      success: true,
      stats: {
        swipesRemaining: remainingSwipes,
        swipesTotal: maxSwipes,
        matchesCount: matches?.length || 0,
        unreadMessages: unreadMessages?.length || 0,
        subscriptionTier: profile.subscription_tier || 'free'
      }
    };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Reset daily swipes (called by cron job or manually)
export async function resetDailySwipes(userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        swipe_count_today: 0,
        daily_swipe_reset: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: {
  display_name?: string;
  bio?: string;
  faculty?: string;
  year_of_study?: number;
  interests?: string[];
  gender?: string;
}) {
  try {
    // Filter out undefined values
    const updateData: any = {};
    if (updates.display_name !== undefined) updateData.display_name = updates.display_name;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.faculty !== undefined) updateData.faculty = updates.faculty;
    if (updates.year_of_study !== undefined) updateData.year_of_study = updates.year_of_study;
    if (updates.interests !== undefined) updateData.interests = updates.interests;
    if (updates.gender !== undefined) updateData.gender = updates.gender;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, profile: data?.[0] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
