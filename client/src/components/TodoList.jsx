import TodoItem from './TodoItem'

export default function TodoList({ todos, enableDrag = false, onReorder, ...props }) {
  const handleDragStart = (e, index) => {
    if (!enableDrag) return
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (e) => {
    if (!enableDrag) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, index) => {
    if (!enableDrag || !onReorder) return
    e.preventDefault()
    const fromIndex = Number(e.dataTransfer.getData('text/plain'))
    if (!Number.isNaN(fromIndex) && fromIndex !== index) {
      onReorder(fromIndex, index)
    }
  }

  return (
    <ul className="mt-4 space-y-3">
      {todos.map((t, index) => {
        const tint = t.done ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800' : ''
        return (
          <li
            key={t._id}
            className={`card p-4 ${tint}`}
            draggable={enableDrag}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <TodoItem t={t} {...props} />
          </li>
        )
      })}
    </ul>
  )
}