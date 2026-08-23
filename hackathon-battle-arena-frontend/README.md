# Hackathon Battle Arena — Frontend

A competitive developer/hackathon platform frontend: profiles, skill-based
matchmaking, a live team build sprint (2v2 by default) with a server-authoritative timer, team
chat, AI-hybrid evaluation, and a global leaderboard.

React + JavaScript (no TypeScript) + Vite + Tailwind CSS. No Zod anywhere —
client-side validation is hand-rolled (`src/utils/validators.js`) and React
Hook Form rules; the backend remains the source of truth for every field.

## Getting started

```bash
bun install
cp .env.example .env    # point at your running backend
bun run dev
```

Build / preview:

```bash
bun run build
bun run preview
```

## Environment variables

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Never put backend secrets (`DATABASE_URL`, `JWT_*_SECRET`, `AI_API_KEY`,
`REDIS_URL`) in this file — the frontend never needs them.

## Architecture

```
src/
├── components/     # feature-organized, reusable, no direct API calls
│   ├── ui/          generic primitives (Button, Card, Input, Modal, ...)
│   ├── layout/       Sidebar, mobile nav
│   ├── auth/ profile/ matchmaking/ game/ challenge/ submission/
├── pages/          route-level screens; compose components + hooks
├── layouts/        AuthLayout, DashboardLayout (React Router <Outlet/>)
├── context/         AuthContext, SocketContext, NotificationContext, GameContext
├── hooks/           useAuth, useSocket, useGame, useGameSocket, useCountdown, useApi, ...
├── services/        one Axios instance (api.js) + one file per API resource
├── utils/            constants, formatters, validators (no Zod), storage
└── routes/           AppRoutes, ProtectedRoute, PublicRoute, RoleRoute
```

Business/state logic lives in hooks, context, and services — UI components
stay presentational and receive data via props or context.

## Auth flow

- Access token: short-lived JWT, held in `sessionStorage` only (never
  `localStorage`), attached to every request by an Axios interceptor.
- Refresh token: HTTP-only cookie the frontend never reads directly —
  `axios` is configured `withCredentials: true` so the browser sends it
  automatically to `/api/auth/refresh`.
- On a 401, the Axios interceptor transparently calls `/auth/refresh`,
  queues any concurrent requests behind that single call, and retries them
  with the new access token. A failed refresh clears the session and the
  route guards redirect to `/login`.
- On app boot, `AuthContext` calls `/auth/refresh` (if no in-memory token
  yet) then `/auth/me` to restore the session from the cookie alone.

## Real-time architecture

`SocketContext` opens one Socket.IO connection per authenticated session
(`auth: { token: accessToken }`). `useGameSocket(gameId)` joins
`game:<gameId>` and is the single place that subscribes to every backend
game event (`game:start`, `game:timer`, `game:player-status`,
`game:submission`, `game:message`, `game:end`, `game:result`), feeding them
into `GameContext` — listeners are always cleaned up on unmount so
navigating between game screens never doubles up handlers.

`GameRouteLayout` wraps the whole `/games/:gameId/*` subtree in a
`GameContext` keyed by `gameId`, so the lobby, arena, submission,
evaluation, and result screens all share one live state object without
polling each other.

## Server-authoritative game state

The frontend never computes or trusts its own idea of game state:

- **Timer**: `useCountdown(endTime)` only ever renders `endTime - now`.
  The actual transition out of `RUNNING` is driven by backend `game:*`
  socket events (or a REST re-fetch), never a local `setTimeout`.
- **Scores**: `EvaluationPage` and `ResultPage` render whatever the backend
  returns (`GET /games/:gameId/result`, `GET /games/:gameId/rewards/me`) —
  no score is ever computed client-side.
- **Submission deadline**: the submit button is disabled based on backend
  game status, not a local timer reaching zero.

## Backend API additions made while building this frontend

A few screens in the spec (persisted chat history, full evaluation scores on
reload, per-game reward deltas, and a game-history list) needed backend
support that didn't exist yet in the original API. Rather than fake this
data client-side, small, additive endpoints were added to the backend:

- `GET /api/games` — the current user's game history
- `GET /api/games/:gameId/messages` — persisted chat history
- `GET /api/games/:gameId/rewards/me` — this user's coin/XP/rating deltas for one game
- `GET /api/games/:gameId/result` now includes each team's `submissions[0].evaluation`

None of these change any existing endpoint's contract — see the backend's
`API.md` for the full reference.

## What's intentionally not invented

- `evaluationApi.js` is a thin wrapper around `gameApi.result` rather than a
  separate `/evaluation` resource, since evaluation is returned as part of
  the game.
- Player cards show experience level / top skills only when the backend
  actually includes them — `GET /games/:gameId/players` currently returns
  id/name/rating only, so those fields degrade gracefully instead of being
  guessed.
- Badge "progress" bars only exist for badges whose criteria are derivable
  from data the frontend already has (`wins`); badges without a knowable
  progress metric just show locked/unlocked.

## Run commands

```bash
bun install
bun run dev
bun run build
bun run preview
```

No `npm`/`yarn`/`pnpm` required anywhere in this project.
