# Workspaces

A **workspace** is an isolated data scope tied to a user. Every feature operates within the active workspace — data created in one workspace is invisible to another. Switching workspaces is equivalent to switching between independent environments under the same account.

## Core Rules

- Every user gets one default workspace on account creation.
- A user may have multiple workspaces but must always retain at least one they own.
- Each workspace has exactly one owner. Ownership cannot be transferred.

## CRUD

| Operation | Who can do it | Constraint |
|-----------|--------------|------------|
| Create    | Any authenticated user | No limit on count |
| Read      | Owner and shared members | Scoped to their membership |
| Update (rename) | Owner only | — |
| Delete    | Owner only | Blocked if it is the user's last owned workspace |

## Sharing

- An owner may share a workspace with other users by email.
- Shared members get full read/write access to workspace data.
- Shared members cannot delete the workspace.
- Deleting a workspace removes access for all shared members immediately and irreversibly.

## Active Workspace

At any point a user has one active workspace. All data operations are scoped to it. The active workspace is persisted client-side so it survives page reloads. On login, the last active workspace is restored; if it no longer exists, the first available workspace is used.

## UI/UX Access Pattern

Workspace management (create, rename, share, delete, switch) is intentionally **not exposed in primary navigation**. It is an advanced operation and should require deliberate navigation:

- The current workspace name is shown as **read-only context** on the main screen — informational, not interactive.
- All management actions are reached exclusively through **Settings**, accessed by clicking the user avatar/name in the top-right corner of the application.
- There is no workspace switcher, dropdown, or shortcut in the main navigation bar.
- This pattern keeps the primary interface clean and prevents accidental workspace changes.

## Isolation

Operations in one workspace have no effect on another. Features, logic, and UI are identical across workspaces — only the underlying data differs.
