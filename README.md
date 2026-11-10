# CodeMind AI — Phase 1 Starter

Telegram-first AI coding SaaS foundation. This phase includes a responsive dashboard, Telegram Mini App authentication verification, signed sessions, Neon PostgreSQL connection, initial database migration, and a health endpoint.

## What is included
- Next.js App Router + TypeScript
- Mobile-first CodeMind AI dashboard
- Telegram `initData` HMAC verification (server-side)
- HttpOnly signed session cookie
- Neon PostgreSQL pool
- Initial schema for users, credits, projects, conversations, tasks and approvals
- One centralized catch-all API route (`app/api/[...path]/route.ts`) for all endpoints, including `/api/health` and `/api/auth/telegram`

## Important scope
This is the Phase 1 foundation, not the complete SaaS. GitHub OAuth, AI provider routing, credit billing, code-diff generation, payment integration, admin controls and deployment approvals are subsequent phases. No arbitrary code execution is included.

## Requirements
- Node.js 20+
- Neon PostgreSQL database
- Telegram bot created with BotFather
- Vercel account

## Local setup
1. Extract this ZIP.
2. Copy `.env.example` to `.env.local`.
3. Fill `DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `SESSION_SECRET`, and `NEXT_PUBLIC_APP_URL`.
4. In Neon SQL Editor, run `database/migrations/001_initial.sql`.
5. Run:
   ```bash
   npm install
   npm run dev
   ```
6. Open `http://localhost:3000`.

Generate a session secret with:
```bash
openssl rand -base64 48
```

## Vercel deployment
1. Upload/push the project to your GitHub repository.
2. Import the repository in Vercel.
3. Add the environment variables from `.env.example` in Vercel Project Settings.
4. Deploy.
5. Check `https://YOUR-DOMAIN/api/health`.

## Telegram Mini App
Configure the bot's Menu Button / Mini App URL in BotFather to point to the deployed HTTPS URL. Authentication only succeeds when opened inside Telegram with valid `initData`.

## Security notes
- Never put bot tokens, database URLs, GitHub secrets, session secrets or AI API keys in client-side variables.
- Never commit `.env.local`.
- Telegram initData is verified on the server; do not trust a user object sent separately by the browser.
- The included initial migration grants 100 starter credits at account creation. Before public launch, add abuse controls and decide the final free-plan allowance.
- GitHub OAuth must use least-privilege permissions and encrypted tokens.
- Credit balance changes must be implemented transactionally with idempotency keys before charging users.

## Next phases
1. GitHub OAuth + repository browser
2. AI gateway + personal encrypted API keys
3. Agent task engine + code diff preview
4. Approval-gated commits and pull requests
5. Subscription, credit purchases and payment webhooks
6. Admin dashboard, monitoring and production hardening
