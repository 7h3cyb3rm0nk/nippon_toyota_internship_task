# Nippon Toyota — Smart Incentive Calculator

Live: https://your-vercel-url.vercel.app

## Tech Stack
- Next.js 14 (App Router)
- Supabase (Postgres + Auth)
- shadcn/ui + Tailwind CSS
- Deployed on Vercel

## Features
- Role-based access: Admin and Sales Officer
- Admin: manage car models and incentive slabs dynamically
- Officer: log monthly sales, real-time incentive breakdown
- Tiered slab calculation engine

## Local Setup
1. Clone repo
2. `npm install`
3. Copy `.env.example` → `.env.local`, fill Supabase keys
4. Run `supabase/schema.sql` in Supabase SQL editor
5. Create test users in Supabase Auth dashboard
6. Insert user IDs into `profiles` table with roles
7. `npm run dev`

## Environment Variables
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |

## Test Accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@test.com | Test1234! |
| Officer | officer@test.com | Test1234! |
