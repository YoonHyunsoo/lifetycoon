-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Access policies for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for game saves
create table game_saves (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  
  -- Time State
  current_age integer default 17,
  current_month integer default 1, -- 1 to 12
  current_week integer default 0, -- 0 to 3
  
  -- Stats
  intelligence integer default 0,
  stamina integer default 0,
  sense integer default 0,
  luck integer default 0,
  
  -- Status
  stress integer default 0,
  reputation integer default 0,
  
  -- Assets
  cash bigint default 0,
  stock_value bigint default 0,
  
  -- Career & Life
  job_title text default '고등학생',
  job_level text, -- C, B, A, S etc
  is_student boolean default true,
  
  last_saved_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Policies for game_saves
alter table game_saves enable row level security;

create policy "Users can view their own saves." on game_saves
  for select using (auth.uid() = user_id);

create policy "Users can insert their own saves." on game_saves
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own saves." on game_saves
  for update using (auth.uid() = user_id);

-- Create a table for the leaderboard
create table hall_of_wealth (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  username text not null,
  total_assets bigint not null,
  ended_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Policies for hall_of_wealth
alter table hall_of_wealth enable row level security;

create policy "Leaderboard is viewable by everyone." on hall_of_wealth
  for select using (true);

create policy "System can insert leaderboard entries." on hall_of_wealth
  for insert with check (auth.uid() = user_id);
