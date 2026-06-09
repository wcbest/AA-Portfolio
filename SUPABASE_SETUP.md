# Supabase Setup Guide

This guide will help you connect your African Aspirations Dashboard to Supabase.

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in with your account
3. Click "New project"
4. Fill in:
   - **Project name**: African Aspirations
   - **Database password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to you
5. Click "Create new project" and wait for it to initialize (2-3 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project, click **Settings** in the left sidebar
2. Click **API** 
3. Copy the following values:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon (public) key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Set Up Your Environment

1. In your project root, copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and paste your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Save the file

## Step 4: Initialize the Database Schema

1. In Supabase, go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file `sql/schema_and_seed.sql` from your project
4. Copy the entire SQL content
5. Paste it into the Supabase SQL editor
6. Click **Run** (make sure to use the blue Run button)

This will create:
- `approved_emails` table (for user access control)
- `deals` table (for all pipeline deals)
- Row-level security policies
- Seed data with admin users and all 51 deals

## Step 5: Add Approved Emails

You can add more approved emails via:

### Option A: SQL (Admin Access)
Go to SQL Editor and run:
```sql
insert into public.approved_emails (email, is_admin) values
('your-email@example.com', false),
('admin-email@example.com', true)
on conflict (email) do nothing;
```

### Option B: Through the Dashboard UI (if you're already an admin)
1. Start your dev server: `npm run dev`
2. Log in with an approved admin email
3. Use the "Create regular user" form to add new approved emails

## Step 6: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Try logging in with one of the approved emails:
   - `winston.best-ezeani@africanaspirations.com` (admin)
   - `demo@africanaspirations.com` (regular user)

4. If you see the dashboard, congratulations! Supabase is connected.

## Troubleshooting

### "Error: Failed to initialize Supabase"
- Check that your `.env.local` file has the correct credentials
- Make sure `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
- Verify the Anon Key is correct (not the Service Role Key)

### "Email not approved"
- Make sure the email is in the `approved_emails` table
- Check the email is spelled correctly (case-insensitive but must match)

### "Database schema doesn't exist"
- Go back to Step 4 and run the SQL schema in Supabase SQL Editor
- Make sure you clicked the blue **Run** button

### Cannot edit/add deals
- Make sure your email has `is_admin = true` in the `approved_emails` table
- Refresh the page after making changes

## Database Schema

### approved_emails
- `id` (bigint): Primary key
- `email` (text): User email address (unique)
- `is_admin` (boolean): Whether user can edit/add/delete deals
- `created_at` (timestamptz): When email was approved

### deals
- `id` (bigint): Primary key
- `entity` (text): Company/project name
- `code_name` (text): Internal project code name
- `category` (text): Funding / Consulting / Brokerage
- `description` (text): Deal description
- `size` (numeric): Deal size in currency
- `deliverables` (text): What's being delivered
- `status` (text): Active / Closed / On Hold
- `created_at` (timestamptz): When deal was created
- `updated_at` (timestamptz): When deal was last updated

## Security Features

✅ **Row-Level Security (RLS)** enabled on all tables
✅ **Email-based access control**: Only approved emails can access deals
✅ **Admin roles**: Only admins can create/edit/delete deals
✅ **Audit trail**: All changes tracked with timestamps

## Next Steps

- Monitor your dashboard for activity
- Add more deals through the admin UI
- Invite team members by adding their emails to approved_emails
- Regular backups are automatic on Supabase (free tier included)
