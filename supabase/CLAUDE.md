# Supabase Database

## Tables

### `products`
Menu items (dishes, entries, drinks, desserts).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `category` | TEXT | 'dish', 'entry', 'drink', 'dessert' |
| `name_fr` | TEXT | French name |
| `name_nl` | TEXT | Dutch name |
| `name_en` | TEXT | English name |
| `description_fr` | TEXT | French description |
| `description_nl` | TEXT | Dutch description |
| `description_en` | TEXT | English description |
| `image_url` | TEXT | Supabase Storage URL |
| `price_m` | INTEGER | Price M in centimes (dishes) |
| `price_l` | INTEGER | Price L in centimes (dishes) |
| `price_xl` | INTEGER | Price XL in centimes (dishes) |
| `price` | INTEGER | Single price (drinks, desserts) |
| `qty_small` | INTEGER | Small quantity (entries) |
| `qty_large` | INTEGER | Large quantity (entries) |
| `price_small` | INTEGER | Small price (entries) |
| `price_large` | INTEGER | Large price (entries) |
| `is_available` | BOOLEAN | Show on menu |
| `is_single_price` | BOOLEAN | Has only one price option |
| `sort_order` | INTEGER | Display order |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |

### `orders`
Customer orders.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `order_number` | SERIAL | Display number (#42) |
| `customer_name` | TEXT | Customer name |
| `customer_phone` | TEXT | Customer phone |
| `items` | JSONB | Cart items array |
| `total_cents` | INTEGER | Total in centimes |
| `status` | TEXT | Order status (see below) |
| `order_type` | TEXT | 'online' or 'kiosk' |
| `kiosk_token_id` | UUID | FK to kiosk_tokens (if kiosk) |
| `stripe_session_id` | TEXT | Stripe checkout session |
| `stripe_payment_intent` | TEXT | Stripe payment intent |
| `locale` | TEXT | Customer's locale |
| `created_at` | TIMESTAMPTZ | Order time |
| `updated_at` | TIMESTAMPTZ | Last update |

**Order Statuses:**
- `pending` - Online order, awaiting Stripe payment
- `pending_payment` - Kiosk order, awaiting counter payment
- `paid` - Payment confirmed, ready for preparation
- `preparing` - Being prepared
- `ready` - Ready for pickup

### `kiosk_tokens`
Device tokens for kiosk tablets.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `token` | TEXT | Unique token (stored in localStorage) |
| `name` | TEXT | Terminal name ("Tablette 1") |
| `is_active` | BOOLEAN | Token enabled |
| `created_at` | TIMESTAMPTZ | Creation time |
| `last_used_at` | TIMESTAMPTZ | Last order time |

### `settings`
Application settings (key-value store).

| Column | Type | Description |
|--------|------|-------------|
| `key` | TEXT | Setting key (PK) |
| `value` | JSONB | Setting value |

Current keys:
- `click_and_collect_enabled` - Boolean to toggle online ordering

## Row Level Security (RLS)

All tables have RLS enabled.

### products
- Public can SELECT (read menu)
- Authenticated can ALL (admin CRUD)

### orders
- Public can INSERT (create orders)
- Authenticated can SELECT, UPDATE (admin management)

### kiosk_tokens
- Public can SELECT (verify token)
- Authenticated can ALL (admin management)

### settings
- Authenticated can ALL

## Realtime
Enabled on `orders` table for live dashboard updates.

```typescript
supabase
  .channel("orders")
  .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, callback)
  .subscribe();
```

## Storage

### Bucket: `menu-images`
- Stores product images
- Public read access
- Authenticated write access

## Migrations

Location: `supabase/migrations/`

Key migrations:
- `20240208_kiosk.sql` - Kiosk tokens table, order_type column

### Running Migrations
Execute SQL in Supabase Dashboard > SQL Editor.

## Common Queries

### Get active orders
```sql
SELECT * FROM orders
WHERE status NOT IN ('ready')
ORDER BY created_at DESC;
```

### Get products by category
```sql
SELECT * FROM products
WHERE category = 'dish' AND is_available = true
ORDER BY sort_order;
```

### Verify kiosk token
```sql
SELECT * FROM kiosk_tokens
WHERE token = $1 AND is_active = true;
```
