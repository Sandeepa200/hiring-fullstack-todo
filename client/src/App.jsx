import { useEffect, useState } from 'react'
import { getTodos, createTodo, updateTodo, toggleDone, deleteTodo } from './api/todos'
import Header from './components/Header'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import EmptyState from './components/EmptyState'
import Spinner from './components/Spinner'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [todoOrder, setTodoOrder] = useState([])

  const sortTodos = (items) => {
    return [...items].sort((a, b) => {
      if (!!a.done !== !!b.done) return a.done ? 1 : -1
      const aTime = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime()
      const bTime = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime()
      return bTime - aTime
    })
  }

  const computeInitialOrder = (items) => {
    const incomplete = items.filter((t) => !t.done)
    const defaultOrder = incomplete
      .sort((a, b) => {
        const aTime = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime()
        const bTime = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime()
        return bTime - aTime
      })
      .map((t) => t._id)
    const saved = (() => {
      try {
        const raw = localStorage.getItem('todoOrder')
        return raw ? JSON.parse(raw) : []
      } catch {
        return []
      }
    })()
    const setIds = new Set(incomplete.map((t) => t._id))
    const filteredSaved = saved.filter((id) => setIds.has(id))
    const missing = defaultOrder.filter((id) => !filteredSaved.includes(id))
    return [...filteredSaved, ...missing]
  }

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getTodos()
      setTodos(sortTodos(data))
      const initialOrder = computeInitialOrder(data)
      setTodoOrder(initialOrder)
      localStorage.setItem('todoOrder', JSON.stringify(initialOrder))
    } catch (e) {
      setError('Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    const TITLE_MAX = 80
    const DESC_MAX = 240
    const tTrim = title.trim()
    const dTrim = description.trim()
    if (!tTrim || tTrim.length > TITLE_MAX || dTrim.length > DESC_MAX) return
    setLoading(true)
    setError('')
    try {
      const t = await createTodo({ title, description })
      setTodos(sortTodos([t, ...todos]))
      const nextOrder = [t._id, ...todoOrder]
      setTodoOrder(nextOrder)
      localStorage.setItem('todoOrder', JSON.stringify(nextOrder))
      setTitle('')
      setDescription('')
    } catch (e) {
      setError('Failed to create todo')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (t) => {
    setEditingId(t._id)
    setEditTitle(t.title)
    setEditDescription(t.description || '')
  }

  const onUpdate = async (id) => {
    setLoading(true)
    setError('')
    const TITLE_MAX = 80
    const DESC_MAX = 240
    const tTrim = editTitle.trim()
    const dTrim = editDescription.trim()
    if (!tTrim || tTrim.length > TITLE_MAX || dTrim.length > DESC_MAX) {
      setLoading(false)
      return
    }
    try {
      const updated = await updateTodo(id, { title: editTitle, description: editDescription })
      setTodos(sortTodos(todos.map((t) => (t._id === id ? updated : t))))
      setEditingId(null)
      setEditTitle('')
      setEditDescription('')
    } catch (e) {
      setError('Failed to update todo')
    } finally {
      setLoading(false)
    }
  }

  const onToggle = async (id) => {
    setError('')
    try {
      const updated = await toggleDone(id)
      const nextTodos = todos.map((t) => (t._id === id ? updated : t))
      setTodos(sortTodos(nextTodos))
      if (updated.done) {
        const nextOrder = todoOrder.filter((x) => x !== id)
        setTodoOrder(nextOrder)
        localStorage.setItem('todoOrder', JSON.stringify(nextOrder))
      } else {
        const nextOrder = [id, ...todoOrder.filter((x) => x !== id)]
        setTodoOrder(nextOrder)
        localStorage.setItem('todoOrder', JSON.stringify(nextOrder))
      }
    } catch (e) {
      setError('Failed to toggle todo')
    }
  }

  const onDelete = async (id) => {
    setLoading(true)
    setError('')
    try {
      await deleteTodo(id)
      setTodos(sortTodos(todos.filter((t) => t._id !== id)))
      const nextOrder = todoOrder.filter((x) => x !== id)
      setTodoOrder(nextOrder)
      localStorage.setItem('todoOrder', JSON.stringify(nextOrder))
    } catch (e) {
      setError('Failed to delete todo')
    } finally {
      setLoading(false)
    }
  }

  const reorderActive = (fromIndex, toIndex) => {
    const next = [...todoOrder]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    setTodoOrder(next)
    localStorage.setItem('todoOrder', JSON.stringify(next))
  }

  const activeTodos = todos.filter((t) => !t.done)
  const completedTodos = todos.filter((t) => !!t.done)
  const orderIndex = new Map(todoOrder.map((id, i) => [id, i]))
  const orderedActive = [...activeTodos].sort((a, b) => (orderIndex.get(a._id) ?? 0) - (orderIndex.get(b._id) ?? 0))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <TodoForm title={title} description={description} setTitle={setTitle} setDescription={setDescription} onCreate={onCreate} />

        <div className="mt-4">
          {loading && <Spinner />}
          {error && (
            <div role="alert" className="card p-4 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {todos.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">To do</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{orderedActive.length}</span>
                </div>
                <TodoList
                  todos={orderedActive}
                  enableDrag={true}
                  onReorder={reorderActive}
                  editingId={editingId}
                  editTitle={editTitle}
                  editDescription={editDescription}
                  setEditTitle={setEditTitle}
                  setEditDescription={setEditDescription}
                  startEdit={startEdit}
                  onUpdate={onUpdate}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              </section>

              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">Completed</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{completedTodos.length}</span>
                </div>
                <TodoList
                  todos={completedTodos}
                  enableDrag={false}
                  editingId={editingId}
                  editTitle={editTitle}
                  editDescription={editDescription}
                  setEditTitle={setEditTitle}
                  setEditDescription={setEditDescription}
                  startEdit={startEdit}
                  onUpdate={onUpdate}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App