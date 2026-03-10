# API Contract: Todo App

Base URL: `http://localhost:3000/api`

## Endpoints

### GET /todos

全Todoを取得する。

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "title": "買い物に行く",
      "completed": false,
      "createdAt": "2026-03-10T12:00:00.000Z"
    }
  ]
}
```

---

### POST /todos

新しいTodoを作成する。

**Request Body**:
```json
{
  "title": "買い物に行く"
}
```

**Response**: `201 Created`
```json
{
  "data": {
    "id": 1,
    "title": "買い物に行く",
    "completed": false,
    "createdAt": "2026-03-10T12:00:00.000Z"
  }
}
```

**Error**: `400 Bad Request`
```json
{
  "error": "Title is required and must be 200 characters or less"
}
```

---

### PATCH /todos/:id

Todoの完了状態を更新する。

**Request Body**:
```json
{
  "completed": true
}
```

**Response**: `200 OK`
```json
{
  "data": {
    "id": 1,
    "title": "買い物に行く",
    "completed": true,
    "createdAt": "2026-03-10T12:00:00.000Z"
  }
}
```

**Error**: `404 Not Found`
```json
{
  "error": "Todo not found"
}
```

---

### DELETE /todos/:id

Todoを削除する。

**Response**: `204 No Content`

**Error**: `404 Not Found`
```json
{
  "error": "Todo not found"
}
```
