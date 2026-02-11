# Components

## Structure
```
components/
├── admin/          # Admin dashboard components
├── cart/           # Cart drawer and items
├── checkout/       # Checkout form
├── confirmation/   # Order confirmation
├── kiosk/          # Kiosk-specific components
├── order/          # Menu sections for ordering
└── *.tsx           # Shared components (Header, Footer, etc.)
```

## Key Components

### Admin Components (`/admin`)
| Component | Purpose |
|-----------|---------|
| `OrderCard.tsx` | Single order display with status actions |
| `OrderList.tsx` | Order list with filters, realtime subscription |
| `StatusBadge.tsx` | Colored badge for order status |
| `ProductForm.tsx` | Create/edit product form |
| `AdminHeader.tsx` | Admin navigation header |

**OrderCard Actions:**
- Shows badge `[KIOSK]` or `[ONLINE]` based on `order_type`
- For `pending_payment`: shows "Encaissé" button
- For `paid`: shows "En préparation" button
- For `preparing`: shows "Prête" button
- Calls `onRefresh` after action to sync UI

### Cart Components (`/cart`)
| Component | Purpose |
|-----------|---------|
| `CartDrawer.tsx` | Slide-out cart panel |
| `CartItem.tsx` | Single item in cart |
| `CartSummary.tsx` | Total and checkout button |

**CartDrawer Props:**
- `customCheckout?: ReactNode` - Custom checkout button (used by kiosk)

**CartItem:**
- Uses `item.name` if available (for DB products)
- Falls back to `t(item.nameKey)` for static products

### Kiosk Components (`/kiosk`)
| Component | Purpose |
|-----------|---------|
| `KioskOrderPage.tsx` | Main ordering interface (reuses order components) |
| `KioskTicket.tsx` | Ticket display after order |
| `KioskTokenSetup.tsx` | Terminal activation form (admin) |
| `KioskFullscreenWrapper.tsx` | Fullscreen mode with splash screen |

**KioskFullscreenWrapper:**
- Shows splash screen, enters fullscreen on tap
- Hidden exit: tap logo 5 times quickly (top-left corner)
- Wraps children (KioskOrderPage)

### Order Components (`/order`)
| Component | Purpose |
|-----------|---------|
| `MenuSection.tsx` | Main dishes (L'Original, etc.) |
| `EntrySection.tsx` | Entries (Wings, etc.) |
| `DrinkSection.tsx` | Drinks |
| `DessertSection.tsx` | Desserts |

These are reused by both `/order` page and kiosk.

### Shared Components
| Component | Purpose |
|-----------|---------|
| `Header.tsx` | Site header with navigation |
| `Footer.tsx` | Site footer |
| `Hero.tsx` | Homepage hero section |
| `Location.tsx` | Address, hours, Google Maps |

## Patterns

### Client vs Server
```tsx
// Server Component (default)
export default function MyComponent() { ... }

// Client Component (needs hooks)
"use client";
import { useState } from "react";
export default function MyComponent() { ... }
```

### Translations
```tsx
// Client Component
"use client";
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("Section");
  return <h1>{t("title")}</h1>;
}
```

### Using Cart Store
```tsx
"use client";
import { useCartStore } from "@/store/cart-store";

export default function MyComponent() {
  const { items, addItem, removeItem, totalPrice } = useCartStore();
  // ...
}
```

## Styling
- Tailwind CSS only (no inline styles)
- Custom colors: `golden`, `golden-dark`, `dark`, `darker`
- Common patterns:
  ```tsx
  <div className="bg-dark rounded-2xl p-4 border border-white/10">
  <button className="bg-golden hover:bg-golden-dark text-black font-bold">
  ```
