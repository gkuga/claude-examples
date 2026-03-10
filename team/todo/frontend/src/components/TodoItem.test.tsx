import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoItem from "./TodoItem";
import type { Todo } from "shared/src/types";

const baseTodo: Todo = {
  id: 1,
  title: "買い物に行く",
  completed: false,
  createdAt: "2026-03-10T12:00:00.000Z",
};

describe("TodoItem", () => {
  it("Todoのタイトルが表示されること", () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText("買い物に行く")).toBeInTheDocument();
  });

  it("未完了のTodoのチェックボックスがチェックされていないこと", () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it("完了済みのTodoのチェックボックスがチェックされていること", () => {
    const completedTodo: Todo = { ...baseTodo, completed: true };
    render(
      <TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it("チェックボックスクリックでonToggleがTodoのidで呼ばれること", () => {
    const onToggle = vi.fn();
    render(
      <TodoItem todo={baseTodo} onToggle={onToggle} onDelete={vi.fn()} />
    );
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith(1);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("削除ボタンクリックでonDeleteがTodoのidで呼ばれること", () => {
    const onDelete = vi.fn();
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={onDelete} />
    );
    fireEvent.click(screen.getByText("削除"));
    expect(onDelete).toHaveBeenCalledWith(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("完了済みTodoのタイトルに取り消し線スタイルがあること", () => {
    const completedTodo: Todo = { ...baseTodo, completed: true };
    render(
      <TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    const titleSpan = screen.getByText("買い物に行く");
    expect(titleSpan).toHaveStyle({ textDecoration: "line-through" });
  });

  it("未完了Todoのタイトルに取り消し線スタイルがないこと", () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    const titleSpan = screen.getByText("買い物に行く");
    expect(titleSpan).toHaveStyle({ textDecoration: "none" });
  });
});
