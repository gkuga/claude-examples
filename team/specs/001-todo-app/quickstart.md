# Quickstart: Todo App

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
cd todo
npm install
```

## Development

### Start backend (port 3000)

```bash
npm run dev:backend
```

### Start frontend (port 5173)

```bash
npm run dev:frontend
```

### Start both concurrently

```bash
npm run dev
```

## Testing

```bash
# All tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend
```

## Build

```bash
npm run build
```

## Project Structure

```
todo/
├── shared/       # Shared TypeScript types
├── backend/      # Express API server (port 3000)
└── frontend/     # React SPA (port 5173, proxies /api to backend)
```

## API

All endpoints under `http://localhost:3000/api`:

| Method | Path | Description |
|--------|------|-------------|
| GET | /todos | 全Todo取得 |
| POST | /todos | Todo作成 |
| PATCH | /todos/:id | 完了状態更新 |
| DELETE | /todos/:id | Todo削除 |
