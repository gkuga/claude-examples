import { Router } from "express";
import { getDb } from "../db.js";
import type { Todo } from "shared";

interface TodoRow {
  id: number;
  title: string;
  completed: number;
  created_at: string;
}

function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
    createdAt: row.created_at,
  };
}

const router = Router();

// GET /api/todos
router.get("/", (_req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM todos ORDER BY id DESC").all() as TodoRow[];
    res.json({ data: rows.map(rowToTodo) });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/todos
router.post("/", (req, res) => {
  try {
    const { title } = req.body;

    if (
      typeof title !== "string" ||
      title.trim().length === 0 ||
      title.length > 200
    ) {
      res
        .status(400)
        .json({ error: "Title is required and must be 200 characters or less" });
      return;
    }

    const db = getDb();
    const result = db
      .prepare("INSERT INTO todos (title) VALUES (?)")
      .run(title.trim());

    const row = db
      .prepare("SELECT * FROM todos WHERE id = ?")
      .get(result.lastInsertRowid) as TodoRow;

    res.status(201).json({ data: rowToTodo(row) });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/todos/:id
router.patch("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const { completed } = req.body;
    if (typeof completed !== "boolean") {
      res.status(400).json({ error: "Completed must be a boolean" });
      return;
    }

    const db = getDb();
    const existing = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);
    if (!existing) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    db.prepare("UPDATE todos SET completed = ? WHERE id = ?").run(
      completed ? 1 : 0,
      id
    );

    const row = db
      .prepare("SELECT * FROM todos WHERE id = ?")
      .get(id) as TodoRow;

    res.json({ data: rowToTodo(row) });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/todos/:id
router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const db = getDb();
    const result = db.prepare("DELETE FROM todos WHERE id = ?").run(id);

    if (result.changes === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
