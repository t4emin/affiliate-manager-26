create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  name text not null,
  source_url text,
  image_url text,
  price numeric,
  currency text not null default 'THB',
  description text,
  ai_score numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  platform text,
  original_url text,
  affiliate_url text not null,
  clicks integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  type text not null,
  title text,
  body text,
  status text not null default 'draft',
  ai_provider text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  job_type text not null,
  status text not null default 'pending',
  input jsonb,
  output jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaigns_user_id_idx on public.campaigns(user_id);
create index if not exists products_user_id_idx on public.products(user_id);
create index if not exists products_campaign_id_idx on public.products(campaign_id);
create index if not exists affiliate_links_user_id_idx on public.affiliate_links(user_id);
create index if not exists affiliate_links_product_id_idx on public.affiliate_links(product_id);
create index if not exists contents_user_id_idx on public.contents(user_id);
create index if not exists ai_jobs_user_id_idx on public.ai_jobs(user_id);

drop trigger if exists set_campaigns_updated_at on public.campaigns;
create trigger set_campaigns_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_affiliate_links_updated_at on public.affiliate_links;
create trigger set_affiliate_links_updated_at
before update on public.affiliate_links
for each row execute function public.set_updated_at();

drop trigger if exists set_contents_updated_at on public.contents;
create trigger set_contents_updated_at
before update on public.contents
for each row execute function public.set_updated_at();

drop trigger if exists set_ai_jobs_updated_at on public.ai_jobs;
create trigger set_ai_jobs_updated_at
before update on public.ai_jobs
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.products enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.contents enable row level security;
alter table public.ai_jobs enable row level security;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Campaigns are selectable by owner" on public.campaigns;
create policy "Campaigns are selectable by owner"
on public.campaigns for select
using (auth.uid() = user_id);

drop policy if exists "Campaigns are insertable by owner" on public.campaigns;
create policy "Campaigns are insertable by owner"
on public.campaigns for insert
with check (auth.uid() = user_id);

drop policy if exists "Campaigns are updatable by owner" on public.campaigns;
create policy "Campaigns are updatable by owner"
on public.campaigns for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Campaigns are deletable by owner" on public.campaigns;
create policy "Campaigns are deletable by owner"
on public.campaigns for delete
using (auth.uid() = user_id);

drop policy if exists "Products are selectable by owner" on public.products;
create policy "Products are selectable by owner"
on public.products for select
using (auth.uid() = user_id);

drop policy if exists "Products are insertable by owner" on public.products;
create policy "Products are insertable by owner"
on public.products for insert
with check (auth.uid() = user_id);

drop policy if exists "Products are updatable by owner" on public.products;
create policy "Products are updatable by owner"
on public.products for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Products are deletable by owner" on public.products;
create policy "Products are deletable by owner"
on public.products for delete
using (auth.uid() = user_id);

drop policy if exists "Affiliate links are selectable by owner" on public.affiliate_links;
create policy "Affiliate links are selectable by owner"
on public.affiliate_links for select
using (auth.uid() = user_id);

drop policy if exists "Affiliate links are insertable by owner" on public.affiliate_links;
create policy "Affiliate links are insertable by owner"
on public.affiliate_links for insert
with check (auth.uid() = user_id);

drop policy if exists "Affiliate links are updatable by owner" on public.affiliate_links;
create policy "Affiliate links are updatable by owner"
on public.affiliate_links for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Affiliate links are deletable by owner" on public.affiliate_links;
create policy "Affiliate links are deletable by owner"
on public.affiliate_links for delete
using (auth.uid() = user_id);

drop policy if exists "Contents are selectable by owner" on public.contents;
create policy "Contents are selectable by owner"
on public.contents for select
using (auth.uid() = user_id);

drop policy if exists "Contents are insertable by owner" on public.contents;
create policy "Contents are insertable by owner"
on public.contents for insert
with check (auth.uid() = user_id);

drop policy if exists "Contents are updatable by owner" on public.contents;
create policy "Contents are updatable by owner"
on public.contents for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Contents are deletable by owner" on public.contents;
create policy "Contents are deletable by owner"
on public.contents for delete
using (auth.uid() = user_id);

drop policy if exists "AI jobs are selectable by owner" on public.ai_jobs;
create policy "AI jobs are selectable by owner"
on public.ai_jobs for select
using (auth.uid() = user_id);

drop policy if exists "AI jobs are insertable by owner" on public.ai_jobs;
create policy "AI jobs are insertable by owner"
on public.ai_jobs for insert
with check (auth.uid() = user_id);

drop policy if exists "AI jobs are updatable by owner" on public.ai_jobs;
create policy "AI jobs are updatable by owner"
on public.ai_jobs for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "AI jobs are deletable by owner" on public.ai_jobs;
create policy "AI jobs are deletable by owner"
on public.ai_jobs for delete
using (auth.uid() = user_id);
