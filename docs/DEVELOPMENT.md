# Guide de Développement - Crousty Chicken

## Table des matières
1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Conventions](#conventions)
4. [Ajouter une Fonctionnalité](#ajouter-une-fonctionnalité)
5. [Base de Données](#base-de-données)
6. [Tests](#tests)
7. [Déploiement](#déploiement)

---

## Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase
- Compte Stripe

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/ykhleeh/crousty-chicken.git
cd crousty-chicken

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env.local

# 4. Configurer les variables d'environnement (voir section Configuration)

# 5. Lancer le serveur de développement
npm run dev
```

### Accès local
- Site : http://localhost:3000
- Admin : http://localhost:3000/fr/admin/login
- Kiosk : http://localhost:3000/fr/kiosk

---

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Supabase Setup

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Exécutez les migrations SQL dans `supabase/migrations/`
3. Créez un utilisateur admin dans Authentication > Users
4. Configurez le storage bucket `menu-images`

### Stripe Setup

1. Créez un compte sur [stripe.com](https://stripe.com)
2. Récupérez les clés API (mode test pour dev)
3. Configurez le webhook pour `checkout.session.completed`
4. URL webhook : `https://[votre-domaine]/api/webhooks/stripe`

---

## Conventions

### Structure des fichiers

```
src/
├── actions/        # Server Actions uniquement
├── app/            # Routes Next.js (App Router)
├── components/     # Composants React
├── data/           # Données statiques et helpers
├── i18n/           # Configuration i18n
├── lib/            # Clients externes (Supabase, Stripe)
├── store/          # Stores Zustand
└── types/          # Types TypeScript
```

### Naming

| Type | Convention | Exemple |
|------|------------|---------|
| Composants | PascalCase | `OrderCard.tsx` |
| Fichiers | kebab-case | `kiosk-actions.ts` |
| Variables | camelCase | `orderNumber` |
| Types | PascalCase | `CartItem` |
| Constantes | UPPER_SNAKE | `VALID_TRANSITIONS` |

### Composants

```tsx
// Server Component (par défaut)
export default function MyComponent() {
  return <div>...</div>
}

// Client Component (si hooks nécessaires)
"use client";

import { useState } from "react";

export default function MyClientComponent() {
  const [state, setState] = useState(null);
  return <div>...</div>
}
```

### Server Actions

```typescript
// src/actions/my-actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function myAction(data: MyInput): Promise<MyOutput> {
  const supabase = await createClient();

  // Vérification auth si nécessaire
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Logique métier
  // ...

  return { success: true };
}
```

### Traductions

```tsx
// Server Component
import { getTranslations } from "next-intl/server";

export default async function MyPage() {
  const t = await getTranslations("MySection");
  return <h1>{t("title")}</h1>;
}

// Client Component
"use client";
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("MySection");
  return <h1>{t("title")}</h1>;
}
```

### Styles

Utilisation de Tailwind CSS uniquement :

```tsx
// Bon
<div className="bg-dark rounded-2xl p-4 border border-white/10">

// À éviter
<div style={{ backgroundColor: '#111', padding: '16px' }}>
```

Couleurs personnalisées :
- `golden` : #F5A623 (couleur principale)
- `golden-dark` : Version foncée
- `dark` : #111111 (background)
- `darker` : Version plus foncée

---

## Ajouter une Fonctionnalité

### Exemple : Ajouter un nouveau type de produit

#### 1. Mettre à jour les types

```typescript
// src/types/product.ts
export interface Product {
  // ... existant
  my_new_field?: string;
}
```

#### 2. Migration SQL

```sql
-- supabase/migrations/xxx_add_feature.sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS my_new_field TEXT;
```

#### 3. Mettre à jour les actions

```typescript
// src/actions/menu-actions.ts
export async function createProduct(data: ProductInput) {
  // Ajouter le nouveau champ
}
```

#### 4. Mettre à jour les composants

```tsx
// src/components/admin/ProductForm.tsx
// Ajouter le champ dans le formulaire
```

#### 5. Ajouter les traductions

```json
// messages/fr.json
{
  "AdminMenu": {
    "myNewField": "Mon nouveau champ"
  }
}
```

### Exemple : Ajouter une nouvelle page

#### 1. Créer la page

```tsx
// src/app/[locale]/my-page/page.tsx
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

#### 2. Ajouter les traductions

```json
// messages/fr.json, en.json, nl.json
{
  "MyPage": {
    "title": "Ma Page"
  }
}
```

---

## Base de Données

### Exécuter une migration

1. Créez le fichier SQL dans `supabase/migrations/`
2. Nommez-le avec la date : `20240210_description.sql`
3. Exécutez-le dans le SQL Editor de Supabase

### Conventions SQL

```sql
-- Toujours utiliser des UUIDs pour les clés primaires
CREATE TABLE my_table (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- ...
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Toujours activer RLS
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

-- Créer les policies appropriées
CREATE POLICY "Public read" ON my_table FOR SELECT USING (true);
CREATE POLICY "Admin write" ON my_table FOR ALL TO authenticated USING (true);
```

### Accès Supabase

```typescript
// Client côté serveur (Server Actions, API Routes)
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

// Client côté client (Components "use client")
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
```

---

## Tests

> **Note** : Les tests ne sont pas encore configurés dans ce projet.

### Configuration recommandée

```bash
# Installer les dépendances de test
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Structure suggérée

```
src/
├── __tests__/
│   ├── components/
│   │   └── OrderCard.test.tsx
│   ├── actions/
│   │   └── kiosk-actions.test.ts
│   └── utils/
│       └── helpers.test.ts
```

---

## Déploiement

### Vercel (Recommandé)

1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez

### Variables de production

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_BASE_URL=https://croustychicken.be
```

### Checklist pré-production

- [ ] Variables d'environnement configurées
- [ ] Clés Stripe en mode live
- [ ] Webhook Stripe configuré avec l'URL de prod
- [ ] DNS configuré
- [ ] SSL actif (automatique sur Vercel)
- [ ] Migrations SQL exécutées sur Supabase prod
- [ ] Utilisateur admin créé
- [ ] Test de bout en bout

### Commandes de build

```bash
# Build de production
npm run build

# Vérifier les erreurs TypeScript
npm run lint

# Tester le build localement
npm run start
```

---

## Debugging

### Logs Supabase

Dans le dashboard Supabase > Logs > API pour voir les requêtes.

### Logs Stripe

Dans le dashboard Stripe > Developers > Logs.

### Console navigateur

Les subscriptions Realtime loguent leur statut :
```
Realtime subscription status: SUBSCRIBED
Realtime event received: { ... }
```

### Erreurs communes

| Erreur | Cause probable | Solution |
|--------|----------------|----------|
| `NEXT_PUBLIC_*` undefined | Variable non préfixée | Ajouter `NEXT_PUBLIC_` |
| RLS policy error | Policy manquante | Vérifier les policies |
| Stripe webhook 400 | Secret incorrect | Vérifier `STRIPE_WEBHOOK_SECRET` |
| Auth error | Session expirée | Re-login |

---

## Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [next-intl](https://next-intl-docs.vercel.app/)
- [Zustand](https://zustand-demo.pmnd.rs/)
