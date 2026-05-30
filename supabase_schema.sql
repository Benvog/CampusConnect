-- =================================================================================
-- CAMPUSCONNECT DATABASE SCHEMA
-- Run this in Supabase SQL Editor to create all tables
-- NOTE: Free users get 15 swipes per day (line 89)
-- =================================================================================

-- Enable UUID extension (for unique IDs)
create extension if not exists "uuid-ossp";

-- =================================================================================
-- 1. UNIVERSITIES TABLE
-- Stores all campuses. Start with just yours, expand later.
-- =================================================================================
create table if not exists public.universities (
    id uuid primary key default uuid_generate_v4(),
    name text not null,                              -- e.g., "University of Nairobi"
    short_name text not null,                        -- e.g., "UoN"
    domain_pattern text not null,                    -- e.g., "@uonbi.ac.ke"
    city text not null,                              -- e.g., "Nairobi"
    country text default 'Kenya',
    is_active boolean default true,                  -- Can disable universities
    created_at timestamp with time zone default now()
);

-- Add Kabarak University (your school)
insert into public.universities (name, short_name, domain_pattern, city)
values (
    'Kabarak University',
    'KABU',
    '@kabarak.ac.ke',
    'Nakuru'
) on conflict do nothing;

-- =================================================================================
-- 2. PROFILES TABLE
-- Extended user information (1-to-1 with auth.users)
-- =================================================================================
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    
    -- Basic Info
    display_name text not null,
    gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
    date_of_birth date,                              -- For age calculation
    
    -- Academic Info (Campus Context)
    university_id uuid references public.universities(id),
    faculty text not null,                           -- e.g., "Computer Science"
    year_of_study integer not null check (year_of_study between 1 and 7),
    
    -- Profile Content
    bio text check (length(bio) <= 500),             -- Max 500 characters
    photos text[] default '{}',                      -- Array of image URLs (max 6)
    interests text[] default '{}',                   -- e.g., ['music', 'sports', 'coding']
    
    -- Dating Intent
    relationship_intent text check (relationship_intent in (
        'friendship', 'casual', 'serious', 'open', 'not_sure'
    )),
    
    -- Verification & Safety
    is_verified_student boolean default false,       -- Email domain verified
    is_email_verified boolean default false,         -- OTP verified
    verification_date timestamp with time zone,
    
    -- Discovery Preferences
    show_me_gender text[] default '{male,female}',   -- Which genders to show
    age_range_min integer default 18,
    age_range_max integer default 28,
    show_only_same_campus boolean default true,
    
    -- Privacy Settings
    profile_visible boolean default true,
    hide_from_specific_users uuid[] default '{}',    -- Array of user IDs to hide from
    incognito_mode boolean default false,            -- Premium feature
    
    -- Engagement Tracking
    last_active_at timestamp with time zone default now(),
    swipe_count_today integer default 0,             -- Reset daily (FREE USERS: 15/day)
    swipe_reset_at timestamp with time zone default now(),
    
    -- Timestamps
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_profiles_university on public.profiles(university_id);
create index idx_profiles_faculty on public.profiles(faculty);
create index idx_profiles_year on public.profiles(year_of_study);
create index idx_profiles_verified on public.profiles(is_verified_student);
create index idx_profiles_visible on public.profiles(profile_visible);

-- =================================================================================
-- 3. SWIPES TABLE
-- Records who swiped on whom (for matching algorithm)
-- =================================================================================
create table if not exists public.swipes (
    id uuid primary key default uuid_generate_v4(),
    swiper_id uuid not null references public.profiles(id) on delete cascade,
    swiped_id uuid not null references public.profiles(id) on delete cascade,
    direction text not null check (direction in ('like', 'pass', 'super_like')),
    created_at timestamp with time zone default now(),
    
    -- Prevent duplicate swipes (same person can't swipe same target twice)
    unique(swiper_id, swiped_id)
);

-- Indexes for matching queries
create index idx_swipes_swiper on public.swipes(swiper_id);
create index idx_swipes_swiped on public.swipes(swiped_id);
create index idx_swipes_direction on public.swipes(direction);

-- =================================================================================
-- 4. MATCHES TABLE
-- Stores mutual matches (both users liked each other)
-- =================================================================================
create table if not exists public.matches (
    id uuid primary key default uuid_generate_v4(),
    user1_id uuid not null references public.profiles(id) on delete cascade,
    user2_id uuid not null references public.profiles(id) on delete cascade,
    
    -- Match initiated by which swipe
    created_at timestamp with time zone default now(),
    
    -- Engagement tracking
    last_message_at timestamp with time zone,
    message_count integer default 0,
    
    -- Status
    is_active boolean default true,                  -- Can be disabled if reported
    unmatched_at timestamp with time zone,
    unmatched_by uuid references public.profiles(id),
    
    -- Ensure user1_id < user2_id to prevent duplicates (always store in same order)
    constraint user_order check (user1_id < user2_id),
    unique(user1_id, user2_id)
);

create index idx_matches_user1 on public.matches(user1_id);
create index idx_matches_user2 on public.matches(user2_id);
create index idx_matches_active on public.matches(is_active);

-- =================================================================================
-- 5. MESSAGES TABLE
-- Chat messages between matched users
-- =================================================================================
create table if not exists public.messages (
    id uuid primary key default uuid_generate_v4(),
    match_id uuid not null references public.matches(id) on delete cascade,
    sender_id uuid not null references public.profiles(id) on delete cascade,
    
    -- Message content
    content text not null check (length(content) <= 1000),
    content_type text default 'text' check (content_type in ('text', 'image')),
    
    -- Media (for images)
    media_url text,
    
    -- Status
    is_read boolean default false,
    read_at timestamp with time zone,
    
    -- Safety: Screenshot notification (if we implement this later)
    screenshot_detected boolean default false,
    
    created_at timestamp with time zone default now()
);

create index idx_messages_match on public.messages(match_id);
create index idx_messages_sender on public.messages(sender_id);
create index idx_messages_created on public.messages(created_at);

-- =================================================================================
-- 6. REPORTS TABLE
-- User reports for moderation
-- =================================================================================
create table if not exists public.reports (
    id uuid primary key default uuid_generate_v4(),
    reporter_id uuid not null references public.profiles(id) on delete cascade,
    reported_id uuid not null references public.profiles(id) on delete cascade,
    
    -- Report details
    category text not null check (category in (
        'harassment', 'fake_profile', 'explicit_content', 
        'spam', 'scam', 'inappropriate_behavior', 'other'
    )),
    description text,
    
    -- Evidence
    screenshot_urls text[] default '{}',
    
    -- Moderation
    status text default 'pending' check (status in ('pending', 'reviewing', 'resolved', 'dismissed')),
    moderator_notes text,
    action_taken text,                                -- e.g., 'warning', 'suspension', 'ban'
    reviewed_at timestamp with time zone,
    reviewed_by uuid references auth.users(id),
    
    created_at timestamp with time zone default now()
);

create index idx_reports_reporter on public.reports(reporter_id);
create index idx_reports_reported on public.reports(reported_id);
create index idx_reports_status on public.reports(status);

-- =================================================================================
-- 7. BLOCKS TABLE
-- Users blocking other users
-- =================================================================================
create table if not exists public.blocks (
    id uuid primary key default uuid_generate_v4(),
    blocker_id uuid not null references public.profiles(id) on delete cascade,
    blocked_id uuid not null references public.profiles(id) on delete cascade,
    created_at timestamp with time zone default now(),
    
    unique(blocker_id, blocked_id)
);

create index idx_blocks_blocker on public.blocks(blocker_id);
create index idx_blocks_blocked on public.blocks(blocked_id);

-- =================================================================================
-- 8. PREMIUM SUBSCRIPTIONS TABLE
-- Track CampusPlus and CampusPro subscriptions
-- =================================================================================
create table if not exists public.subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    
    tier text not null check (tier in ('campus_plus', 'campus_pro')),
    status text not null check (status in ('active', 'cancelled', 'expired')),
    
    -- Billing
    payment_method text,                              -- 'mpesa', 'card'
    payment_reference text,                           -- M-PESA transaction ID
    amount_paid decimal(10, 2),
    currency text default 'KES',
    
    -- Duration
    started_at timestamp with time zone default now(),
    expires_at timestamp with time zone not null,
    cancelled_at timestamp with time zone,
    
    created_at timestamp with time zone default now()
);

create index idx_subscriptions_user on public.subscriptions(user_id);
create index idx_subscriptions_status on public.subscriptions(status);
create index idx_subscriptions_expires on public.subscriptions(expires_at);

-- =================================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- These are CRITICAL for security - they control who can see what data
-- =================================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;
alter table public.subscriptions enable row level security;

-- PROFILES: Users can only see profiles from their university (and verified students only)
create policy "Users can view profiles from their university"
    on public.profiles for select
    using (
        -- Can see own profile
        auth.uid() = id
        OR
        -- Can see verified profiles from same university
        (
            is_verified_student = true
            AND profile_visible = true
            AND university_id = (
                select university_id from public.profiles where id = auth.uid()
            )
        )
    );

-- Users can only update their own profile
create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- SWIPES: Users can only see their own swipes
create policy "Users can view own swipes"
    on public.swipes for select
    using (swiper_id = auth.uid());

create policy "Users can create swipes"
    on public.swipes for insert
    with check (swiper_id = auth.uid());

-- MATCHES: Users can see matches they're part of
create policy "Users can view their matches"
    on public.matches for select
    using (user1_id = auth.uid() or user2_id = auth.uid());

-- MESSAGES: Users can see messages in their matches
create policy "Users can view messages in their matches"
    on public.messages for select
    using (
        match_id in (
            select id from public.matches 
            where user1_id = auth.uid() or user2_id = auth.uid()
        )
    );

create policy "Users can send messages in their matches"
    on public.messages for insert
    with check (
        sender_id = auth.uid()
        AND match_id in (
            select id from public.matches 
            where user1_id = auth.uid() or user2_id = auth.uid()
        )
    );

-- BLOCKS: Users can manage their own blocks
create policy "Users can view their blocks"
    on public.blocks for select
    using (blocker_id = auth.uid());

create policy "Users can create blocks"
    on public.blocks for insert
    with check (blocker_id = auth.uid());

-- SUBSCRIPTIONS: Users can only see their own
create policy "Users can view own subscriptions"
    on public.subscriptions for select
    using (user_id = auth.uid());

-- =================================================================================
-- FUNCTIONS (Database Logic)
-- =================================================================================

-- Function to check if two users have a mutual match
create or replace function public.check_for_match(swiper uuid, swiped uuid)
returns boolean as $$
begin
    return exists (
        select 1 from public.swipes
        where swiper_id = swiped 
        and swiped_id = swiper 
        and direction = 'like'
    );
end;
$$ language plpgsql security definer;

-- Function to create a match when mutual like detected
create or replace function public.create_match(user_a uuid, user_b uuid)
returns uuid as $$
declare
    new_match_id uuid;
    smaller_id uuid;
    larger_id uuid;
begin
    -- Ensure consistent ordering
    if user_a < user_b then
        smaller_id := user_a;
        larger_id := user_b;
    else
        smaller_id := user_b;
        larger_id := user_a;
    end if;
    
    -- Check if match already exists
    select id into new_match_id
    from public.matches
    where user1_id = smaller_id and user2_id = larger_id;
    
    -- Create new match if not exists
    if new_match_id is null then
        insert into public.matches (user1_id, user2_id)
        values (smaller_id, larger_id)
        returning id into new_match_id;
    end if;
    
    return new_match_id;
end;
$$ language plpgsql security definer;

-- Function to reset swipe counts daily (call this with a cron job)
create or replace function public.reset_daily_swipes()
returns void as $$
begin
    update public.profiles
    set swipe_count_today = 0,
        swipe_reset_at = now()
    where swipe_reset_at < now() - interval '24 hours';
end;
$$ language plpgsql security definer;

-- Function to check if user has swipes remaining (FREE = 15/day, Premium = unlimited)
create or replace function public.has_swipes_remaining(user_uuid uuid)
returns boolean as $$
declare
    is_premium boolean;
    swipe_count integer;
begin
    -- Check if user has active premium subscription
    select exists(
        select 1 from public.subscriptions 
        where user_id = user_uuid 
        and status = 'active' 
        and expires_at > now()
    ) into is_premium;
    
    -- Premium users always have swipes
    if is_premium then
        return true;
    end if;
    
    -- Free users: check if under 15 swipes today
    select swipe_count_today into swipe_count
    from public.profiles
    where id = user_uuid;
    
    return swipe_count < 15;
end;
$$ language plpgsql security definer;

-- =================================================================================
-- TRIGGERS (Automatic actions)
-- =================================================================================

-- Auto-update the updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.update_updated_at_column();

-- After insert on swipes: check for match and create if mutual
create or replace function public.handle_swipe()
returns trigger as $$
declare
    mutual boolean;
begin
    -- Check if there's a mutual like
    mutual := public.check_for_match(new.swiper_id, new.swiped_id);
    
    -- If mutual and this swipe is a like, create match
    if mutual and new.direction = 'like' then
        perform public.create_match(new.swiper_id, new.swiped_id);
    end if;
    
    -- Increment swipe count
    update public.profiles
    set swipe_count_today = swipe_count_today + 1
    where id = new.swiper_id;
    
    return new;
end;
$$ language plpgsql security definer;

create trigger after_swipe_insert
    after insert on public.swipes
    for each row
    execute function public.handle_swipe();

-- =================================================================================
-- END OF SCHEMA
-- CONFIGURATION NOTES:
-- - Free users: 15 swipes per day (see has_swipes_remaining function)
-- - Premium users: Unlimited swipes
-- - Change 15 to any number by updating the has_swipes_remaining function
-- =================================================================================
