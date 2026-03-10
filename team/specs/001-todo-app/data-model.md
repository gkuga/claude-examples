# Data Model: Todo App

## Entities

### Todo

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 一意識別子 |
| title | TEXT | NOT NULL, max 200 chars | Todoのタイトル |
| completed | INTEGER | NOT NULL, DEFAULT 0 | 完了状態（0=未完了, 1=完了） |
| created_at | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時（ISO 8601） |

### SQLite Schema

```sql
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL CHECK(length(title) <= 200 AND length(trim(title)) > 0),
  completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## TypeScript Types (shared/src/types.ts)

```typescript
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  completed: boolean;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: string;
}
```

## State Transitions

```
[未完了] --toggle--> [完了]
[完了]   --toggle--> [未完了]
[任意の状態] --delete--> [削除済み（DBから物理削除）]
```

## Validation Rules

- title: 空文字・空白のみは拒否、最大200文字
- completed: boolean値のみ（DB上は0/1）
- id: 正の整数のみ
