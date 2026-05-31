# Nippon Toyota — Smart Incentive Calculator

## Tech Stack
- Next.js 16 (App Router)
- React 19
- Supabase (Postgres + Auth)
- shadcn/ui + Tailwind CSS
- React Three Fiber (3D Loader)

## Features
- Role-based access: Admin and Sales Officer
- Admin: manage car models and incentive slabs dynamically
- Officer: log monthly sales, real-time incentive breakdown
- Tiered slab calculation engine

## Local Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd nippon
```

### 2. Install Dependencies
Run the following command to install dependencies:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file by copying the example:
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in your actual Supabase credentials found in your Supabase project settings under **API**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### 4. Setup Database
1. Go to your [Supabase Dashboard](https://app.supabase.com/).
2. Select your project.
3. Open the **SQL Editor** from the left sidebar.
4. Copy the contents of `supabase/schema.sql` and run the query to set up your tables, triggers, and RLS policies.

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

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
