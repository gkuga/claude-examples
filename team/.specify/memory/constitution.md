<!-- Sync Impact Report
  Version change: 0.0.0 → 1.0.0 (initial ratification)
  Added principles:
    - I. Simplicity First
    - II. Monorepo Structure
    - III. Test-Required
    - IV. Type Safety
  Added sections:
    - Technology Stack
    - Development Workflow
  Templates requiring updates:
    - plan-template.md: ✅ no changes needed (already supports web app structure)
    - spec-template.md: ✅ no changes needed
    - tasks-template.md: ✅ no changes needed (already supports web app path conventions)
  Follow-up TODOs: none
-->

# Todo App Constitution

## Core Principles

### I. Simplicity First

- Every feature MUST use the simplest implementation that satisfies requirements
- No premature abstractions: three similar lines of code are better than a helper used once
- YAGNI (You Aren't Gonna Need It) strictly enforced
- No feature flags, backwards-compatibility shims, or over-engineered patterns unless explicitly justified

### II. Monorepo Structure

- The repository MUST use a two-directory monorepo layout: `frontend/` and `backend/`
- Frontend and backend MUST communicate exclusively via REST API
- Shared type definitions MUST live in `shared/` directory to ensure API contract consistency
- Each directory MUST be independently buildable and testable

### III. Test-Required

- All features MUST have tests written with Vitest
- Backend API endpoints MUST have integration tests
- Frontend components MUST have unit tests for business logic
- Tests MUST pass before any task is considered complete

### IV. Type Safety

- TypeScript strict mode MUST be enabled in all packages
- API request/response types MUST be shared between frontend and backend via `shared/`
- `any` type is prohibited unless explicitly justified with a comment

## Technology Stack

- **Language**: TypeScript 5.x (strict mode)
- **Frontend**: React 19 with Vite
- **Backend**: Express.js
- **Database**: SQLite via better-sqlite3 (synchronous, simple, no ORM)
- **Testing**: Vitest for both frontend and backend
- **Package Manager**: npm with workspaces
- **Linting**: ESLint + Prettier

## Development Workflow

- Each agent works on an isolated task or user story
- Tasks marked [P] can be executed in parallel by different agents
- Agents MUST NOT modify files assigned to other agents' active tasks
- All code changes MUST compile without errors before marking a task complete
- Commit after each completed task with a descriptive message

## Governance

- This constitution supersedes all ad-hoc decisions during development
- Amendments require explicit user approval
- All tasks and implementations MUST verify compliance with these principles
- Complexity additions MUST be justified in the plan's Complexity Tracking table

**Version**: 1.0.0 | **Ratified**: 2026-03-10 | **Last Amended**: 2026-03-10
