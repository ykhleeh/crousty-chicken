# Crousty Chicken

Next.js 16 website for a fried chicken restaurant located in Brussels, Belgium.

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **UI**: React 19, TypeScript, Tailwind CSS 4
- **i18n**: next-intl 4.8.2 (FR default, EN, NL)
- **Linting**: ESLint 9 (core-web-vitals + typescript)

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
  app/
    layout.tsx              # Root layout (metadata)
    [locale]/
      layout.tsx            # Layout with NextIntlClientProvider
      page.tsx              # Homepage
  components/               # React components (Header, Hero, MenuGrid, etc.)
  data/menu.ts              # Static menu data (items, sauces, toppings)
  i18n/
    routing.ts              # i18n route config
    request.ts              # Server-side i18n handler
  middleware.ts             # Next.js middleware for locale detection
messages/
  fr.json, en.json, nl.json  # Translation files
public/
  plats/                    # Dish images
```

## Conventions

- **Server Components** by default, `"use client"` only when hooks are needed
- **Translations**: `const t = useTranslations("Section")` then `t("key")`
- **Naming**: PascalCase for components, camelCase for variables
- **Styles**: Tailwind utility classes only, custom colors (golden: #F5A623, dark: #111111)
- **Responsive**: mobile-first with `md:` and `lg:` breakpoints
- **Path alias**: `@/*` maps to `./src/*`

## i18n

- Default locale: `fr`
- Routes: `/{locale}/...` (e.g. `/fr/`, `/en/`, `/nl/`)
- Middleware handles locale detection and redirection
- All visible strings go through translation files

## Not Yet Configured

- Tests (no Jest, Vitest, Playwright, or Cypress)
- Formatter (no Prettier)
- Pre-commit hooks (no Husky)
