# Prowider Mini Lead Distribution System

Backend-heavy Next.js (App Router) application focused on deterministic lead allocation, concurrency safety, and database consistency.

## Setup Instructions

1. Install dependencies
	- `npm install`

2. Create and configure `.env`
	- Set `DATABASE_URL` to your PostgreSQL connection string.

3. Run database migrations
	- `npm run prisma:migrate`

4. Generate Prisma client
	- `npm run prisma:generate`

5. Seed baseline data
	- `npm run prisma:seed`

6. Start the dev server
	- `npm run dev`

## Allocation Algorithm (Short)

1. Validate lead and insert a new `Lead` record inside a transaction.
2. Apply mandatory assignments for the selected service.
3. Determine remaining slots to reach the required number of assignments.
4. Use the persistent round-robin pointer to iterate the fair pool.
5. For each candidate provider, atomically decrement quota and assign.
6. Persist the new round-robin pointer and save assignments.

## Concurrency Handling

- All lead creation and assignment logic runs inside a single database transaction.
- Quota decrements use conditional updates to prevent over-allocation.
- The transaction is retried on write conflicts/deadlocks with a short backoff.

## Webhook Idempotency

- The reset webhook stores an `eventId` in `WebhookEvent`.
- If the same `eventId` is received again, the handler short-circuits without reapplying the reset.

