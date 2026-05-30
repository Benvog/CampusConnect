import { supabaseAdmin } from '../config/supabase';

// Get profiles to show in discovery feed
export async function getDiscoveryProfiles(userId: string, limit: number = 10) {
  try {
    // Get current user's profile for filtering
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('university_id, gender, show_me_gender, age_range_min, age_range_max, show_only_same_campus, swipe_count_today')
      .eq('id', userId)
      .single();

    if (userError || !currentUser) {
      return { success: false, error: 'User profile not found' };
    }

    // Check swipe limit (free users: 15/day)
    const { data: hasSwipes } = await supabaseAdmin
      .rpc('has_swipes_remaining', { user_uuid: userId });

    // Get IDs of users already swiped on
    const { data: swipedIds } = await supabaseAdmin
      .from('swipes')
      .select('swiped_id')
      .eq('swiper_id', userId);

    const excludeIds = swipedIds?.map(s => s.swiped_id) || [];
    excludeIds.push(userId); // Exclude self

    // Get blocked users
    const { data: blocked } = await supabaseAdmin
      .from('blocks')
      .select('blocked_id')
      .eq('blocker_id', userId);
    
    const blockedIds = blocked?.map(b => b.blocked_id) || [];
    const allExcludeIds = [...excludeIds, ...blockedIds];

    // Build query for discovery
    let query = supabaseAdmin
      .from('profiles')
      .select('*, universities(name, short_name)')
      .eq('is_verified_student', true)
      .eq('profile_visible', true)
      .not('id', 'in', `(${allExcludeIds.join(',')})`)
      .limit(limit);

    // Same campus filter
    if (currentUser.show_only_same_campus && currentUser.university_id) {
      query = query.eq('university_id', currentUser.university_id);
    }

    // Gender filter (if user specified preferences)
    if (currentUser.show_me_gender && currentUser.show_me_gender.length > 0) {
      query = query.in('gender', currentUser.show_me_gender);
    }

    // Random ordering for variety
    query = query.order('id', { ascending: false });

    const { data: profiles, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      profiles: profiles || [],
      hasMoreSwipes: hasSwipes !== false,
      swipesRemaining: Math.max(0, 15 - (currentUser.swipe_count_today || 0))
    };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Record a swipe (like, pass, or super_like)
export async function recordSwipe(
  swiperId: string, 
  swipedId: string, 
  direction: 'like' | 'pass' | 'super_like'
) {
  try {
    console.log(`Recording swipe: ${swiperId} -> ${swipedId}, direction: ${direction}`);
    
    // Check if swiper has swipes remaining
    const { data: hasSwipes, error: swipeCheckError } = await supabaseAdmin
      .rpc('has_swipes_remaining', { user_uuid: swiperId });
    
    if (swipeCheckError) {
      console.error('Error checking swipes:', swipeCheckError);
    }

    if (!hasSwipes) {
      return { success: false, error: 'No swipes remaining. Upgrade to CampusPlus for unlimited swipes.' };
    }

    // Check if already swiped
    const { data: existing } = await supabaseAdmin
      .from('swipes')
      .select('id')
      .eq('swiper_id', swiperId)
      .eq('swiped_id', swipedId)
      .single();

    if (existing) {
      return { success: false, error: 'Already swiped on this profile' };
    }

    // Insert swipe
    console.log('Inserting swipe into database...');
    const { data: swipe, error } = await supabaseAdmin
      .from('swipes')
      .insert({
        swiper_id: swiperId,
        swiped_id: swipedId,
        direction
      })
      .select();

    if (error) {
      console.error('Swipe insert error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Swipe recorded successfully:', swipe);

    // Increment swipe counter
    await supabaseAdmin.rpc('increment_swipe_count', { user_uuid: swiperId });

    // Check for mutual match (if this is a like)
    let isMatch = false;
    let matchId = null;

    if (direction === 'like' || direction === 'super_like') {
      const { data: mutual } = await supabaseAdmin
        .from('swipes')
        .select('id')
        .eq('swiper_id', swipedId)
        .eq('swiped_id', swiperId)
        .eq('direction', 'like')
        .single();

      if (mutual) {
        isMatch = true;
        // Create match
        const { data: match } = await supabaseAdmin
          .rpc('create_match', { user_a: swiperId, user_b: swipedId });
        matchId = match;
      }
    }

    return { 
      success: true, 
      isMatch, 
      matchId,
      message: isMatch ? "It's a match!" : 'Swipe recorded'
    };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
