import { NavLink, Route, Routes } from "react-router-dom";
import TodoDetailPage from "./pages/TodoDetailPage";
import TodosPage from "./pages/TodosPage";

function navClassName({ isActive }: { isActive: boolean }) {
  return [
    "rounded-full px-4 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-slate-950 text-white"
      : "border border-slate-300 text-slate-700 hover:border-slate-950 hover:text-slate-950",
  ].join(" ");
}

function App() {
  return (
    <main className="min-h-screen px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/60 bg-white/55 p-6 shadow-[0_20px_80px_rgba(20,33,61,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-800">
                React Query Todos
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Client-side routing is now enabled, so navigating between pages
                no longer triggers a browser reload.
              </p>
            </div>

            <nav className="flex flex-wrap gap-2">
              <NavLink className={navClassName} to="/">
                Todo list
              </NavLink>
              <NavLink className={navClassName} to="/cache-notes">
                Cache notes
              </NavLink>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<TodosPage />} />
          <Route path="/todos/:todoId" element={<TodoDetailPage />} />
          <Route
            path="/cache-notes"
            element={
              <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_20px_80px_rgba(20,33,61,0.08)]">
                <h1 className="text-3xl font-black tracking-tight text-slate-950">
                  How to test staleTime
                </h1>
                <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
                  <p>
                    1. Load the todo list route and wait for the query to finish.
                  </p>
                  <p>
                    2. Open a detail route, then navigate back with the app links
                    or browser back button.
                  </p>
                  <p>
                    3. Repeat within the configured stale window and compare the
                    Network tab against a full browser refresh.
                  </p>
                  <p>
                    4. After the stale window expires, revisit the route and
                    observe the query refetch behavior.
                  </p>
                </div>
              </section>
            }
          />
        </Routes>
      </div>
    </main>
  );
}

export default App;
