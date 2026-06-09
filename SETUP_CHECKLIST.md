# 🚀 Supabase Setup Checklist

Complete these steps to get your African Aspirations Dashboard fully connected to Supabase.

## Phase 1: Create Supabase Project (5 mins)

- [ ] Go to https://app.supabase.com
- [ ] Click "New Project"
- [ ] Enter project name: `African Aspirations`
- [ ] Set database password (save it somewhere safe!)
- [ ] Choose region closest to you
- [ ] Click "Create new project"
- [ ] Wait for initialization (2-3 minutes)

## Phase 2: Get API Credentials (2 mins)

- [ ] In your Supabase project, go to **Settings** → **API**
- [ ] Copy your **Project URL** (starts with `https://`)
- [ ] Copy your **Anon (public) key** (starts with `eyJ...`)

## Phase 3: Configure Environment (2 mins)

- [ ] In your project root, create `.env.local` by copying `.env.local.example`:
  ```bash
  cp .env.local.example .env.local
  ```
- [ ] Open `.env.local` in your editor
- [ ] Paste your Supabase URL:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  ```
- [ ] Paste your Anon Key:
  ```
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
  ```
- [ ] Save the file

## Phase 4: Initialize Database Schema (5 mins)

- [ ] In your Supabase project, click **SQL Editor** in left sidebar
- [ ] Click **New Query**
- [ ] Open `sql/schema_and_seed.sql` from your project folder
- [ ] Copy the **entire** SQL content
- [ ] Paste it into the Supabase SQL editor
- [ ] Click the blue **Run** button
- [ ] Wait for it to complete (you should see "Success")

✅ Your database is now initialized!

## Phase 5: Test the Connection (5 mins)

- [ ] In your terminal, run:
  ```bash
  npm run dev
  ```
- [ ] Open browser to http://localhost:3000
- [ ] Try logging in with admin email:
  ```
  winston.best-ezeani@africanaspirations.com
  ```
- [ ] If you see the dashboard, congratulations! 🎉

## Phase 6: Add Your Email (Optional, 2 mins)

If you want to add your own email as admin:

**Option A: Via SQL (faster)**
- [ ] Go back to Supabase SQL Editor
- [ ] Click **New Query**
- [ ] Run this SQL:
  ```sql
  INSERT INTO public.approved_emails (email, is_admin) 
  VALUES ('your-email@example.com', true)
  ON CONFLICT (email) DO UPDATE SET is_admin = true;
  ```
- [ ] Refresh the dashboard and log in with your email

**Option B: Via Dashboard UI**
- [ ] Log in as admin with `winston.best-ezeani@africanaspirations.com`
- [ ] Scroll down to "Create regular user" section
- [ ] Enter your email and click "Add"
- [ ] Then manually set `is_admin = true` in Supabase

## Phase 7: Verify Everything Works (5 mins)

- [ ] Log in to dashboard
- [ ] Try adding a new deal
- [ ] Try editing a deal
- [ ] Try deleting a deal (admins only)
- [ ] Log out and log back in
- [ ] Check that your data persisted

## Troubleshooting

### ❌ "Connection refused" or connection errors
**Solution**: Check your `.env.local` file
- [ ] Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly
- [ ] Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly
- [ ] Make sure there are no extra spaces or quotes
- [ ] Stop dev server and restart: `npm run dev`

### ❌ "Email not approved" error
**Solution**: Add email to Supabase
- [ ] Go to Supabase Dashboard
- [ ] Click **Table Editor**
- [ ] Select **approved_emails** table
- [ ] Click **Insert** and add your email
- [ ] Set `is_admin` to true if you need admin access

### ❌ "Cannot add/edit/delete deals"
**Solution**: Check admin status
- [ ] Go to Supabase **Table Editor**
- [ ] Select **approved_emails**
- [ ] Find your email and check if `is_admin = true`
- [ ] If not, click the row and edit to set `is_admin = true`

### ❌ "Database schema doesn't exist" errors
**Solution**: Run the SQL schema
- [ ] Go to Supabase **SQL Editor**
- [ ] Click **New Query**
- [ ] Paste content from `sql/schema_and_seed.sql`
- [ ] Click **Run**
- [ ] Refresh your dashboard

### ❌ Deals don't appear or keep disappearing
**Solution**: Check browser console
- [ ] Open browser DevTools (F12)
- [ ] Click **Console** tab
- [ ] Look for red error messages
- [ ] Share the error message if stuck

## Need Help?

📖 **Detailed guides**:
- `SUPABASE_SETUP.md` — Full setup documentation
- `QUICKSTART.md` — Quick 5-minute guide
- `SUPABASE_INTEGRATION.md` — Integration overview

## What's Connected?

✅ **Deals table** — All 51 deals from your database
✅ **User authentication** — Email-based access control  
✅ **Admin controls** — Create/edit/delete operations
✅ **User management** — Add approved emails
✅ **Data persistence** — Everything saved to Supabase
✅ **Real-time updates** — Changes sync immediately
✅ **Security** — Row-level security policies active

## After Setup

1. **Add your team** — Use admin UI to add email addresses
2. **Import more data** — Add deals via the dashboard
3. **Monitor activity** — Check Supabase for data changes
4. **Regular backups** — Supabase handles this automatically
5. **When ready** — Deploy to production (Vercel, etc.)

---

**Status**: Ready to set up!
**Time estimate**: 30 minutes total
**Difficulty**: Easy ✅

Good luck! 🚀
