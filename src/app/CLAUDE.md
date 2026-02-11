# App Router Structure

## Overview
Uses Next.js App Router with i18n via `next-intl`. All routes are under `[locale]` dynamic segment.

## Route Structure
```
app/
├── [locale]/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Locale layout (NextIntlClientProvider)
│   ├── order/
│   │   └── page.tsx                # Click & Collect ordering
│   ├── kiosk/
│   │   └── page.tsx                # Kiosk ordering (token required)
│   ├── checkout/
│   │   └── page.tsx                # Checkout form
│   ├── confirmation/
│   │   └── page.tsx                # Order confirmation
│   ├── display/
│   │   └── page.tsx                # Menu display (TV)
│   └── admin/
│       ├── login/
│       │   └── page.tsx            # Admin login
│       ├── dashboard/
│       │   └── page.tsx            # Order management
│       ├── menu/
│       │   └── page.tsx            # Menu management
│       └── kiosk/
│           └── setup/
│               └── page.tsx        # Terminal management
├── api/
│   └── webhooks/
│       └── stripe/
│           └── route.ts            # Stripe webhook handler
├── layout.tsx                      # Root layout
└── globals.css                     # Global styles
```

## Locales
- `fr` (default) - French
- `en` - English
- `nl` - Dutch

Routes: `/fr/...`, `/en/...`, `/nl/...`

## Key Pages

### `/[locale]/kiosk/page.tsx`
- Checks for kiosk token in localStorage
- Verifies token server-side via `verifyKioskToken()`
- If invalid: shows access denied
- If valid: renders `KioskFullscreenWrapper` > `KioskOrderPage`

### `/[locale]/admin/*`
- Protected by Supabase Auth
- Check auth in page or layout:
```tsx
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/fr/admin/login");
```

### `/api/webhooks/stripe/route.ts`
- Handles `checkout.session.completed` event
- Updates order status from `pending` to `paid`
- Verifies webhook signature with `STRIPE_WEBHOOK_SECRET`

## Middleware
`src/middleware.ts` handles:
- Locale detection from browser
- Redirect to appropriate locale route
- Uses `next-intl` middleware

## Patterns

### Server Component Page
```tsx
import { getTranslations } from "next-intl/server";

export default async function MyPage() {
  const t = await getTranslations("MyPage");

  return (
    <div className="min-h-screen bg-black">
      <h1>{t("title")}</h1>
    </div>
  );
}
```

### Page with Auth Check
```tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/fr/admin/login");
  }

  return <div>...</div>;
}
```

### Client Page with Token Check
```tsx
"use client";

export default function KioskPage() {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("kiosk_token");
    if (!token) {
      setIsValid(false);
      return;
    }
    verifyKioskToken(token).then(setIsValid);
  }, []);

  if (isValid === null) return <Loading />;
  if (!isValid) return <AccessDenied />;
  return <KioskContent />;
}
```

## i18n Config
- `src/i18n/routing.ts` - Route configuration
- `src/i18n/request.ts` - Server request handler
- `messages/*.json` - Translation files
