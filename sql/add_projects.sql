-- Add 7 Brokerage projects
-- Run in Supabase SQL Editor

alter table public.deals add column if not exists created_at timestamptz not null default now();

insert into public.deals (entity, code_name, service, about, industry, size, created_at) values
('Yehans International',        'Project Flower',  'Brokerage', 'Commercial Land in Kumasi',                          'Land & Property',                 3000000, now()),
('Ahodwo Clinic',               'Project Care',    'Brokerage', 'Medical clinic Facility in Kumasi',                  'Healthcare & Life Sciences',      2000000, now()),
('The Palms Hotel',             'Project Coco',    'Brokerage', 'Hotel in Prampram',                                  'Hospitality, Food & Beverage',    1000000, now()),
('Ellen''s House',              'Project House',   'Brokerage', 'Single story building in Jamestown',                 'Commercial Real Estate',          750000,  now()),
('Premier Dry Cleaners LTD',    'Project Dry',     'Brokerage', 'Laundry & Dry Cleaning Services (Business Only)',    'Security & Services',             75000,   now()),
('Haven Susu Enterprise',       'Project Susu',    'Brokerage', 'Tiers 4 Microfinance',                               'Financial Services & FinTech',    69000,   now()),
('Murraydeen',                  'Project Legacy',  'Brokerage', 'School in Sierra leone',                             'Education & Training',            null,    now());
