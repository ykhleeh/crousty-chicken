# Crousty Chicken - Project Context

## Overview
Restaurant ordering app for a fried chicken restaurant in Brussels (Evere). Supports two ordering modes:
- **Click & Collect** (online): Customer orders on website, pays via Stripe, picks up in store
- **Kiosk** (in-store tablet): Customer orders on tablet, pays at counter (cash/card), staff marks as paid

## Tech Stack
| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| i18n | next-intl (fr, en, nl) |
| State | Zustand (cart) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (admin only) |
| Storage | Supabase Storage (menu images) |
| Realtime | Supabase Realtime (orders) |
| Payments | Stripe (Checkout Sessions) |

## Commands
```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint linting
```

## Project Structure
```
src/
├── actions/        # Server Actions (see actions/CLAUDE.md)
├── app/            # Next.js routes (see app/CLAUDE.md)
├── components/     # React components (see components/CLAUDE.md)
├── data/           # Static data, helpers
├── i18n/           # i18n config (routing.ts, request.ts)
├── lib/            # External clients (Supabase, Stripe)
├── store/          # Zustand stores (cart-store.ts)
└── types/          # TypeScript types
supabase/
└── migrations/     # SQL migrations (see supabase/CLAUDE.md)
messages/           # i18n translations (fr.json, en.json, nl.json)
docs/               # Documentation
```

## Key Patterns

### Server vs Client Components
- Default: Server Components
- Add `"use client"` only when hooks are needed (useState, useEffect, etc.)

### Translations
```tsx
// Server Component
import { getTranslations } from "next-intl/server";
const t = await getTranslations("Section");

// Client Component
import { useTranslations } from "next-intl";
const t = useTranslations("Section");
```

### Supabase Access
```typescript
// Server-side (actions, API routes)
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

// Client-side
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
```

### Prices
All prices stored in **centimes** (integer). 9,50€ = 950 in DB.

### Naming Conventions
- **Components**: PascalCase (`OrderCard.tsx`)
- **Files**: kebab-case (`kiosk-actions.ts`)
- **Variables**: camelCase (`orderNumber`)
- **Types**: PascalCase (`CartItem`)
- **Constants**: UPPER_SNAKE (`VALID_TRANSITIONS`)

### Styling
- Tailwind utility classes only
- Custom colors: `golden` (#F5A623), `golden-dark`, `dark` (#111111), `darker`
- Path alias: `@/*` maps to `./src/*`

## Order Flow

### Online Orders
`pending` → `paid` (Stripe webhook) → `preparing` → `ready`

### Kiosk Orders
`pending_payment` → `paid` (staff clicks "Encaissé") → `preparing` → `ready`

## Key URLs
| Route | Purpose |
|-------|---------|
| `/[locale]` | Homepage |
| `/[locale]/order` | Click & Collect ordering |
| `/[locale]/kiosk` | Kiosk ordering (requires token) |
| `/[locale]/admin/login` | Admin login |
| `/[locale]/admin/dashboard` | Order management |
| `/[locale]/admin/menu` | Menu management |
| `/[locale]/admin/kiosk/setup` | Kiosk terminal management |

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_BASE_URL=
```

## Important Files
| File | Purpose |
|------|---------|
| `src/types/order.ts` | Order, CartItem, KioskToken types |
| `src/types/product.ts` | Product type |
| `src/store/cart-store.ts` | Cart state (Zustand) |
| `src/middleware.ts` | i18n routing middleware |
| `src/lib/supabase/server.ts` | Server Supabase client |
| `src/lib/supabase/client.ts` | Browser Supabase client |

## Detailed Documentation
- `src/actions/CLAUDE.md` - Server actions patterns
- `src/components/CLAUDE.md` - Component conventions
- `src/app/CLAUDE.md` - Routing structure
- `supabase/CLAUDE.md` - Database schema

## Not Yet Configured
- Tests (no Jest, Vitest, Playwright, or Cypress)
- Formatter (no Prettier)
- Pre-commit hooks (no Husky)
