# Prowider Mini Lead Distribution System

Backend-heavy Next.js (App Router) application focused on deterministic lead allocation, concurrency safety, and database consistency.

## Setup Instructions

# Prowider Mini — Lead Distribution System

Professional, backend-focused demonstration of deterministic lead distribution.

This repository implements a small-but-complete system that receives incoming
leads and assigns each lead to providers according to mandatory rules and a
persistent round-robin allocator, while enforcing provider quotas and
preserving correctness under concurrent load.

## Quick highlights

- Deterministic assignment rules and service-specific pools
- Persistent round-robin state to ensure fair allocations across restarts
- Atomic, transactional assignments with retry-on-conflict
- Webhook idempotency for safe external event processing

## Tech stack

- Next.js (App Router) — server and API routes
- TypeScript
- Prisma ORM + PostgreSQL
- Minimal client pages for testing and visualization

## Important files

- `prisma/schema.prisma` — database schema
- `prisma/seed.ts` — seed script: services + providers + initial state
- `lib/leadDistributor.ts` — core allocation/transaction logic
- `lib/prisma.ts` — Prisma client singleton
- `app/api/leads/route.ts` — public lead creation endpoint
- `app/api/webhook/reset-quota/route.ts` — idempotent quota reset webhook
- `app/dashboard`, `app/request-service`, `app/test-tools` — UI pages

## Setup (local)

1. Prerequisites
	 - Node 18+ (Node 20 recommended) and npm
	 - PostgreSQL database (local or hosted)

2. Install

```bash
npm install
```

3. Configure environment

Create a `.env` at the project root with:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public"
```

4. Migrate, generate client, and seed

```bash
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
```

5. Start dev server

```bash
npm run dev
```

## Allocation algorithm (concise)

1. Insert a `Lead` within a database transaction.
2. Reserve quota for mandatory providers for the chosen service.
3. Compute remaining slots and iterate the fair pool starting from the
	 stored round-robin pointer until enough available providers are found.
4. Atomically decrement quotas and create `LeadAssignment` rows.
5. Persist the updated round-robin pointer.

This flow guarantees deterministic assignments, prevents duplicate
assignments, and respects provider quotas.

## Concurrency & reliability

- Allocation runs inside interactive transactions; conditional updates
	ensure a provider's quota never goes below zero.
- Transactions are retried on write conflicts / deadlocks with a bounded
	backoff to handle bursts of concurrent requests.
- The system persists round-robin pointers so fairness is preserved across
	restarts.

## Webhook idempotency

- The reset webhook records an `eventId` in `WebhookEvent` and checks for
	existence before applying resets. Replayed events are detected and ignored.

## API reference

- `POST /api/leads` — create a lead. Body: `{ name, phoneNumber, city, serviceId, description? }`.
- `GET /api/dashboard` — provider state with assignments.
- `POST /api/webhook/reset-quota` — body: `{ eventId }`.

## Local testing

- UI pages:
	- `/request-service` — create leads
	- `/dashboard` — watch quota and assignments
	- `/test-tools` — reset quota, test idempotency, and fire concurrent lead bursts


## Extensions & next steps

- Add telemetry/metrics for contention and assignment latency.
- Add role-based authentication and audit trails for production usage.

---
Built by Sarthak Bahal — May 2026
GitHub: github.com/sarthakbahal
