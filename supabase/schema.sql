-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text,
  avatar_url text,
  role text default 'user'::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRIPS TABLE
create table public.trips (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  destination text not null,
  start_date date not null,
  end_date date not null,
  total_budget numeric(10, 2),
  trip_type text,
  cover_image text,
  visibility text default 'private'::text, -- private or public
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRIP STOPS TABLE
create table public.trip_stops (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  city text not null,
  country text not null,
  arrival_date date not null,
  departure_date date not null,
  order_index integer not null
);

-- ACTIVITIES TABLE
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  stop_id uuid references public.trip_stops(id) on delete cascade not null,
  title text not null,
  description text,
  category text,
  cost numeric(10, 2) default 0,
  duration integer, -- in minutes
  location text,
  image_url text,
  rating numeric(2, 1)
);

-- PACKING ITEMS TABLE
create table public.packing_items (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  item_name text not null,
  category text,
  packed boolean default false
);

-- TRIP NOTES TABLE
create table public.trip_notes (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRIP COLLABORATORS TABLE
create table public.trip_collaborators (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  permission text default 'view'::text -- view or edit
);

-- BUDGET BREAKDOWN TABLE
create table public.budget_breakdown (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  category text not null,
  amount numeric(10, 2) not null
);

-- COMMUNITY POSTS TABLE
create table public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  trip_id uuid references public.trips(id) on delete cascade not null,
  content text not null,
  likes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.trips enable row level security;
alter table public.trip_stops enable row level security;
alter table public.activities enable row level security;
alter table public.packing_items enable row level security;
alter table public.trip_notes enable row level security;
alter table public.trip_collaborators enable row level security;
alter table public.budget_breakdown enable row level security;
alter table public.community_posts enable row level security;

-- Policies

-- Users
create policy "Users can view their own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);

-- Trips
create policy "Users can view their own trips" on public.trips for select using (auth.uid() = user_id or visibility = 'public' or id in (select trip_id from public.trip_collaborators where user_id = auth.uid()));
create policy "Users can insert their own trips" on public.trips for insert with check (auth.uid() = user_id);
create policy "Users can update their own trips" on public.trips for update using (auth.uid() = user_id or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit'));
create policy "Users can delete their own trips" on public.trips for delete using (auth.uid() = user_id);

-- Other tables generally follow the trip access
create policy "Users can view stops for their trips" on public.trip_stops for select using (trip_id in (select id from public.trips));
create policy "Users can insert stops for their trips" on public.trip_stops for insert with check (trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit')));
create policy "Users can update stops for their trips" on public.trip_stops for update using (trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit')));
create policy "Users can delete stops for their trips" on public.trip_stops for delete using (trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit')));

-- Activities
create policy "Users can view activities" on public.activities for select using (stop_id in (select id from public.trip_stops));
create policy "Users can insert activities" on public.activities for insert with check (stop_id in (select id from public.trip_stops where trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit'))));
create policy "Users can update activities" on public.activities for update using (stop_id in (select id from public.trip_stops where trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit'))));
create policy "Users can delete activities" on public.activities for delete using (stop_id in (select id from public.trip_stops where trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit'))));

-- Packing Items
create policy "Users can view packing items" on public.packing_items for select using (trip_id in (select id from public.trips));
create policy "Users can insert packing items" on public.packing_items for insert with check (trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit')));
create policy "Users can update packing items" on public.packing_items for update using (trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit')));
create policy "Users can delete packing items" on public.packing_items for delete using (trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit')));

-- Trip Notes
create policy "Users can view notes" on public.trip_notes for select using (trip_id in (select id from public.trips));
create policy "Users can insert notes" on public.trip_notes for insert with check (trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit')));
create policy "Users can update notes" on public.trip_notes for update using (trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit')));
create policy "Users can delete notes" on public.trip_notes for delete using (trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit')));

-- Budget Breakdown
create policy "Users can view budget" on public.budget_breakdown for select using (trip_id in (select id from public.trips));
create policy "Users can insert budget" on public.budget_breakdown for insert with check (trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit')));
create policy "Users can update budget" on public.budget_breakdown for update using (trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit')));
create policy "Users can delete budget" on public.budget_breakdown for delete using (trip_id in (select id from public.trips where user_id = auth.uid() or id in (select trip_id from public.trip_collaborators where user_id = auth.uid() and permission = 'edit')));

-- Community Posts
create policy "Anyone can view community posts" on public.community_posts for select using (true);
create policy "Users can insert community posts" on public.community_posts for insert with check (auth.uid() = user_id);
create policy "Users can update own posts" on public.community_posts for update using (auth.uid() = user_id);
create policy "Users can delete own posts" on public.community_posts for delete using (auth.uid() = user_id);

-- Trigger to create a user in public.users when a new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
