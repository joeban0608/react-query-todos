import { useEffect, useEffectEvent, useState } from 'react'
import { createTodo, deleteTodo, listTodos, updateTodo } from './lib/todo-api'
import type { Todo } from './types/todo'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [draftTitle, setDraftTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [pendingTodoId, setPendingTodoId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formMessage, setFormMessage] = useState<string | null>(null)

  const loadTodos = useEffectEvent(async () => {
    try {
      setErrorMessage(null)
      const nextTodos = await listTodos()
      setTodos(nextTodos)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to load todos.',
      )
    } finally {
      setLoading(false)
    }
  })

  useEffect(() => {
    void loadTodos()
  }, [])

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!draftTitle.trim()) {
      setFormMessage('Please enter a todo title.')
      return
    }

    try {
      setSubmitting(true)
      setFormMessage(null)
      setErrorMessage(null)
      const createdTodo = await createTodo({ title: draftTitle })
      setTodos((currentTodos) => [createdTodo, ...currentTodos])
      setDraftTitle('')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to create todo.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  function beginEditing(todo: Todo) {
    setEditingId(todo.id)
    setEditingTitle(todo.title)
    setFormMessage(null)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditingTitle('')
    setFormMessage(null)
  }

  async function handleToggle(todo: Todo) {
    try {
      setPendingTodoId(todo.id)
      setErrorMessage(null)
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      })
      setTodos((currentTodos) =>
        currentTodos.map((item) => (item.id === todo.id ? updatedTodo : item)),
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to update todo.',
      )
    } finally {
      setPendingTodoId(null)
    }
  }

  async function handleSave(todo: Todo) {
    if (!editingTitle.trim()) {
      setFormMessage('Title cannot be blank.')
      return
    }

    try {
      setPendingTodoId(todo.id)
      setFormMessage(null)
      setErrorMessage(null)
      const updatedTodo = await updateTodo(todo.id, { title: editingTitle })
      setTodos((currentTodos) =>
        currentTodos.map((item) => (item.id === todo.id ? updatedTodo : item)),
      )
      cancelEditing()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to save todo.',
      )
      setPendingTodoId(null)
    }
  }

  async function handleDelete(todo: Todo) {
    try {
      setPendingTodoId(todo.id)
      setErrorMessage(null)
      await deleteTodo(todo.id)
      setTodos((currentTodos) =>
        currentTodos.filter((item) => item.id !== todo.id),
      )
      if (editingId === todo.id) {
        cancelEditing()
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to delete todo.',
      )
    } finally {
      setPendingTodoId(null)
    }
  }

  return (
    <main className="min-h-screen px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-amber-950/10 bg-white/80 shadow-[0_20px_80px_rgba(20,33,61,0.12)] backdrop-blur">
          <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <p className="inline-flex rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-900">
                File-system CRUD practice
              </p>
              <div className="space-y-3">
                <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  Build todos against a real local API before React Query.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  This screen talks to <code className="rounded bg-slate-950 px-1.5 py-0.5 text-sm text-amber-200">/api/todos</code>,
                  and the server persists every change to a JSON file in the repo.
                </p>
              </div>

              <form
                className="flex flex-col gap-3 rounded-[1.5rem] bg-slate-950 p-4 text-white sm:flex-row"
                onSubmit={handleCreate}
              >
                <label className="sr-only" htmlFor="todo-title">
                  Todo title
                </label>
                <input
                  id="todo-title"
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none placeholder:text-slate-300 focus:border-amber-300"
                  placeholder="Add a todo like “Draft the React Query migration plan”"
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  disabled={submitting}
                />
                <button
                  className="rounded-2xl bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-amber-100"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Create todo'}
                </button>
              </form>

              {formMessage ? (
                <p className="text-sm font-medium text-rose-600">{formMessage}</p>
              ) : null}
              {errorMessage ? (
                <p className="text-sm font-medium text-rose-600">{errorMessage}</p>
              ) : null}
            </div>

            <div className="rounded-[1.75rem] bg-linear-to-br from-amber-300 via-yellow-100 to-white p-5 text-slate-900">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-700">
                API contract
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <li><strong>GET</strong> `/api/todos` loads persisted todos.</li>
                <li><strong>POST</strong> creates a new record with timestamps.</li>
                <li><strong>PATCH</strong> updates title or completed state.</li>
                <li><strong>DELETE</strong> removes the todo from disk.</li>
              </ul>
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
                {todos.length} item{todos.length === 1 ? '' : 's'} stored locally
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500">Loading todos...</div>
          ) : todos.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold text-slate-700">
                No todos yet.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Create your first item and it will be written to the JSON store.
              </p>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {todos.map((todo) => {
                const isEditing = editingId === todo.id
                const isBusy = pendingTodoId === todo.id

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
                            todo.completed ? 'Mark as incomplete' : 'Mark as complete'
                          }
                          className={`mt-1 size-6 rounded-full border-2 transition ${
                            todo.completed
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-slate-300 bg-white'
                          }`}
                          onClick={() => void handleToggle(todo)}
                          disabled={isBusy}
                        >
                          <span className="sr-only">
                            {todo.completed ? 'Completed' : 'Pending'}
                          </span>
                        </button>

                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <div className="space-y-3">
                              <input
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-slate-950"
                                value={editingTitle}
                                onChange={(event) =>
                                  setEditingTitle(event.target.value)
                                }
                                disabled={isBusy}
                              />
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                                  onClick={() => void handleSave(todo)}
                                  disabled={isBusy}
                                >
                                  {isBusy ? 'Saving...' : 'Save'}
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
                              <p
                                className={`break-words text-lg font-semibold ${
                                  todo.completed
                                    ? 'text-slate-400 line-through'
                                    : 'text-slate-900'
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
                            onClick={() => beginEditing(todo)}
                            disabled={isBusy}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                            onClick={() => void handleDelete(todo)}
                            disabled={isBusy}
                          >
                            {isBusy ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
