# Camora's Reef Rally

A colorful browser game starring Camora: a brilliant African American girl who mixes cheerleading energy with sea animal rescue.

## Local Run

```powershell
npm install
npm run dev
```

Open [http://127.0.0.1:4177](http://127.0.0.1:4177).

Local saves are stored in `data/profiles.json`.

## Vercel Deployment

This project is set up to deploy as:

- Static frontend from `public/`
- Serverless API routes in `api/`
- Persistent profile storage in Postgres (required in Vercel)

### Required Environment Variables

- `POSTGRES_URL` (from a Vercel Postgres/Marketplace integration)
- `SESSION_SECRET` (a long random secret for signing login tokens)

### Deploy Steps

1. Push this folder to a GitHub repository.
2. Import that repository into Vercel.
3. Add a Postgres integration to the Vercel project.
4. Set `SESSION_SECRET` in Vercel project environment variables.
5. Deploy.

## API Endpoints

- `POST /api/create`
- `POST /api/login`
- `POST /api/save`
- `GET /api/profile?reefCode=...`
- `GET /api/leaderboard`
