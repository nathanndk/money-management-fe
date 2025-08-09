Install & Run

npm install
npm dev   # http://localhost:3000

Build

npm build && npm start

Accounts

Demo: demo@local.test / demo1234

Register: /register (dev-only in-memory)

Guest: Navbar → Continue as Guest

Overview API (Money Manager)

GET /api/overview → mock cards

POST /api/overview with { transactions, currency } → computed 5 cards + advice

ICP + Fetch.ai

Env vars in .env.example. If missing: routes use dummy fallbacks.

ICP greet: POST /api/icp/greet { name }

Agentverse search: GET /api/fetchai/search?q=...&limit=5

Notes / Hardening

Replace in-memory auth with DB (Prisma + SQLite/Postgres)

Persist transactions server-side; add budgets & FX

Add rate limiting & better error UX for integrations