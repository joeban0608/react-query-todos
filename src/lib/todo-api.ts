import type { CreateTodoInput, Todo, UpdateTodoInput } from "../types/todo";
import { sleep } from "./constants";

interface ApiErrorPayload {
  message?: string;
}

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const payload = (await response
      .json()
      .catch(() => null)) as ApiErrorPayload | null;
    throw new Error(payload?.message ?? "Request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function listTodos() {
  await sleep(2000);
  return request<Todo[]>("/api/todos");
}

export function createTodo(input: CreateTodoInput) {
  return request<Todo>("/api/todos", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTodo(id: string, input: UpdateTodoInput) {
  return request<Todo>(`/api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTodo(id: string) {
  return request<{ success: true }>(`/api/todos/${id}`, {
    method: "DELETE",
  });
}
