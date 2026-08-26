-- SK Portfolio uses the production Supabase schema already created by migrations.
-- This reference schema matches the live tables used by the application.
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  skill text not null,
  description text not null default '',
  cover_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portfolio_projects(id) on delete cascade,
  storage_path text not null,
  media_type text not null check (media_type in ('image','video')),
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  message text not null,
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_media enable row level security;
alter table public.contact_requests enable row level security;
