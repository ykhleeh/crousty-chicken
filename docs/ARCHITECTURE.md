# Architecture Technique - Crousty Chicken

## Vue d'ensemble

Crousty Chicken est une application web de commande en ligne pour un restaurant de poulet frit à Bruxelles. L'application supporte deux modes de commande : Click & Collect (en ligne) et Kiosk (tablette en magasin).

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   Site Web      │   Tablette      │      Admin                  │
│  (Click&Collect)│    (Kiosk)      │    (Dashboard)              │
└────────┬────────┴────────┬────────┴──────────┬──────────────────┘
         │                 │                   │
         ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS 16 (App Router)                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐ │
│  │    Pages     │ │  Components  │ │     Server Actions       │ │
│  │  /order      │ │  /cart       │ │  checkout-actions.ts     │ │
│  │  /kiosk      │ │  /kiosk      │ │  kiosk-actions.ts        │ │
│  │  /admin/*    │ │  /admin      │ │  admin-actions.ts        │ │
│  └──────────────┘ └──────────────┘ └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         │                                     │
         ▼                                     ▼
┌─────────────────────┐           ┌───────────────────────────────┐
│      STRIPE         │           │          SUPABASE             │
│  - Checkout         │           │  ┌─────────────────────────┐  │
│  - Webhooks         │           │  │      PostgreSQL         │  │
│  - Bancontact       │           │  │  - orders               │  │
│                     │           │  │  - products             │  │
└─────────────────────┘           │  │  - kiosk_tokens         │  │
                                  │  │  - settings             │  │
                                  │  └─────────────────────────┘  │
                                  │  ┌─────────────────────────┐  │
                                  │  │     Auth (Admin)        │  │
                                  │  └─────────────────────────┘  │
                                  │  ┌─────────────────────────┐  │
                                  │  │   Storage (Images)      │  │
                                  │  └─────────────────────────┘  │
                                  │  ┌─────────────────────────┐  │
                                  │  │      Realtime           │  │
                                  │  └─────────────────────────┘  │
                                  └───────────────────────────────┘
```

---

## Stack Technique

| Catégorie | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Runtime | React | 19 |
| Langage | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| i18n | next-intl | 4.8.2 |
| State Management | Zustand | 5.x |
| Database | Supabase (PostgreSQL) | - |
| Auth | Supabase Auth | - |
| Storage | Supabase Storage | - |
| Realtime | Supabase Realtime | - |
| Paiement | Stripe | - |

---

## Structure du Projet

```
crousty-chicken/
├── docs/                      # Documentation
├── messages/                  # Fichiers de traduction i18n
│   ├── fr.json
│   ├── en.json
│   └── nl.json
├── public/                    # Assets statiques
│   └── plats/                 # Images des plats
├── src/
│   ├── actions/               # Server Actions (Next.js)
│   │   ├── admin-actions.ts   # Actions admin (commandes, settings)
│   │   ├── checkout-actions.ts # Création session Stripe
│   │   ├── kiosk-actions.ts   # Actions kiosk (tokens, commandes)
│   │   ├── menu-actions.ts    # CRUD produits
│   │   └── order-actions.ts   # Lecture commandes
│   ├── app/
│   │   ├── [locale]/          # Routes internationalisées
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── order/         # Click & Collect
│   │   │   ├── kiosk/         # Mode Kiosk
│   │   │   ├── admin/         # Dashboard admin
│   │   │   └── display/       # Affichage menu (TV)
│   │   ├── api/
│   │   │   └── webhooks/stripe/ # Webhook Stripe
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── admin/             # Composants admin
│   │   ├── cart/              # Panier
│   │   ├── checkout/          # Paiement
│   │   ├── confirmation/      # Confirmation commande
│   │   ├── kiosk/             # Mode kiosk
│   │   └── order/             # Interface commande
│   ├── data/
│   │   └── menu.ts            # Types et helpers menu
│   ├── i18n/
│   │   ├── routing.ts         # Config routes i18n
│   │   └── request.ts         # Handler serveur i18n
│   ├── lib/
│   │   ├── stripe.ts          # Client Stripe
│   │   └── supabase/          # Clients Supabase
│   ├── store/
│   │   └── cart-store.ts      # Store Zustand (panier)
│   ├── types/
│   │   ├── order.ts           # Types commandes
│   │   └── product.ts         # Types produits
│   └── middleware.ts          # Middleware i18n
├── supabase/
│   └── migrations/            # Migrations SQL
└── package.json
```

---

## Base de Données

### Schéma

```sql
-- Table des produits (menu)
products (
  id            UUID PRIMARY KEY,
  category      TEXT CHECK (category IN ('dish', 'entry', 'drink', 'dessert')),
  name_fr       TEXT NOT NULL,
  name_nl       TEXT,
  name_en       TEXT,
  description_fr TEXT,
  description_nl TEXT,
  description_en TEXT,
  image_url     TEXT,
  price_m       INTEGER,          -- Prix M en centimes (plats)
  price_l       INTEGER,          -- Prix L en centimes (plats)
  price_xl      INTEGER,          -- Prix XL en centimes (plats)
  price         INTEGER,          -- Prix unique (boissons, desserts)
  qty_small     INTEGER,          -- Quantité petit (entrées)
  qty_large     INTEGER,          -- Quantité grand (entrées)
  price_small   INTEGER,          -- Prix petit (entrées)
  price_large   INTEGER,          -- Prix grand (entrées)
  is_available  BOOLEAN DEFAULT true,
  is_single_price BOOLEAN DEFAULT false,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
)

-- Table des commandes
orders (
  id                    UUID PRIMARY KEY,
  order_number          SERIAL,
  customer_name         TEXT NOT NULL,
  customer_phone        TEXT,
  items                 JSONB NOT NULL,      -- Détail des articles
  total_cents           INTEGER NOT NULL,
  status                TEXT CHECK (status IN ('pending', 'pending_payment', 'paid', 'preparing', 'ready')),
  order_type            TEXT DEFAULT 'online' CHECK (order_type IN ('online', 'kiosk')),
  kiosk_token_id        UUID REFERENCES kiosk_tokens(id),
  stripe_session_id     TEXT,
  stripe_payment_intent TEXT,
  locale                TEXT,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
)

-- Table des tokens kiosk
kiosk_tokens (
  id            UUID PRIMARY KEY,
  token         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  last_used_at  TIMESTAMPTZ
)

-- Table des paramètres
settings (
  key           TEXT PRIMARY KEY,
  value         JSONB
)
```

### Row Level Security (RLS)

| Table | Policy | Accès |
|-------|--------|-------|
| products | Public read | Tous peuvent lire |
| products | Admin write | Authentifiés peuvent modifier |
| orders | Public insert | Tous peuvent créer |
| orders | Admin read/update | Authentifiés peuvent lire/modifier |
| kiosk_tokens | Public verify | Anon peut lire (vérification token) |
| kiosk_tokens | Admin full | Authentifiés ont accès complet |

---

## Flows Applicatifs

### Flow Click & Collect

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Menu   │ ──► │ Panier  │ ──► │ Checkout│ ──► │ Stripe  │
│  /order │     │ (Cart)  │     │  Form   │     │ Payment │
└─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                     │
     ┌───────────────────────────────────────────────┘
     │ Webhook stripe/checkout.session.completed
     ▼
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Order   │ ──► │ Preparing│ ──► │  Ready  │ ──► │ Pickup  │
│  Paid   │     │         │     │         │     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
```

### Flow Kiosk

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Splash  │ ──► │  Menu   │ ──► │ Panier  │ ──► │ Submit  │
│ Screen  │     │ /kiosk  │     │ (Cart)  │     │ Order   │
└─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                     │
                                                     ▼
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Ticket  │ ◄── │ Pending │ ──► │  Paid   │ ──► │ Ready   │
│ Display │     │ Payment │     │(Counter)│     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
```

### Flow Authentification Kiosk

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Admin Login │ ──► │ Create Token│ ──► │ Store Token │
│             │     │ (Generate)  │     │ localStorage│
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Access      │ ◄── │ Verify Token│ ◄── │ Load /kiosk │
│ Granted     │     │ (Server)    │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Intégrations Externes

### Stripe
- **Mode** : Checkout Sessions
- **Méthodes** : Card, Bancontact
- **Webhook** : `checkout.session.completed`
- **Variables d'env** :
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Supabase
- **Auth** : Email/Password pour admins
- **Database** : PostgreSQL avec RLS
- **Storage** : Bucket `menu-images` pour images produits
- **Realtime** : Subscription sur table `orders`
- **Variables d'env** :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

---

## Internationalisation (i18n)

### Locales supportées
- `fr` (défaut) - Français
- `en` - English
- `nl` - Nederlands

### Structure des routes
```
/fr/...        → Français
/en/...        → English
/nl/...        → Nederlands
```

### Middleware
Le middleware détecte automatiquement la locale préférée du navigateur et redirige vers la route appropriée.

---

## État Local (Zustand)

### Cart Store
```typescript
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}
```

Persistance : `localStorage` (clé: `crousty-cart`)

---

## Sécurité

### Authentification Admin
- Gérée par Supabase Auth
- Session cookie HTTPOnly
- Middleware de protection sur `/admin/*`

### Tokens Kiosk
- Générés côté serveur (crypto.randomBytes)
- Stockés en base de données
- Vérification côté serveur à chaque requête
- Possibilité de désactiver/supprimer

### Validation des Prix
- Tous les prix sont recalculés côté serveur
- Les prix du panier client sont ignorés
- Protection contre la manipulation client

### RLS (Row Level Security)
- Toutes les tables ont RLS activé
- Policies strictes par rôle (anon/authenticated)

---

## Performance

### Optimisations
- Server Components par défaut
- Images optimisées avec `next/image`
- Lazy loading des composants modaux
- Realtime Supabase pour updates en temps réel

### Caching
- Static generation pour pages publiques
- ISR (Incremental Static Regeneration) désactivé (données dynamiques)
- Client-side cache Zustand pour panier

---

## Déploiement

### Environnements
- **Development** : `npm run dev`
- **Production** : Vercel (recommandé) ou tout hébergeur Node.js

### Variables d'environnement requises
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_BASE_URL=
```

### Commandes
```bash
npm run build    # Build production
npm run start    # Start production server
npm run dev      # Development server
npm run lint     # Linting
```
