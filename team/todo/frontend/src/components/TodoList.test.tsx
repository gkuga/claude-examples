import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TodoList from "./TodoList";
import type { Todo } from "shared/src/types";

describe("TodoList", () => {
  it("todosが空の場合「Todoがありません」が表示されること", () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Todoがありません")).toBeInTheDocument();
  });

  it("todosが空の場合リストが表示されないこと", () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("todosがある場合、全アイテムが表示されること", () => {
    const todos: Todo[] = [
      {
        id: 1,
        title: "買い物に行く",
        completed: false,
        createdAt: "2026-03-10T12:00:00.000Z",
      },
      {
        id: 2,
        title: "掃除をする",
        completed: true,
        createdAt: "2026-03-10T13:00:00.000Z",
      },
      {
        id: 3,
        title: "料理を作る",
        completed: false,
        createdAt: "2026-03-10T14:00:00.000Z",
      },
    ];
    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("買い物に行く")).toBeInTheDocument();
    expect(screen.getByText("掃除をする")).toBeInTheDocument();
    expect(screen.getByText("料理を作る")).toBeInTheDocument();
  });

  it("todosの数だけチェックボックスが表示されること", () => {
    const todos: Todo[] = [
      {
        id: 1,
        title: "買い物に行く",
        completed: false,
        createdAt: "2026-03-10T12:00:00.000Z",
      },
      {
        id: 2,
        title: "掃除をする",
        completed: true,
        createdAt: "2026-03-10T13:00:00.000Z",
      },
    ];
    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
  });
});
