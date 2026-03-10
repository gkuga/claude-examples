# Implementation Plan: Todo App

**Branch**: `001-todo-app` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-app/spec.md`

## Summary

シンプルなTodo SPAアプリ。React + Viteフロントエンドから Express REST APIを経由してSQLiteにデータを永続化する。CRUD操作とクライアントサイドフィルタリングを実装する。

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: React 19, Vite, Express.js, better-sqlite3
**Storage**: SQLite via better-sqlite3
**Testing**: Vitest (frontend + backend)
**Target Platform**: Web browser (SPA) + Node.js server
**Project Type**: Web application (frontend + backend)
**Performance Goals**: ページ読み込み2秒以内、CRUD操作1秒以内
**Constraints**: 認証不要、単一ユーザー、数百件以下のTodo
**Scale/Scope**: 単一リスト、1テーブル、5エンドポイント

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | PASS | 最小限のCRUD。ORM不使用、better-sqlite3で直接クエリ |
| II. Monorepo Structure | PASS | `todo/frontend/`, `todo/backend/`, `todo/shared/` |
| III. Test-Required | PASS | Vitest でbackend API統合テスト + frontend単体テスト |
| IV. Type Safety | PASS | strict mode、shared型定義 |

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
todo/
├── package.json              # npm workspaces root
├── shared/
│   └── src/
│       └── types.ts          # Todo型定義、APIレスポンス型
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── index.ts          # Express サーバーエントリポイント
│   │   ├── routes/
│   │   │   └── todos.ts      # Todo CRUD ルート
│   │   └── db.ts             # SQLite 初期化・クエリ
│   └── tests/
│       └── todos.test.ts     # API統合テスト
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.tsx          # Reactエントリポイント
│   │   ├── App.tsx           # メインコンポーネント
│   │   ├── components/
│   │   │   ├── TodoForm.tsx  # Todo入力フォーム
│   │   │   ├── TodoList.tsx  # Todo一覧
│   │   │   ├── TodoItem.tsx  # 個別Todo項目
│   │   │   └── FilterBar.tsx # フィルターボタン
│   │   ├── hooks/
│   │   │   └── useTodos.ts   # Todo状態管理カスタムフック
│   │   └── api/
│   │       └── todos.ts      # APIクライアント
│   └── tests/
│       └── useTodos.test.ts  # フック単体テスト
└── tsconfig.base.json        # 共通TypeScript設定
```

**Structure Decision**: ユーザー要求の `todo/` ディレクトリ配下にConstitution準拠のモノレポ構成を配置。shared型定義でフロントエンド・バックエンド間の型安全を確保。

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| なし | - | - |
