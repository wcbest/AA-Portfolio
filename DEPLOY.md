# Deploy instructions

1) Push SQL schema and seed to Supabase

- Open the Supabase project -> SQL Editor and run the file `sql/schema_and_seed.sql`.
- Replace `REPLACE_WITH_YOUR_EMAIL` in the `approved_emails` seed with your real admin email before running.

2) Create a storage bucket

- In Supabase Dashboard -> Storage create a bucket named `deal-teasers`.
- Set public access to false. Use signed URLs to serve PDFs to users.

3) Configure RLS and policies

- The `schema_and_seed.sql` file enables RLS and includes policies that check `auth.email()` against `approved_emails`.

4) Environment variables (Vercel)

- In Vercel dashboard -> Project -> Settings -> Environment Variables, add:

  - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key
  - `SUPABASE_SERVICE_ROLE_KEY` = service role key (server-only, do NOT expose to client)

5) Connect to GitHub & deploy

- Push this repository to GitHub and connect the repo in Vercel.
- Set the root directory if needed (this repo root).
- Vercel will detect Next.js and deploy automatically.

6) Smoke test checklist

- Visit the deployed URL.
- Sign in with an approved email (the seeded admin email).
- Verify you can view deals and, if admin, manage deals and approved emails.
