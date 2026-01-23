# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mumumidex is a Next.js 16 weather comparison app that ranks cities by humidex (heat index). Users can track multiple cities and see them sorted by perceived temperature. Unauthenticated users see default cities; authenticated users can save their own.

## Commands

```bash
bun dev           # Start development server
bun run build     # Production build
bun run lint      # Biome check
bun run lint:fix  # Biome check + fix
bun run format    # Biome format

# Database (Prisma 7 + PostgreSQL)
bun run db:migrate   # Run migrations locally
bun run db:generate  # Regenerate Prisma client
bun run db:studio    # Open Prisma Studio
bun run db:push      # Push schema changes without migration
bun run db:format    # Format schema file

# UI Components
bun run ui:add       # Add shadcn/ui component

# Storybook
bun run storybook        # Start Storybook dev server (port 6006)
bun run build-storybook  # Build static Storybook
```

## Architecture

### Data Flow
1. **Forecast fetching** (`src/actions/forecast.ts`): Server action fetches weather from Open-Meteo API for user's cities (or default cities if unauthenticated)
2. **Humidex calculation** (`src/lib/humidex.ts`): Computes humidex from temperature and dew point; provides color-coded CSS classes based on thresholds (20/30/40/46°C)
3. **City management** (`src/actions/city.ts`): CRUD operations using `next-safe-action` with Zod validation; city search via Open-Meteo geocoding API

### Authentication
- Better Auth with Google OAuth provider
- Database sessions with Prisma adapter (`@prisma/adapter-pg`)
- Server config in `src/lib/auth.ts`, client hooks in `src/lib/auth-client.ts`
- API route handler at `src/app/api/auth/[...all]/route.ts`
- Middleware (`src/proxy.ts`) protects all routes except `/`, `/login`, and API routes using `getSessionCookie`
- Two action clients in `src/lib/safe-action.ts`: `actionClient` (public) and `authActionClient` (authenticated via `auth.api.getSession`)

### Routing
- Uses Next.js parallel routes for modals: `@modal` slot with intercepting routes `(.)login` and `(.)user/cities`
- Main page supports `?standalone=true` query param for PWA mode (shows refresh button)

### Key Patterns
- Server actions with `'use server'` directive for data mutations
- Cache invalidation via `updateTag` for user-specific data (`user-cities-${userId}`)
- Zod schemas in `src/validation/` mirror Prisma models for runtime validation
- Custom humidex color system with 5 levels (`humidex-1` through `humidex-5`) defined in CSS (`globals.css` with `@theme`)

### Component Structure
- `src/components/ui/`: shadcn/ui base components
- `src/components/custom-ui/`: Project-specific reusable components
- `src/components/forecast/`: Weather card and KPI display
- `src/components/user/`: City management and user menu

## Tech Stack

- **Runtime**: Bun
- **Framework**: Next.js 16 (Turbopack)
- **Auth**: Better Auth with Prisma adapter
- **UI**: React 19, Tailwind CSS 4, shadcn/ui
- **Validation**: Zod 4, next-safe-action 8
- **Database**: PostgreSQL + Prisma 7 (`@prisma/adapter-pg`)
- **Testing**: Vitest, Playwright
- **Linting/Formatting**: Biome, Husky + lint-staged
- **Documentation**: Storybook

## Environment Variables Required

```
POSTGRES_PRISMA_URL      # Prisma connection (pooled)
POSTGRES_URL_NON_POOLING # Direct connection for migrations
AUTH_GOOGLE_ID           # Google OAuth client ID
AUTH_GOOGLE_SECRET       # Google OAuth client secret
```
