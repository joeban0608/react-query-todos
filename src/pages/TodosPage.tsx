import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  createTodo,
  deleteTodo,
  listTodos,
  updateTodo,
} from "../lib/todo-api";
import { queryClient, TODO_STALE_TIME } from "../lib/query-client";
import type { Todo } from "../types/todo";

export default function TodosPage() {
  const [draftTitle, setDraftTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: listTodos,
  });

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: async () => {
      setDraftTitle("");
      setFormMessage(null);
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Todo> }) =>
      updateTodo(id, payload),
    onSuccess: async (todo) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["todos"] }),
        queryClient.invalidateQueries({ queryKey: ["todo", todo.id] }),
      ]);
      if (editingId === todo.id) {
        setEditingId(null);
        setEditingTitle("");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["todos"] }),
        queryClient.removeQueries({ queryKey: ["todo", id] }),
      ]);
      if (editingId === id) {
        setEditingId(null);
        setEditingTitle("");
      }
    },
  });

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draftTitle.trim()) {
      setFormMessage("Please enter a todo title.");
      return;
    }

    await createMutation.mutateAsync({ title: draftTitle.trim() });
  }

  function beginEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
    setFormMessage(null);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingTitle("");
    setFormMessage(null);
  }

  async function handleSave(todo: Todo) {
    if (!editingTitle.trim()) {
      setFormMessage("Title cannot be blank.");
      return;
    }

    await updateMutation.mutateAsync({
      id: todo.id,
      payload: { title: editingTitle.trim() },
    });
  }

  async function handleToggle(todo: Todo) {
    await updateMutation.mutateAsync({
      id: todo.id,
      payload: { completed: !todo.completed },
    });
  }

  if (todosQuery.isPending) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_20px_80px_rgba(20,33,61,0.08)]">
        <div className="py-16 text-center text-slate-500">Loading todos...</div>
      </section>
    );
  }

  if (todosQuery.isError) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_20px_80px_rgba(20,33,61,0.08)]">
        <div className="py-16 text-center text-rose-600">
          {(todosQuery.error as Error).message}
        </div>
      </section>
    );
  }

  const todos = todosQuery.data;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-amber-950/10 bg-white/80 shadow-[0_20px_80px_rgba(20,33,61,0.12)] backdrop-blur">
        <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
          <div className="space-y-5">
            <p className="inline-flex rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-900">
              React Query staleTime demo
            </p>
            <div className="space-y-3">
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Navigate between routes without a full reload.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Queries in this app use a shared <code className="rounded bg-slate-950 px-1.5 py-0.5 text-sm text-amber-200">staleTime</code>{" "}
                of {TODO_STALE_TIME / 1000} seconds, so route changes stay inside
                the same SPA session.
              </p>
            </div>

            <form
              className="flex flex-col gap-3 rounded-[1.5rem] bg-slate-950 p-4 text-white sm:flex-row"
              onSubmit={(event) => void handleCreate(event)}
            >
              <label className="sr-only" htmlFor="todo-title">
                Todo title
              </label>
              <input
                id="todo-title"
                className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none placeholder:text-slate-300 focus:border-amber-300"
                placeholder="Create one, then click into its detail page"
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                disabled={createMutation.isPending}
              />
              <button
                className="rounded-2xl bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-amber-100"
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Saving..." : "Create todo"}
              </button>
            </form>

            {formMessage ? (
              <p className="text-sm font-medium text-rose-600">{formMessage}</p>
            ) : null}
            {createMutation.isError ? (
              <p className="text-sm font-medium text-rose-600">
                {(createMutation.error as Error).message}
              </p>
            ) : null}
          </div>

          <div className="rounded-[1.75rem] bg-linear-to-br from-amber-300 via-yellow-100 to-white p-5 text-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-700">
              Try this
            </p>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li>Open a todo detail page.</li>
              <li>Use the browser back button or nav link to return here.</li>
              <li>Navigate again within {TODO_STALE_TIME / 1000} seconds.</li>
              <li>Watch React Query reuse cache instead of hard reloading.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-[0_20px_80px_rgba(20,33,61,0.08)] backdrop-blur sm:p-7">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Todos
            </h2>
            <p className="text-sm text-slate-500">
              {todos.length} item{todos.length === 1 ? "" : "s"} stored locally
            </p>
          </div>
        </div>

        {todos.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-slate-700">No todos yet.</p>
            <p className="mt-2 text-sm text-slate-500">
              Create one and then click into its detail route to test cache reuse.
            </p>
          </div>
        ) : (
          <ul className="mt-5 space-y-4">
            {todos.map((todo) => {
              const isEditing = editingId === todo.id;
              const isUpdating = updateMutation.isPending && updateMutation.variables?.id === todo.id;
              const isDeleting = deleteMutation.isPending && deleteMutation.variables === todo.id;
              const isBusy = isUpdating || isDeleting;

              return (
                <li
                  key={todo.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <button
                        type="button"
                        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                        className={`mt-1 size-6 rounded-full border-2 transition ${
                          todo.completed
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-slate-300 bg-white"
                        }`}
                        onClick={() => void handleToggle(todo)}
                        disabled={isBusy}
                      >
                        <span className="sr-only">
                          {todo.completed ? "Completed" : "Pending"}
                        </span>
                      </button>

                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-slate-950"
                              value={editingTitle}
                              onChange={(event) => setEditingTitle(event.target.value)}
                              disabled={isBusy}
                            />
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                                onClick={() => void handleSave(todo)}
                                disabled={isBusy}
                              >
                                {isUpdating ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                                onClick={cancelEditing}
                                disabled={isBusy}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Link
                              className={`break-words text-lg font-semibold hover:underline ${
                                todo.completed
                                  ? "text-slate-400 line-through"
                                  : "text-slate-900"
                              }`}
                              to={`/todos/${todo.id}`}
                            >
                              {todo.title}
                            </Link>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                              Updated {new Date(todo.updatedAt).toLocaleString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {!isEditing ? (
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <Link
                          className="rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:border-amber-500"
                          to={`/todos/${todo.id}`}
                        >
                          Open detail
                        </Link>
                        <button
                          type="button"
                          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                          onClick={() => beginEditing(todo)}
                          disabled={isBusy}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                          onClick={() => deleteMutation.mutate(todo.id)}
                          disabled={isBusy}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
