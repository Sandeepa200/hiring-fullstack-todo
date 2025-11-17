import { useEffect, useState } from 'react'
import { getTodos, createTodo, updateTodo, toggleDone, deleteTodo } from './api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getTodos()
      setTodos(data)
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
    if (!title.trim()) return
    setLoading(true)
    setError('')
    try {
      const t = await createTodo({ title, description })
      setTodos([t, ...todos])
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
    try {
      const updated = await updateTodo(id, { title: editTitle, description: editDescription })
      setTodos(todos.map((t) => (t._id === id ? updated : t)))
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
      setTodos(todos.map((t) => (t._id === id ? updated : t)))
    } catch (e) {
      setError('Failed to toggle todo')
    }
  }

  const onDelete = async (id) => {
    setLoading(true)
    setError('')
    try {
      await deleteTodo(id)
      setTodos(todos.filter((t) => t._id !== id))
    } catch (e) {
      setError('Failed to delete todo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1>TODOs</h1>
      <form onSubmit={onCreate} style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr auto' }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
        {todos.map((t) => (
          <li key={t._id} style={{ display: 'grid', gap: 8, alignItems: 'center', gridTemplateColumns: 'auto 1fr 2fr auto auto', padding: 8, borderBottom: '1px solid #eee' }}>
            <input type="checkbox" checked={!!t.done} onChange={() => onToggle(t._id)} />
            {editingId === t._id ? (
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            ) : (
              <span style={{ textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.6 : 1 }}>{t.title}</span>
            )}
            {editingId === t._id ? (
              <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            ) : (
              <span style={{ opacity: t.done ? 0.6 : 1 }}>{t.description}</span>
            )}
            {editingId === t._id ? (
              <button onClick={() => onUpdate(t._id)}>Save</button>
            ) : (
              <button onClick={() => startEdit(t)}>Edit</button>
            )}
            <button onClick={() => onDelete(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App