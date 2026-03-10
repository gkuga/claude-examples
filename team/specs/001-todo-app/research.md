# Research: Todo App

## Decision 1: Database Access Pattern

**Decision**: better-sqlite3 を直接使用（同期API）
**Rationale**: Constitution で「Simplicity First」「no ORM」と定められている。better-sqlite3は同期APIで、async/awaitのオーバーヘッドがなく、単純なCRUDに最適。
**Alternatives considered**:
- Drizzle ORM: 型安全だが、1テーブルのCRUDにはオーバーヘッド
- Knex: クエリビルダーだが、直接SQLで十分
- Prisma: 重量級、このスケールには不適切

## Decision 2: Frontend State Management

**Decision**: React useStateによるローカルステート + カスタムフック（useTodos）
**Rationale**: Todo一覧は単一コンポーネントツリーで完結する。グローバルステート管理は不要。
**Alternatives considered**:
- Redux/Zustand: グローバルステートは不要、YAGNI
- React Query/TanStack Query: サーバーステート管理には優秀だが、依存追加の正当性が薄い
- useReducer: useStateで十分なシンプルさ

## Decision 3: API Communication

**Decision**: fetch API を直接使用
**Rationale**: ブラウザ標準API。5エンドポイントのCRUDに外部ライブラリは不要。
**Alternatives considered**:
- Axios: fetchで十分、依存追加の理由がない

## Decision 4: CSS Approach

**Decision**: CSSモジュール（Vite標準サポート）
**Rationale**: Viteが標準でサポート。追加依存なし。スコープされたスタイル。
**Alternatives considered**:
- Tailwind CSS: 依存追加、このスケールには過剰
- styled-components: ランタイムコスト、依存追加
- インラインスタイル: メンテナンス性が低い

## Decision 5: Project Configuration

**Decision**: npm workspaces でモノレポ管理
**Rationale**: Constitution指定。shared型をfrontend/backendから参照可能。
**Alternatives considered**:
- Turborepo/Nx: 3パッケージにはオーバーヘッド
- 手動パス参照: workspacesの方がクリーン
