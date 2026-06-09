# Quick Start Guide: Connecting to Supabase

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free at https://supabase.com)

## Setup Steps (5 minutes)

### 1. **Create a Supabase Project**
   - Go to https://app.supabase.com
   - Click "New Project"
   - Fill in details:
     - Name: `African Aspirations`
     - Database password: Create a strong one (save it!)
     - Region: Choose closest to you
   - Wait for initialization (~2-3 min)

### 2. **Get Your API Keys**
   - In your Supabase project, click **Settings** → **API**
   - Copy these values:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
     ```

### 3. **Create Environment File**
   Create `.env.local` in your project root:
   ```bash
   cp .env.local.example .env.local
   ```
   Then paste your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
   ```

### 4. **Initialize Database Schema**
   - In Supabase, go to **SQL Editor**
   - Click **New Query**
   - Copy the entire `sql/schema_and_seed.sql` file
   - Paste it in the editor and click **Run**
   - ✅ Database is now ready!

### 5. **Start Your App**
   ```bash
   npm run dev
   ```
   Visit: http://localhost:3000

### 6. **Login with Seed Emails**
   Try logging in with:
   - **Admin**: `winston.best-ezeani@africanaspirations.com`
   - **User**: `demo@africanaspirations.com`

---

## What's Connected?

✅ **Database**: All deals now stored in Supabase
✅ **User Management**: Email approval via database
✅ **Admin Features**: Create/edit/delete deals
✅ **Security**: Row-level security policies enabled
✅ **Real-time**: Changes sync instantly

---

## Common Issues & Fixes

### ❌ "Connection refused" error
- Check that `.env.local` has your Supabase URL
- Make sure it starts with `https://`

### ❌ "Email not approved"
- Go to Supabase SQL Editor
- Run:
  ```sql
  INSERT INTO public.approved_emails (email, is_admin) 
  VALUES ('your-email@example.com', false);
  ```

### ❌ "Cannot add deals"
- Make sure your email has `is_admin = true`
- Check in Supabase: **Table Editor** → **approved_emails**

---

## Next Steps

1. **Add your team's emails** (Supabase > SQL Editor or Dashboard UI)
2. **Import your existing deals** (if any)
3. **Set up backups** (Supabase handles this automatically)
4. **Deploy to production** when ready

---

## Need Help?

See detailed setup in `SUPABASE_SETUP.md`

Happy coding! 🚀
