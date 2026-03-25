import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'
import type { CreateTodoInput, Todo, UpdateTodoInput } from './src/types/todo'

const DATA_DIR = path.resolve(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'todos.json')

type JsonBody = Record<string, unknown> | null

function todoApiPlugin(): Plugin {
  const middleware = createTodoMiddleware()

  return {
    name: 'todo-api-plugin',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

function createTodoMiddleware(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const method = req.method ?? 'GET'
    const url = new URL(req.url ?? '/', 'http://localhost')

    if (!url.pathname.startsWith('/api/todos')) {
      next()
      return
    }

    try {
      if (url.pathname === '/api/todos' && method === 'GET') {
        await sendJson(res, 200, await readTodos())
        return
      }

      if (url.pathname === '/api/todos' && method === 'POST') {
        const body = (await readJsonBody(req)) as CreateTodoInput | null
        const title = validateTitle(body?.title)
        const todos = await readTodos()
        const now = new Date().toISOString()
        const todo: Todo = {
          id: randomUUID(),
          title,
          completed: false,
          createdAt: now,
          updatedAt: now,
        }

        todos.unshift(todo)
        await writeTodos(todos)
        await sendJson(res, 201, todo)
        return
      }

      const todoIdMatch = url.pathname.match(/^\/api\/todos\/([^/]+)$/)

      if (!todoIdMatch) {
        await sendError(res, 404, 'Route not found.')
        return
      }

      const [, todoId] = todoIdMatch
      const todos = await readTodos()
      const index = todos.findIndex((todo) => todo.id === todoId)

      if (index < 0) {
        await sendError(res, 404, 'Todo not found.')
        return
      }

      if (method === 'PATCH') {
        const body = (await readJsonBody(req)) as UpdateTodoInput | null
        const todo = todos[index]
        const nextTitle =
          typeof body?.title === 'string' ? validateTitle(body.title) : todo.title
        const nextCompleted =
          typeof body?.completed === 'boolean' ? body.completed : todo.completed

        const updatedTodo: Todo = {
          ...todo,
          title: nextTitle,
          completed: nextCompleted,
          updatedAt: new Date().toISOString(),
        }

        todos[index] = updatedTodo
        await writeTodos(todos)
        await sendJson(res, 200, updatedTodo)
        return
      }

      if (method === 'DELETE') {
        todos.splice(index, 1)
        await writeTodos(todos)
        await sendJson(res, 200, { success: true })
        return
      }

      await sendError(res, 405, 'Method not allowed.')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected server error.'
      await sendError(res, 400, message)
    }
  }
}

async function ensureDataFile() {
  await mkdir(DATA_DIR, { recursive: true })

  try {
    await readFile(DATA_FILE, 'utf8')
  } catch {
    await writeFile(DATA_FILE, '[]\n', 'utf8')
  }
}

async function readTodos(): Promise<Todo[]> {
  await ensureDataFile()
  const content = await readFile(DATA_FILE, 'utf8')

  try {
    const parsed = JSON.parse(content) as unknown
    return Array.isArray(parsed) ? (parsed as Todo[]) : []
  } catch {
    return []
  }
}

async function writeTodos(todos: Todo[]) {
  await ensureDataFile()
  await writeFile(DATA_FILE, `${JSON.stringify(todos, null, 2)}\n`, 'utf8')
}

async function readJsonBody(req: IncomingMessage): Promise<JsonBody> {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  if (chunks.length === 0) {
    return null
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as JsonBody
}

function validateTitle(title: unknown) {
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('Title is required.')
  }

  return title.trim()
}

async function sendJson(
  res: ServerResponse,
  statusCode: number,
  payload: unknown,
) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

async function sendError(
  res: ServerResponse,
  statusCode: number,
  message: string,
) {
  await sendJson(res, statusCode, { message })
}

export default todoApiPlugin
