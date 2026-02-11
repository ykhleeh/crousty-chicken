# Server Actions

## Overview
All server actions use `"use server"` directive and are called from client components or forms.

## Files

| File | Purpose |
|------|---------|
| `admin-actions.ts` | Order status management, settings |
| `checkout-actions.ts` | Stripe checkout session creation |
| `kiosk-actions.ts` | Kiosk token management, kiosk orders |
| `menu-actions.ts` | CRUD operations for products |
| `order-actions.ts` | Order queries |

## Patterns

### Authentication Check
```typescript
"use server";
import { createClient } from "@/lib/supabase/server";

export async function adminAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }
  // ... action logic
}
```

### Return Types
Actions return objects with either success data or error:
```typescript
// Success
return { success: true, data: result };
return { orderId: "...", orderNumber: 42 };

// Error
return { error: "Error message" };
```

## Key Actions

### admin-actions.ts
- `updateOrderStatus(orderId, newStatus)` - Transitions order status with validation
- `markOrderAsPaid(orderId)` - Marks kiosk order as paid (pending_payment → paid)
- `getSettings()` / `updateSettings()` - Click & Collect toggle

**Valid Status Transitions:**
```typescript
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid"],
  pending_payment: ["paid"],  // Kiosk: staff marks as paid
  paid: ["preparing"],
  preparing: ["ready"],
  ready: [],
};
```

### kiosk-actions.ts
- `verifyKioskToken(token)` - Validates token, updates last_used_at
- `createKioskOrder(data)` - Creates order with status `pending_payment`
- `activateKioskTerminal(name)` - Generates token, stores in DB, returns token
- `getKioskTerminals()` - Lists all terminals (admin)
- `toggleKioskTerminal(id, active)` - Enable/disable terminal
- `deleteKioskTerminal(id)` - Remove terminal

### checkout-actions.ts
- `createCheckoutSession(items, customerInfo, locale)` - Creates Stripe session
- Prices are recalculated server-side (never trust client prices)

### menu-actions.ts
- `getProducts()` - Fetch all products
- `createProduct(data)` - Create product with image upload
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product
- `toggleProductAvailability(id)` - Toggle is_available

## Notes
- All DB operations use `supabase` client from `@/lib/supabase/server`
- Always validate auth for admin actions
- Prices are in centimes (integers)
- Product images stored in Supabase Storage bucket `menu-images`
