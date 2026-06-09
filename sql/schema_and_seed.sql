-- Supabase schema for African Aspirations
-- Run this in the Supabase SQL editor. Requires a service role key for admin inserts.

-- Create approved_emails table
create table if not exists public.approved_emails (
  id bigserial primary key,
  email text not null unique,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Create deals table
create table if not exists public.deals (
  id bigint primary key,
  entity text not null,
  code_name text,
  category text,
  description text,
  size numeric,
  deliverables text,
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_updated_at on public.deals;
create trigger trg_set_updated_at
before update on public.deals
for each row execute function public.set_updated_at();

-- RLS: enable row-level security
alter table public.approved_emails enable row level security;
alter table public.deals enable row level security;

-- Policy: allow insert/select/update for authenticated users only if their email is in approved_emails
-- Note: Supabase exposes auth.uid() and auth.email() in policies

-- approved_emails policies: Only service_role (owner) can insert via SQL; users cannot insert themselves as admins.
create policy "select_approved_emails_for_auth" on public.approved_emails
  for select using (
    auth.role() = 'anon' or true
  );

create policy "insert_approved_emails_service_role" on public.approved_emails
  for insert with check (auth.role() = 'service_role');

-- deals policies: allow select if user's email is in approved_emails
create policy "select_deals_if_approved" on public.deals
  for select using (
    exists (select 1 from public.approved_emails ae where ae.email = auth.email())
  );

-- allow updates for admins only (based on approved_emails.is_admin)
create policy "update_deals_admins_only" on public.deals
  for update using (
    exists (select 1 from public.approved_emails ae where ae.email = auth.email() and ae.is_admin = true)
  );

-- allow inserts only for admins (service role or admin users)
create policy "insert_deals_admins_only" on public.deals
  for insert with check (
    exists (select 1 from public.approved_emails ae where ae.email = auth.email() and ae.is_admin = true)
  );

-- Seed data: approved emails
insert into public.approved_emails (email, is_admin) values
('winston.best-ezeani@africanaspirations.com', true),
('admin@africanaspirations.com', true),
('demo@africanaspirations.com', false),
('investor@africanaspirations.com', false)
on conflict (email) do nothing;

-- Seed deals
-- We'll insert the 51 deals with their id values matching the source
insert into public.deals (id, entity, code_name, category, description, size, deliverables, status)
values
(1, 'Mava Consulting', 'Project Map', 'Funding', 'Master Phase for Ocean Community', 21000000, 'Investor Readiness, Funding', 'Active'),
(2, 'Best Life Clinic', 'Project Bold', 'Consulting', 'Diagnostic and Herbal Clinic', 30000, 'Financial Structuring, Investor Readiness', 'Active'),
(3, 'Project Theresa', 'Project Atlas', 'Funding', 'Fuel Station', 200000, 'Investor Readiness, Funding', 'Active'),
(4, 'Danpong Hospital', 'Project Dan', 'Consulting', 'Healthcare facility', null, 'Valuation, Funding', 'Active'),
(5, 'Innovare', 'Project Inn', 'Funding', 'IT Systems Company', null, 'Valuation', 'Active'),
(6, 'Oya Ghana', 'Project Oak', 'Funding', 'Intercity Bus Digitilisation project', 70000, 'Investor Readiness, Funding', 'Active'),
(7, 'Asa Global Energy Solutions', 'Project Globe', 'Funding', 'Petroleum Importation and distribution', 500000000, 'Valuation, Funding', 'Active'),
(8, 'Ahafo Pride LTD', 'Project Ahab', 'Funding', 'Agribusiness', 5000000, 'Investor Readiness, Funding', 'Active'),
(9, 'AgriOne Africa', 'Project Agric', 'Funding', 'AgriTech', 350000, 'Investor Readiness, Funding', 'Active'),
(10, 'Equity Savings and Loans', 'Project Equestrian', 'Consulting', 'Microfinance', 20000000, 'Valuation, Funding', 'Active'),
(11, 'Tilly''s Farm', 'Project Tiles', 'Funding', 'Agribusiness', 1000000, 'Valuation, Funding', 'Active'),
(12, 'Central Oil Mills Ltd', 'Project Center', 'Brokerage', 'Oil Production', null, 'Valuation', 'Active'),
(13, 'Harriben Granite Ltd', 'Project Happy', 'Consulting', 'Granite Extraction', 10000000, 'Investor Readiness, Funding', 'Active'),
(14, 'Merbarproperties', 'Project Marble', 'Funding', 'Property Development', 4500000, 'Funding', 'Active'),
(15, 'Cups and Cones', 'Project Cane', 'Brokerage', 'Food Business', null, 'Valuation and Funding', 'Active'),
(16, 'Indulge', 'Project Instagram', 'Brokerage', 'Hospitality & Food Services', 1700000, 'Funding', 'Active'),
(17, 'Kazkazini', 'Project KANDA', 'Brokerage', 'Agriculture & Agro-Processing', 3720000, 'Funding', 'Active'),
(18, 'Manet', 'Project Merchant', 'Brokerage', 'Real Estate', 30000000, 'Funding', 'Active'),
(19, 'Kings Palace School', 'Project KINGS', 'Brokerage', 'Education', 1200000, 'Funding', 'Active'),
(20, 'D''Avenue', 'Project Dominion', 'Brokerage', 'Hospitality & Food Services', 6200000, 'Funding', 'Active'),
(21, 'GreenGold', 'Project Green', 'Brokerage', 'Agriculture & Agro-Processing', 40000, 'Funding', 'Active'),
(22, 'Land Sale - Yaw Owusu Ansah', 'Project Answer', 'Brokerage', 'Real Estate', null, 'Funding', 'Active'),
(23, 'Tans Hostel', 'Project Tulip', 'Brokerage', 'Hospitality & Food Services', 5000000, 'Funding', 'Active'),
(24, 'Modern Properties - Land Sale', 'Project Modern', 'Brokerage', 'Real Estate', 3000000, 'Funding', 'Active'),
(25, 'Ederick - Emerge', 'Project Emerge', 'Brokerage', 'Trade, Manufacturing & Retail', 5000000, 'Funding', 'Active'),
(26, 'World-beater Security Services', 'Project Wife', 'Brokerage', 'Security & Services', null, 'Funding', 'Active'),
(27, 'Land - Grace Asare', 'Project Good', 'Brokerage', 'Real Estate', null, 'Funding', 'Active'),
(28, 'Land - Kuorkor Dzani', 'Project Kooks', 'Brokerage', 'Real Estate', 160000, 'Funding', 'Active'),
(29, 'Apartment (Solaris) - Kuorkor Dzani', 'Project Sol', 'Brokerage', 'Real Estate', 160000, 'Funding', 'Active'),
(30, 'Lot30 Bistro & Bar', 'Project Barn', 'Brokerage', 'Hospitality & Food Services', 374000, 'Funding', 'Active'),
(31, 'Dan''s Paradise Hotel', 'Project Pond', 'Brokerage', 'Hospitality & Food Services', 2000000, 'Funding', 'Active'),
(32, 'AH Nissi Company Ltd', 'Project Nice', 'Brokerage', 'Real Estate', 192000, 'Funding', 'Active'),
(33, 'ESBEE', 'Project Bee', 'Brokerage', 'Trade, Manufacturing & Retail', 3000000, 'Funding', 'Active'),
(34, 'Magdavis Catering Services', 'Project Carter', 'Brokerage', 'Hospitality & Food Services', 500000, 'Funding', 'Active'),
(35, 'Agnes Bakery', 'Project Sweet', 'Brokerage', 'Hospitality & Food Services', 250000, 'Funding', 'Active'),
(36, 'Royal Palm City', 'Project Palm', 'Brokerage', 'Real Estate', 5000000, 'Funding', 'Active'),
(37, 'ULTIMATE HOTEL', 'Project United', 'Brokerage', 'Hospitality & Food Services', 2500000, 'Funding', 'Active'),
(38, 'Colonel Takye', 'Project MULTI', 'Brokerage', 'Real Estate', 2200000, 'Funding', 'Active'),
(39, 'Scenic Restaurant', 'Project Starz', 'Brokerage', 'Hospitality & Food Services', 876000, 'Funding', 'Active'),
(40, 'UFO BURGER', 'Project Space', 'Brokerage', 'Hospitality & Food Services', 100000, 'Funding', 'Active'),
(41, 'Marvello Gastro Lounge', 'Project Marvel', 'Brokerage', 'Hospitality & Food Services', 1000000, 'Funding', 'Active'),
(42, 'Le Pavillon', 'Project French', 'Brokerage', 'Hospitality & Food Services', 4000000, 'Funding', 'Active'),
(43, 'Office Complex', 'Project Happy II', 'Brokerage', 'Real Estate', 1800000, 'Funding', 'Active'),
(44, 'Land', 'Project Earth', 'Brokerage', 'Real Estate', 76000, 'Funding', 'Active'),
(45, 'Eldora Royal Farms', 'Project Crown', 'Agriculture & Agro-Processing', 'Agriculture & Agro-Processing', 233000, 'Funding', 'Active'),
(46, 'DF Poultry', 'Project Pot', 'Agriculture & Agro-Processing', 'Agriculture & Agro-Processing', 700000, 'Funding', 'Active'),
(47, 'Enart Farms and Consult', 'Project Moon', 'Agriculture & Agro-Processing', 'Agriculture & Agro-Processing', 860000, 'Funding', 'Active'),
(48, 'CHARLESTON Hotel', 'Project Yellow', 'Brokerage', 'Hospitality & Food Services', 4000000, 'Funding', 'Active'),
(49, 'Poultry Tech', 'Projet PT', 'Agriculture & Agro-Processing', 'Agriculture & Agro-Processing', 70000, 'Funding', 'Active'),
(50, 'Onlime Africa Limited', 'Project SL', 'Brokerage', 'Financial Services', 2250000, 'Funding', 'Active'),
(51, 'Project Velvet', 'Project Velvet', 'Brokerage', 'Hospitality & Food Services', null, 'Valuation and Funding', 'Active')
on conflict (id) do nothing;

-- Storage: create a bucket named deal-teasers and restrict public access
-- (Run in Supabase Storage UI or via API)
-- Policies: restrict read to authenticated approved emails (via signed URLs or RLS on metadata table)
