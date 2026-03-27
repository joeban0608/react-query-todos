import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getTodo } from "../lib/todo-api";
import { TODO_STALE_TIME } from "../lib/query-client";

export default function TodoDetailPage() {
  const { todoId } = useParams();

  const todoQuery = useQuery({
    queryKey: ["todo", todoId],
    queryFn: () => getTodo(todoId!),
    enabled: Boolean(todoId),
  });

  if (!todoId) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_20px_80px_rgba(20,33,61,0.08)]">
        <p className="text-rose-600">Missing todo id.</p>
      </section>
    );
  }

  if (todoQuery.isPending) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_20px_80px_rgba(20,33,61,0.08)]">
        <div className="py-16 text-center text-slate-500">Loading todo detail...</div>
      </section>
    );
  }

  if (todoQuery.isError) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_20px_80px_rgba(20,33,61,0.08)]">
        <div className="space-y-4 py-10 text-center">
          <p className="text-rose-600">{(todoQuery.error as Error).message}</p>
          <Link className="font-semibold text-amber-800 underline" to="/">
            Back to todos
          </Link>
        </div>
      </section>
    );
  }

  const todo = todoQuery.data;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_20px_80px_rgba(20,33,61,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-800">
            Todo detail
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {todo.title}
          </h1>
        </div>
        <Link
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
          to="/"
        >
          Back to list
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Status
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {todo.completed ? "Completed" : "Pending"}
          </p>
        </article>
        <article className="rounded-[1.5rem] bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Created
          </p>
          <p className="mt-3 text-sm font-medium text-slate-800">
            {new Date(todo.createdAt).toLocaleString()}
          </p>
        </article>
        <article className="rounded-[1.5rem] bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Updated
          </p>
          <p className="mt-3 text-sm font-medium text-slate-800">
            {new Date(todo.updatedAt).toLocaleString()}
          </p>
        </article>
      </div>

      <div className="mt-8 rounded-[1.5rem] bg-amber-50 p-5 text-sm leading-7 text-slate-700">
        This route uses a separate query key,
        <code className="mx-1 rounded bg-slate-950 px-1.5 py-0.5 text-amber-200">
          ["todo", id]
        </code>
        with a shared stale time of {TODO_STALE_TIME / 1000} seconds. Navigate
        back to the list with client-side routing to compare cache behavior
        against a full browser refresh.
      </div>
    </section>
  );
}
