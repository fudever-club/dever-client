# DEVER Member Portal

The authenticated portal for FU-DEVER Club members. Members can manage their profile visibility, explore other public profiles, follow the LeetCode leaderboard, and contribute club content within the permissions granted by administrators.

## Related services

| Service | Repository | Production |
| --- | --- | --- |
| Landing page | [fu-dever-landingpage](https://github.com/fudever-club/fu-dever-landingpage) | [Open](https://fu-dever-landingpage-v2.vercel.app) |
| Member portal | [dever-client](https://github.com/fudever-club/dever-client) | [Open](https://dever-client-taupe.vercel.app/vi/sign-in) |
| Admin dashboard | [dever-admin](https://github.com/fudever-club/dever-admin) | [Open](https://dever-admin-lac.vercel.app/vi/sign-in) |
| Backend API | [dever-backend](https://github.com/fudever-club/dever-backend) | [Open](https://dever-backend-production.up.railway.app/health) |

## Key flows

- Sign in with an account provisioned by an administrator. Public self-registration is intentionally unavailable.
- Review and update personal information and choose which optional fields are public.
- Browse members through privacy-safe public profile links.
- View LeetCode activity and create authorised club blog content.

## Tech stack

Next.js 14 App Router, TypeScript, Ant Design, Redux Toolkit Query, and `next-intl` (Vietnamese and English).

## Run locally

Requires Node.js 20+ and a running DEVER backend.

```bash
npm ci
Copy-Item .env.example .env.local
npm run dev -- -p 3002
```

Set the following in `.env.local`:

```env
NEXT_PUBLIC_API_SERVER=http://localhost:5000
NEXT_PUBLIC_ASSETS_URL=http://localhost:5000/static
```

Open [http://localhost:3002/vi/sign-in](http://localhost:3002/vi/sign-in). Use the production API URL when deploying the portal.

## Quality checks

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Contributing

Do not expose sensitive member data in client-side routes or static fixtures. Profile links must use the opaque `profileKey` returned by the API, and all API failures should have a visible recovery state.
