# Architecture

## Principle

The project is intentionally structured like a SaaS product even though version 1 is frontend-only.

## Layers

```txt
components/   Reusable UI and layout building blocks
features/     Product-specific feature modules
hooks/        Reusable React logic
data/         Demo data and seed data
types/        Shared TypeScript contracts
utils/        Pure utility functions
styles/       Global tokens and app styling
config/       Product-level configuration
constants/    Shared constants such as storage keys
```

## Future Backend Migration

The current localStorage layer is isolated in `src/utils/storage.ts` and hooks. This makes it easier to replace browser persistence with a backend API later.

Recommended future backend options:

- Supabase for fast SaaS launch
- PostgreSQL with Prisma for custom backend
- Next.js or Node API for full-stack migration
- Stripe for subscriptions
