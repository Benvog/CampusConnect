-- Add Kabarak University to existing database
-- Run this if you already created the tables

insert into public.universities (name, short_name, domain_pattern, city)
values (
    'Kabarak University',
    'KABU',
    '@kabarak.ac.ke',
    'Nakuru'
) on conflict do nothing;
