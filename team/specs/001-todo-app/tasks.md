# Tasks: Todo App

**Input**: Design documents from `/specs/001-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Included per Constitution principle III (Test-Required).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, monorepo structure, shared types

- [ ] T001 Create monorepo root with npm workspaces in todo/package.json
- [ ] T002 [P] Create shared package with Todo types in todo/shared/src/types.ts and todo/shared/package.json
- [ ] T003 [P] Create base TypeScript config in todo/tsconfig.base.json
- [ ] T004 [P] Initialize backend package with Express dependencies in todo/backend/package.json and todo/backend/tsconfig.json
- [ ] T005 [P] Initialize frontend package with React + Vite dependencies in todo/frontend/package.json, todo/frontend/tsconfig.json, todo/frontend/vite.config.ts, and todo/frontend/index.html

**Checkpoint**: All packages installable via `npm install` from todo/ root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database setup and Express server skeleton that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Implement SQLite database initialization and todo table creation in todo/backend/src/db.ts
- [ ] T007 Create Express server entry point with CORS and JSON middleware in todo/backend/src/index.ts
- [ ] T008 Create empty todo routes file with router export in todo/backend/src/routes/todos.ts and wire into server
- [ ] T009 [P] Create React app entry point with basic shell in todo/frontend/src/main.tsx and todo/frontend/src/App.tsx
- [ ] T010 [P] Create API client base with fetch wrapper in todo/frontend/src/api/todos.ts (empty functions for now)

**Checkpoint**: Backend starts on port 3000, frontend starts on port 5173 with proxy to backend, SQLite DB created on startup

---

## Phase 3: User Story 1 - Todoの作成と一覧表示 (Priority: P1) MVP

**Goal**: ユーザーがTodoを作成し、一覧に表示できる。ページ再読み込み後もデータが永続化されている。

**Independent Test**: Todoを1件作成し一覧に表示 → ページ再読み込み後もデータ保持を確認

### Tests for User Story 1

- [ ] T011 [P] [US1] Write API integration tests for GET /todos and POST /todos in todo/backend/tests/todos.test.ts
- [ ] T012 [P] [US1] Write unit test for useTodos hook (fetchTodos, addTodo) in todo/frontend/tests/useTodos.test.ts

### Implementation for User Story 1

- [ ] T013 [US1] Implement GET /todos endpoint (select all, map completed to boolean) in todo/backend/src/routes/todos.ts
- [ ] T014 [US1] Implement POST /todos endpoint (validate title, insert, return created todo) in todo/backend/src/routes/todos.ts
- [ ] T015 [US1] Implement fetchTodos and addTodo in API client in todo/frontend/src/api/todos.ts
- [ ] T016 [US1] Implement useTodos custom hook with state management for todo list and addTodo in todo/frontend/src/hooks/useTodos.ts
- [ ] T017 [P] [US1] Create TodoForm component (text input + submit button, empty validation) in todo/frontend/src/components/TodoForm.tsx
- [ ] T018 [P] [US1] Create TodoList component (renders list of TodoItem) in todo/frontend/src/components/TodoList.tsx
- [ ] T019 [P] [US1] Create TodoItem component (displays title, checkbox placeholder, delete placeholder) in todo/frontend/src/components/TodoItem.tsx
- [ ] T020 [US1] Wire TodoForm and TodoList into App.tsx, connect to useTodos hook in todo/frontend/src/App.tsx
- [ ] T021 [US1] Add CSS modules for App, TodoForm, TodoList, TodoItem in todo/frontend/src/components/*.module.css

**Checkpoint**: User Story 1 fully functional - create todos and see them listed, persisted across page reloads

---

## Phase 4: User Story 2 - Todoの完了/未完了切り替え (Priority: P2)

**Goal**: チェックボックスクリックで完了/未完了を切り替え、完了済みは取り消し線で表示

**Independent Test**: 未完了Todoをクリックで完了 → 再クリックで未完了に戻ることを確認

### Tests for User Story 2

- [ ] T022 [P] [US2] Add API integration test for PATCH /todos/:id in todo/backend/tests/todos.test.ts
- [ ] T023 [P] [US2] Add unit test for toggleTodo in useTodos hook in todo/frontend/tests/useTodos.test.ts

### Implementation for User Story 2

- [ ] T024 [US2] Implement PATCH /todos/:id endpoint (update completed, return updated todo) in todo/backend/src/routes/todos.ts
- [ ] T025 [US2] Implement toggleTodo in API client in todo/frontend/src/api/todos.ts
- [ ] T026 [US2] Add toggleTodo to useTodos hook in todo/frontend/src/hooks/useTodos.ts
- [ ] T027 [US2] Update TodoItem component: wire checkbox to toggle, add completed styling (strikethrough) in todo/frontend/src/components/TodoItem.tsx

**Checkpoint**: Todos can be toggled complete/incomplete with visual feedback, persisted to DB

---

## Phase 5: User Story 3 - Todoの削除 (Priority: P3)

**Goal**: 削除ボタンでTodoを削除、空一覧時は「Todoがありません」表示

**Independent Test**: Todoを削除して一覧から消え、最後の1件削除で空メッセージ表示を確認

### Tests for User Story 3

- [ ] T028 [P] [US3] Add API integration test for DELETE /todos/:id in todo/backend/tests/todos.test.ts
- [ ] T029 [P] [US3] Add unit test for deleteTodo in useTodos hook in todo/frontend/tests/useTodos.test.ts

### Implementation for User Story 3

- [ ] T030 [US3] Implement DELETE /todos/:id endpoint (delete row, 404 if not found) in todo/backend/src/routes/todos.ts
- [ ] T031 [US3] Implement deleteTodo in API client in todo/frontend/src/api/todos.ts
- [ ] T032 [US3] Add deleteTodo to useTodos hook in todo/frontend/src/hooks/useTodos.ts
- [ ] T033 [US3] Update TodoItem component: wire delete button to deleteTodo in todo/frontend/src/components/TodoItem.tsx
- [ ] T034 [US3] Add empty state message "Todoがありません" to TodoList when list is empty in todo/frontend/src/components/TodoList.tsx

**Checkpoint**: Todos can be deleted, empty list shows placeholder message

---

## Phase 6: User Story 4 - フィルタリング (Priority: P4)

**Goal**: 「すべて」「未完了」「完了済み」フィルターで表示を絞り込み

**Independent Test**: 完了・未完了混在時に各フィルターで正しく絞り込まれることを確認

### Tests for User Story 4

- [ ] T035 [P] [US4] Add unit test for filter logic in useTodos hook in todo/frontend/tests/useTodos.test.ts

### Implementation for User Story 4

- [ ] T036 [US4] Add filter state and filteredTodos computed value to useTodos hook in todo/frontend/src/hooks/useTodos.ts
- [ ] T037 [US4] Create FilterBar component (3 buttons: すべて/未完了/完了済み) in todo/frontend/src/components/FilterBar.tsx
- [ ] T038 [US4] Wire FilterBar into App.tsx, pass filteredTodos to TodoList in todo/frontend/src/App.tsx
- [ ] T039 [US4] Add CSS for FilterBar (active state highlight) in todo/frontend/src/components/FilterBar.module.css

**Checkpoint**: All filters work correctly, active filter visually highlighted

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation

- [ ] T040 Run all tests and fix any failures
- [ ] T041 Validate quickstart.md instructions work end-to-end
- [ ] T042 [P] Add dev scripts to root package.json (dev, dev:frontend, dev:backend, test, build)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Phase 2 completion
  - US1 (Phase 3): Can start after Phase 2
  - US2 (Phase 4): Can start after Phase 2 (independent of US1 at API level, but UI builds on TodoItem from US1)
  - US3 (Phase 5): Can start after Phase 2 (same as US2)
  - US4 (Phase 6): Can start after Phase 2 (frontend-only, independent)
- **Polish (Phase 7)**: Depends on all user stories complete

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- API endpoints before frontend API client
- API client before hooks
- Hooks before components
- Components before wiring into App

### Parallel Opportunities

- T002, T003, T004, T005 can all run in parallel (Phase 1)
- T009, T010 can run in parallel with T006-T008 (Phase 2)
- After Phase 2: US1 backend (T013-T014) and US1 frontend tests (T012) can run in parallel
- After Phase 2: US2, US3, US4 backend tasks could start in parallel with US1 if different agents work on different routes
- T017, T018, T019 can run in parallel (different component files)
- T022/T023, T028/T029, T035 test tasks can run in parallel

### Recommended Agent Assignment for Team Development

- **Agent A (Backend)**: T006-T008, T013-T014, T024, T030 — all backend routes and DB
- **Agent B (Frontend Components)**: T009, T017-T021, T027, T033-T034, T037-T039 — all React components and CSS
- **Agent C (Frontend Logic + Tests)**: T010, T015-T016, T025-T026, T031-T032, T036 — API client, hooks
- **Agent D (Tests)**: T011-T012, T022-T023, T028-T029, T035 — all test files

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Create and list todos, persist across reload
5. Deploy/demo if ready

### Parallel Team Strategy

1. All agents complete Phase 1 setup together
2. Agent A: Backend foundation (T006-T008)
3. Once foundation ready:
   - Agent A: Backend routes (T013-T014, T024, T030)
   - Agent B: Frontend components (T009, T017-T021, T027, T033-T034, T037-T039)
   - Agent C: Frontend logic (T010, T015-T016, T025-T026, T031-T032, T036)
   - Agent D: Tests (T011-T012, T022-T023, T028-T029, T035)
4. Phase 7: All agents validate and polish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
