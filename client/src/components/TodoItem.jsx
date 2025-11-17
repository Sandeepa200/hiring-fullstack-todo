import { useState } from 'react'

export default function TodoItem({ t, editingId, editTitle, editDescription, setEditTitle, setEditDescription, startEdit, onUpdate, onToggle, onDelete }) {
  const isEditing = editingId === t._id
  const [touchedTitle, setTouchedTitle] = useState(false)
  const [touchedDesc, setTouchedDesc] = useState(false)
  const TITLE_MAX = 80
  const DESC_MAX = 240
  const titleTrim = (editTitle || '').trim()
  const descTrim = (editDescription || '').trim()
  const titleError = titleTrim.length === 0 ? 'Title is required' : titleTrim.length > TITLE_MAX ? `Max ${TITLE_MAX} characters` : ''
  const descError = descTrim.length > DESC_MAX ? `Max ${DESC_MAX} characters` : ''
  const showTitleError = touchedTitle && !!titleError
  const showDescError = touchedDesc && !!descError
  return (
    <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto] items-start sm:items-center">
      <input aria-label="Mark done" type="checkbox" className="checkbox h-6 w-6 sm:h-5 sm:w-5" checked={!!t.done} onChange={() => onToggle(t._id)} />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <>
            <input
              className={`input mb-2 ${showTitleError ? 'border-red-400 focus:ring-red-300' : ''}`}
              value={editTitle}
              maxLength={TITLE_MAX}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => setTouchedTitle(true)}
            />
            <div className="-mt-1 mb-2 text-xs text-gray-500 dark:text-gray-400 text-right">{titleTrim.length}/{TITLE_MAX}</div>
            {showTitleError && <p className="-mt-1 mb-2 text-xs text-red-600 dark:text-red-400">{titleError}</p>}
          </>
        ) : (
          <div className={`font-semibold break-words ${t.done ? 'line-through decoration-2 decoration-red-500 dark:decoration-red-400 text-gray-600 dark:text-gray-300' : ''}`}>{t.title}</div>
        )}
        {isEditing ? (
          <>
            <input
              className={`input ${showDescError ? 'border-red-400 focus:ring-red-300' : ''}`}
              value={editDescription}
              maxLength={DESC_MAX}
              onChange={(e) => setEditDescription(e.target.value)}
              onBlur={() => setTouchedDesc(true)}
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">{descTrim.length}/{DESC_MAX}</div>
            {showDescError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{descError}</p>}
          </>
        ) : (
          <p className={`text-sm text-gray-600 dark:text-gray-300 break-words ${t.done ? 'line-through decoration-2 decoration-red-400' : ''}`}>{t.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 justify-end sm:justify-start">
        {isEditing ? (
          <button className="btn-solid" onClick={() => onUpdate(t._id)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14Zm-3.293 5.293L10 14l-2.707-2.707-1.414 1.414L10 16.828l7.707-7.707-1.414-1.414Z"/></svg>
          </button>
        ) : (
          <button className="btn-ghost" onClick={() => startEdit(t)} aria-label="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.232 5.232a3.182 3.182 0 1 1 4.5 4.5l-10 10a3 3 0 0 1-1.272.75l-4.5 1.125a1 1 0 0 1-1.213-1.212l1.125-4.5a3 3 0 0 1 .75-1.272l10-10Z"/></svg>
          </button>
        )}
        <button className="btn-ghost" onClick={() => onDelete(t._id)} aria-label="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h5a1 1 0 1 1 0 2h-1v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5H3a1 1 0 0 1 0-2h6Zm-2 4v13h10V7H7Zm2 2h2v9H9V9Zm4 0h2v9h-2V9Z"/></svg>
        </button>
      </div>
    </div>
  )
}