import { describe, it, expect, beforeEach, afterAll } from "vitest";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// テスト用の一時DBを使用
const testDbPath = path.join(os.tmpdir(), `todo-test-${Date.now()}.db`);
const db = new Database(testDbPath);

// スキーマ初期化
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK(length(title) <= 200 AND length(trim(title)) > 0),
    completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

interface TodoRow {
  id: number;
  title: string;
  completed: number;
  created_at: string;
}

afterAll(() => {
  db.close();
  try {
    fs.unlinkSync(testDbPath);
  } catch {
    // ignore cleanup errors
  }
});

describe("Todos DB操作", () => {
  beforeEach(() => {
    db.exec("DELETE FROM todos");
  });

  describe("Todoの作成 (INSERT)", () => {
    it("titleを指定してTodoを挿入できること", () => {
      const stmt = db.prepare("INSERT INTO todos (title) VALUES (?)");
      const result = stmt.run("買い物に行く");
      expect(result.changes).toBe(1);
      expect(result.lastInsertRowid).toBeGreaterThan(0);
    });

    it("挿入したTodoのcompletedのデフォルト値が0であること", () => {
      db.prepare("INSERT INTO todos (title) VALUES (?)").run("買い物に行く");
      const row = db
        .prepare("SELECT * FROM todos WHERE title = ?")
        .get("買い物に行く") as TodoRow;
      expect(row.completed).toBe(0);
    });

    it("挿入したTodoのcreated_atが自動設定されること", () => {
      db.prepare("INSERT INTO todos (title) VALUES (?)").run("洗濯をする");
      const row = db
        .prepare("SELECT * FROM todos WHERE title = ?")
        .get("洗濯をする") as TodoRow;
      expect(row.created_at).toBeTruthy();
    });

    it("空文字のtitleはDBレベルのCHECK制約でエラーになること", () => {
      const stmt = db.prepare("INSERT INTO todos (title) VALUES (?)");
      expect(() => stmt.run("")).toThrow();
    });

    it("空白のみのtitleはDBレベルのCHECK制約でエラーになること", () => {
      const stmt = db.prepare("INSERT INTO todos (title) VALUES (?)");
      expect(() => stmt.run("   ")).toThrow();
    });

    it("200文字を超えるtitleはDBレベルのCHECK制約でエラーになること", () => {
      const longTitle = "あ".repeat(201);
      const stmt = db.prepare("INSERT INTO todos (title) VALUES (?)");
      expect(() => stmt.run(longTitle)).toThrow();
    });

    it("200文字ちょうどのtitleは挿入できること", () => {
      const title200 = "あ".repeat(200);
      const stmt = db.prepare("INSERT INTO todos (title) VALUES (?)");
      const result = stmt.run(title200);
      expect(result.changes).toBe(1);
    });
  });

  describe("全件取得 (SELECT)", () => {
    it("Todoが0件の場合、空配列が返ること", () => {
      const rows = db.prepare("SELECT * FROM todos").all() as TodoRow[];
      expect(rows).toEqual([]);
    });

    it("複数のTodoを挿入後、全件取得できること", () => {
      const stmt = db.prepare("INSERT INTO todos (title) VALUES (?)");
      stmt.run("買い物に行く");
      stmt.run("掃除をする");
      stmt.run("料理を作る");

      const rows = db
        .prepare("SELECT * FROM todos ORDER BY id DESC")
        .all() as TodoRow[];
      expect(rows).toHaveLength(3);
      expect(rows[0].title).toBe("料理を作る");
      expect(rows[1].title).toBe("掃除をする");
      expect(rows[2].title).toBe("買い物に行く");
    });

    it("取得した行にid, title, completed, created_atが含まれること", () => {
      db.prepare("INSERT INTO todos (title) VALUES (?)").run("テスト項目");
      const row = db.prepare("SELECT * FROM todos").get() as TodoRow;
      expect(row).toHaveProperty("id");
      expect(row).toHaveProperty("title", "テスト項目");
      expect(row).toHaveProperty("completed", 0);
      expect(row).toHaveProperty("created_at");
    });
  });

  describe("completedの更新 (UPDATE)", () => {
    it("completedを0から1に更新できること", () => {
      const insertResult = db
        .prepare("INSERT INTO todos (title) VALUES (?)")
        .run("買い物に行く");
      const id = insertResult.lastInsertRowid;

      db.prepare("UPDATE todos SET completed = ? WHERE id = ?").run(1, id);

      const row = db
        .prepare("SELECT * FROM todos WHERE id = ?")
        .get(id) as TodoRow;
      expect(row.completed).toBe(1);
    });

    it("completedを1から0に戻せること", () => {
      const insertResult = db
        .prepare("INSERT INTO todos (title) VALUES (?)")
        .run("買い物に行く");
      const id = insertResult.lastInsertRowid;

      db.prepare("UPDATE todos SET completed = ? WHERE id = ?").run(1, id);
      db.prepare("UPDATE todos SET completed = ? WHERE id = ?").run(0, id);

      const row = db
        .prepare("SELECT * FROM todos WHERE id = ?")
        .get(id) as TodoRow;
      expect(row.completed).toBe(0);
    });

    it("存在しないidの更新はchangesが0であること", () => {
      const result = db
        .prepare("UPDATE todos SET completed = ? WHERE id = ?")
        .run(1, 99999);
      expect(result.changes).toBe(0);
    });
  });

  describe("削除 (DELETE)", () => {
    it("挿入したTodoを削除できること", () => {
      const insertResult = db
        .prepare("INSERT INTO todos (title) VALUES (?)")
        .run("買い物に行く");
      const id = insertResult.lastInsertRowid;

      const result = db.prepare("DELETE FROM todos WHERE id = ?").run(id);
      expect(result.changes).toBe(1);
    });

    it("削除後にそのTodoが取得できないこと", () => {
      const insertResult = db
        .prepare("INSERT INTO todos (title) VALUES (?)")
        .run("掃除をする");
      const id = insertResult.lastInsertRowid;

      db.prepare("DELETE FROM todos WHERE id = ?").run(id);

      const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);
      expect(row).toBeUndefined();
    });

    it("存在しないidの削除はchangesが0であること", () => {
      const result = db.prepare("DELETE FROM todos WHERE id = ?").run(99999);
      expect(result.changes).toBe(0);
    });

    it("削除後も他のTodoには影響しないこと", () => {
      const stmt = db.prepare("INSERT INTO todos (title) VALUES (?)");
      stmt.run("買い物に行く");
      const result2 = stmt.run("掃除をする");
      const id2 = result2.lastInsertRowid;

      db.prepare("DELETE FROM todos WHERE id = ?").run(id2);

      const rows = db.prepare("SELECT * FROM todos").all() as TodoRow[];
      expect(rows).toHaveLength(1);
      expect(rows[0].title).toBe("買い物に行く");
    });
  });
});
