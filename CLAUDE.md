# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start Metro bundler
npm start

# Run on device/simulator
npm run android
npm run ios

# iOS setup (first time or after native changes)
bundle install && bundle exec pod install

# Lint
npm run lint

# Tests
npm run test
```

## Architecture

This is a **React Native** task/project management app backed by **Supabase** (auth + database + realtime).

### Navigation

Auth state is checked at startup in `src/navigation/index.tsx`. The app switches between:
- `AuthStack` — Login / Signup (unauthenticated)
- `DrawerNavigator` → `DashboardStack` → `ProjectsStack` (authenticated)

Route name constants live in `src/navigation/Routes.ts`. Navigation types are in `src/navigation/types.ts`.

### Data Layer

- **Supabase client** is a singleton in `src/supabase/client.ts`.
- **Service functions** in `src/services/` abstract Supabase queries (auth in `authService.ts`, task/projects/tags in `todoService.ts`).
- Realtime subscriptions are set up directly in screens via Supabase channels (e.g., Dashboard).
- No Redux or global state — screens use local `useState`. (Project rules mention Redux Toolkit but it is not implemented.)

### Styling

- Colors must come from `src/theme/colors.ts` — no hardcoded color values.
- Spacing scale: `8, 12, 16, 20, 24, 28, 32, 48`.
- Every component has a dedicated `ComponentName.styles.ts` file using `StyleSheet.create`.

### Component / Screen Structure

Every screen or component lives in its own folder following this pattern:

```
FeatureName/
  FeatureName.tsx           # main component
  FeatureName.styles.ts     # styles only
  FeatureName.constants.ts  # hardcoded strings and other constants
  index.ts                  # re-exports only
```

All user-facing strings must be defined in the constants file — never inline.

### Key Conventions

- Functional components only; no class components.
- No inline functions or arrow functions in JSX props — define handlers with `useCallback` above the return.
- Use `FlatList` instead of `.map()` for lists.
- API calls use `async/await` with `try/catch` — no `.then()` chains.
- The reusable `Header` component (`src/components/Header.tsx`) must be included in every screen.
- Reactotron is loaded in development for debugging (configured in `ReactotronConfig.js`).
- When new components created then add custom <Header> .