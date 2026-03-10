import { useEffect, useMemo, useState } from "react";
import type { Todo } from "shared/src/types";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api/todos";

export type FilterType = "all" | "active" | "completed";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTodos();
        if (!cancelled) {
          setTodos(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to fetch todos");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  async function addTodo(title: string): Promise<void> {
    try {
      setError(null);
      const todo = await createTodo({ title });
      setTodos((prev) => [...prev, todo]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create todo");
      throw e;
    }
  }

  async function toggleTodo(id: number): Promise<void> {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    try {
      setError(null);
      const updated = await updateTodo(id, { completed: !target.completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update todo");
      throw e;
    }
  }

  async function removeTodo(id: number): Promise<void> {
    try {
      setError(null);
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete todo");
      throw e;
    }
  }

  return {
    todos,
    filteredTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo: removeTodo,
    loading,
    error,
  };
}
