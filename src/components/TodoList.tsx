import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listTodos } from "../lib/todo-api";

export default function TodoList() {
  // const queryClient = useQueryClient();

  const { status, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: listTodos,
    staleTime: 15000,
  }); // Queries

  if (status === "pending") {
    return (
      <div className="py-16 text-center text-slate-500">Loading todos...</div>
    );
  }

  if (status === "error") {
    return (
      <div className="py-16 text-center text-red-500">
        failed to get todo list: ${JSON.stringify(error)}
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold text-slate-700">No todos yet.</p>
        <p className="mt-2 text-sm text-slate-500">
          Create your first item and it will be written to the JSON store.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-5 space-y-4">
      {data?.map((todo) => {
        // const isEditing = editingId === todo.id;
        // const isBusy = pendingTodoId === todo.id;
        const isEditing = false;
        const isBusy = false;

        return (
          <li
            key={todo.id}
            className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <button
                  type="button"
                  aria-label={
                    todo.completed ? "Mark as incomplete" : "Mark as complete"
                  }
                  className={`mt-1 size-6 rounded-full border-2 transition ${
                    todo.completed
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300 bg-white"
                  }`}
                  // onClick={() => void handleToggle(todo)}
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
                        // value={editingTitle}
                        onChange={(event) => {
                          // setEditingTitle(event.target.value);
                        }}
                        disabled={isBusy}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                          // onClick={() => void handleSave(todo)}
                          disabled={isBusy}
                        >
                          {isBusy ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                          // onClick={cancelEditing}
                          disabled={isBusy}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p
                        className={`break-words text-lg font-semibold ${
                          todo.completed
                            ? "text-slate-400 line-through"
                            : "text-slate-900"
                        }`}
                      >
                        {todo.title}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                        Updated {new Date(todo.updatedAt).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {!isEditing ? (
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                    // onClick={() => beginEditing(todo)}
                    disabled={isBusy}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                    // onClick={() => void handleDelete(todo)}
                    disabled={isBusy}
                  >
                    {isBusy ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
