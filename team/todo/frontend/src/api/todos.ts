import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  ApiResponse,
  ApiErrorResponse,
} from "shared/src/types";

const BASE_URL = "/api/todos";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body: ApiErrorResponse = await res.json().catch(() => ({
      error: `Request failed with status ${res.status}`,
    }));
    throw new Error(body.error);
  }
  const json: ApiResponse<T> = await res.json();
  return json.data;
}

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(BASE_URL);
  return handleResponse<Todo[]>(res);
}

export async function createTodo(req: CreateTodoRequest): Promise<Todo> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  return handleResponse<Todo>(res);
}

export async function updateTodo(
  id: number,
  req: UpdateTodoRequest
): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  return handleResponse<Todo>(res);
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body: ApiErrorResponse = await res.json().catch(() => ({
      error: `Request failed with status ${res.status}`,
    }));
    throw new Error(body.error);
  }
}
