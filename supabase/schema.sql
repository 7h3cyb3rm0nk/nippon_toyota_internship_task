create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('admin', 'sales_officer'))
);

create table car_models (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  base_suffix text,
  variant text,
  created_at timestamptz default now()
);

create table slab_config (
  id uuid primary key default gen_random_uuid(),
  min_cars int not null,
  max_cars int,
  incentive_per_car numeric not null,
  created_at timestamptz default now()
);

create table sales_logs (
  id uuid primary key default gen_random_uuid(),
  officer_id uuid references profiles(id) on delete cascade,
  model_id uuid references car_models(id) on delete cascade,
  month int not null check (month between 1 and 12),
  year int not null,
  quantity_sold int not null default 0,
  created_at timestamptz default now(),
  unique(officer_id, model_id, month, year)
);

-- RLS
alter table sales_logs enable row level security;
alter table car_models enable row level security;
alter table slab_config enable row level security;
alter table profiles enable row level security;

create policy "officer select" on sales_logs
  for select to authenticated
  using ((select auth.uid()) = officer_id);

create policy "officer insert" on sales_logs
  for insert to authenticated
  with check ((select auth.uid()) = officer_id);

create policy "officer update" on sales_logs
  for update to authenticated
  using ((select auth.uid()) = officer_id)
  with check ((select auth.uid()) = officer_id);

create policy "own profile" on profiles
  for select to authenticated
  using (id = (select auth.uid()));

create policy "authenticated read cars" on car_models
  for select to authenticated using (true);

create policy "authenticated read slabs" on slab_config
  for select to authenticated using (true);

create policy "admin write cars" on car_models
  for all to authenticated
  using ((select role from profiles where id = (select auth.uid())) = 'admin');

create policy "admin write slabs" on slab_config
  for all to authenticated
  using ((select role from profiles where id = (select auth.uid())) = 'admin');
