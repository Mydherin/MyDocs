# Authentication Approach

## Strategy
Third-party auth via Google OAuth2. The backend never issues tokens — it only validates.
The frontend owns the token lifecycle; the backend is a stateless validator and user registry.

---

## Critical Implementation Notes

These learnings are technology-agnostic and must be followed precisely to avoid silent failures.

### Google endpoint selection

**Do NOT use the tokeninfo endpoint to retrieve user profile data.**
`GET https://oauth2.googleapis.com/tokeninfo?access_token=<token>` validates the token but does **not** reliably return `name`, `given_name`, or `picture`. These fields are absent or inconsistent depending on the token's audience and scope.

**Always use the UserInfo endpoint for both validation and profile retrieval:**
```
GET https://www.googleapis.com/oauth2/v3/userinfo
Authorization: Bearer <access_token>
```
This endpoint returns a 401 if the token is invalid or expired (implicit validation), and returns the full profile on success: `sub`, `email`, `email_verified`, `name`, `given_name`, `family_name`, `picture`, `locale`.

### Required OAuth2 scopes

The frontend must explicitly request the following scopes when initiating the Google login flow:
```
openid email profile
```
Without `profile`, the UserInfo endpoint will not return `name`, `given_name`, or `picture`. Relying on default scopes is not safe — always declare them explicitly.

### Nickname derivation (priority order)
Derive the user's display name from the UserInfo response using this fallback chain:
1. `given_name` (first name — most human-friendly)
2. `name` (full name — if given_name absent)
3. Email prefix — local part before `@` (last resort)

### Profile image rendering
Google profile picture URLs require the HTTP request to carry no `Referer` header. When rendering the image in a browser context, set `referrerpolicy="no-referrer"` on the `<img>` element (or equivalent in the UI framework). Without this, the image request will be blocked and return a 403.

### Sign-in endpoint and middleware interaction
The `POST /auth/signin` endpoint must be fully excluded from the auth middleware — not just from the user-existence check. The endpoint performs its own token validation internally by calling the UserInfo endpoint. Applying the middleware to this route creates a redundant validation cycle and a circular dependency (the user cannot exist yet on first registration).

---

## Frontend Responsibilities
1. Initiate Google login with explicit scopes: `openid email profile`.
2. On success, receive the Google **access token** and its **expiry time** (`expires_in`, in seconds) from the OAuth2 response.
3. Call `POST /auth/signin` with `Authorization: Bearer <access_token>`. Store the returned user record in client-side state.
4. Attach the token to every subsequent API request: `Authorization: Bearer <access_token>`.
5. Persist the access token, its absolute expiry timestamp (`expiresAt = Date.now() + expires_in * 1000`), and the user record to `localStorage` so the session survives page reloads.
6. On app init, rehydrate auth state from `localStorage` if a non-expired token exists.
7. Token refresh is the frontend's responsibility. The backend does not handle refresh logic. Use **silent re-authentication** (no refresh token required):
   - Before each API call, check if the token is expired or about to expire (within a 60-second buffer).
   - If so, call Google's token client with `prompt: ''` (empty string — triggers silent flow with no UI). This silently issues a new access token if the user still has an active Google session.
   - On success: update `localStorage` and in-memory state with the new token and expiry.
   - On failure (user signed out of Google): clear auth state and redirect to `/login`.
8. On explicit logout: clear `localStorage` auth keys and in-memory state.

---

## Backend Responsibilities

### Middleware (applied to every protected route)
1. Extract the `Authorization: Bearer` header. If missing or malformed → **401** `{ "error": "missing_token" }`.
2. Validate the token by calling the UserInfo endpoint with `Authorization: Bearer <token>`.
3. Decision tree:
   - UserInfo returns error → **401** `{ "error": "invalid_token" }`
   - UserInfo returns valid profile, user not found in DB (non-sign-in endpoint) → **401** `{ "error": "user_not_found" }`
   - UserInfo returns valid profile, user found → attach user to request context, proceed.

### Sign-In Endpoint (`POST /auth/signin`)
Completely bypasses the middleware. Handles its own validation:
1. Extract `Authorization: Bearer` header. If missing → **401** `{ "error": "missing_token" }`.
2. Call UserInfo endpoint with the token.
3. If UserInfo returns error → **401** `{ "error": "invalid_token" }`.
4. If user already exists → **200 OK** with existing user record.
5. If user does not exist → register using UserInfo claims → **201 Created** with new user record.

### User record fields (from UserInfo claims)
| Field | Source | Notes |
|---|---|---|
| `id` | `sub` | Google's unique subject ID — use as primary key |
| `email` | `email` | Unique per user |
| `nickname` | `given_name` → `name` → email prefix | See derivation order above |
| `picture` | `picture` | May be null — always handle absence gracefully |

---

## Error Reference

| Scenario | HTTP Status | Error Body |
|---|---|---|
| Missing / malformed Authorization header | 401 | `{ "error": "missing_token" }` |
| Token rejected by Google UserInfo endpoint | 401 | `{ "error": "invalid_token" }` |
| Valid token, user not found (non-sign-in route) | 401 | `{ "error": "user_not_found" }` |
| Valid token, sign-in, user exists | 200 | user record |
| Valid token, sign-in, user registered | 201 | user record |

---

## Constraints
- **Do NOT** create a backend auth server or issue custom JWTs.
- **Do NOT** use the tokeninfo endpoint to retrieve profile data — use the UserInfo endpoint.
- **Do NOT** store or cache Google tokens server-side beyond the request lifecycle.
- **Do NOT** implement token refresh logic on the backend — that is the frontend's responsibility.
- **Do NOT** apply the auth middleware to `POST /auth/signin`.
- The Google Client ID used on the frontend must belong to the same Google Cloud project whose tokens the backend validates.

---

## State After Implementation

This section defines the expected observable state of the application once the auth system is fully implemented. Use it to verify correctness end-to-end.

### Login page (`/login`)
- Publicly accessible — no auth required.
- Contains a single call-to-action: **Sign in with Google** button.
- On click: initiates the Google OAuth2 implicit flow with `openid email profile` scopes.
- On success: calls `POST /auth/signin`, stores the returned user in client state, then **automatically redirects to the home page** (`/`).
- If the user is already authenticated when visiting `/login`: redirect immediately to `/` without showing the login UI.
- On error: display a human-readable error message inline (e.g. `invalid_token`, `sign_in_failed`).

### Route protection (frontend)
- All routes **except `/login`** are protected by a guard component that reads the auth state.
- If auth state has no user → redirect to `/login` (replace history entry, no back navigation to protected route).
- If auth state has a user → render the requested route.
- The guard reacts to state changes: logging out triggers an immediate redirect to `/login` without any page reload.

### Route protection (backend)
- All endpoints **except `POST /auth/signin`** are protected by the auth middleware/filter.
- The middleware runs before any route handler, extracts the Bearer token, validates it, and resolves the user from the database.
- The resolved user is attached to the request context and available to all downstream handlers.
- `POST /auth/signin` is excluded from the middleware entirely — it is self-validating.

### Home page (`/`)
- Accessible only when authenticated.
- Contains a **top navigation bar** that is always visible (sticky/fixed). The nav bar must include:
  - App logo and name (left side).
  - User identity section (right side): profile picture (or initials fallback if null), display name, email.
  - **Logout button** — on click: clears all client-side auth state (token + user record). The route guard immediately redirects to `/login`.
- The profile picture must render with `referrerpolicy="no-referrer"` to avoid Google's 403 block.
- The nav bar must be usable on mobile: on small screens, collapse the name/email but always keep the avatar and logout control visible and tappable.
