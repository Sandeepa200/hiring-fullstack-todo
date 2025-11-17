const Todo = require('../models/Todo')

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 })
    res.json(todos)
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch todos' })
  }
}

const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body
    if (!title || typeof title !== 'string') return res.status(400).json({ error: 'Title is required' })
    const todo = await Todo.create({ title: title.trim(), description: (description || '').trim() })
    res.status(201).json(todo)
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ error: 'Invalid input' })
    res.status(500).json({ error: 'Failed to create todo' })
  }
}

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description } = req.body
    const updates = {}
    if (title !== undefined) updates.title = String(title).trim()
    if (description !== undefined) updates.description = String(description).trim()
    const todo = await Todo.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    if (!todo) return res.status(404).json({ error: 'Todo not found' })
    res.json(todo)
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ error: 'Invalid input' })
    res.status(500).json({ error: 'Failed to update todo' })
  }
}

const toggleDone = async (req, res) => {
  try {
    const { id } = req.params
    const todo = await Todo.findById(id)
    if (!todo) return res.status(404).json({ error: 'Todo not found' })
    todo.done = !todo.done
    await todo.save()
    res.json(todo)
  } catch (e) {
    res.status(500).json({ error: 'Failed to toggle todo' })
  }
}

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params
    const todo = await Todo.findByIdAndDelete(id)
    if (!todo) return res.status(404).json({ error: 'Todo not found' })
    res.json({ message: 'Todo deleted' })
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete todo' })
  }
}

module.exports = { getTodos, createTodo, updateTodo, toggleDone, deleteTodo }