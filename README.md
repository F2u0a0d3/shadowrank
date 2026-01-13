# ShadowRank - The Real-Life RPG

> Turn your daily habits into epic quests. Level up IRL.

A gamified habit tracker with a dark "Solo Leveling/Cyberpunk" aesthetic. Users gain XP and climb Hunter Ranks (E to S) by completing real-world tasks like studying, exercising, and coding.

## Features

- **Hunter Rank System** - Progress from E-Rank to legendary S-Rank
- **Daily Quests** - Create custom habits with XP rewards
- **XP & Leveling** - Earn experience and level up
- **Live Leaderboards** - Compete with friends
- **Streak Tracking** - Build daily consistency
- **Dark Cyberpunk Theme** - Immersive purple/pink neon aesthetic

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| Deployment | Vercel |

## Local Development

### Prerequisites

- Node.js 18+
- npm
- Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/shadowrank.git
   cd shadowrank
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Set up the database**
   - Go to Supabase Dashboard > SQL Editor
   - Run the contents of `supabase-schema.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   Visit [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

## Project Structure

```
shadowrank/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Main quest board
│   ├── leaderboard/      # Rankings page
│   └── login/            # Authentication
├── components/           # React components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities (Supabase, XP calc)
└── types/                # TypeScript types
```

## Hunter Rank Progression

| Rank | Level Required | Color |
|------|---------------|-------|
| E | 1+ | Gray |
| D | 5+ | Green |
| C | 10+ | Blue |
| B | 20+ | Purple |
| A | 30+ | Orange |
| S | 50+ | Gold |

## License

MIT
