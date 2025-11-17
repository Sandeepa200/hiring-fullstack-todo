import axios from 'axios'

const baseUrl = (import.meta?.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
const api = axios.create({ baseURL: `${baseUrl}/api/todos` })

export const getTodos = async () => {
  const res = await api.get('/')
  return res.data
}

export const createTodo = async (data) => {
  const res = await api.post('/', data)
  return res.data
}

export const updateTodo = async (id, data) => {
  const res = await api.put(`/${id}`, data)
  return res.data
}

export const toggleDone = async (id) => {
  const res = await api.patch(`/${id}/done`)
  return res.data
}

export const deleteTodo = async (id) => {
  const res = await api.delete(`/${id}`)
  return res.data
}