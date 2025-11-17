import { useState } from 'react'

export default function TodoForm({ title, description, setTitle, setDescription, onCreate }) {
  const [submitted, setSubmitted] = useState(false)
  const TITLE_MIN = 3
  const TITLE_MAX = 80
  const DESC_MAX = 240
  const titleTrim = title.trim()
  const descTrim = description.trim()
  const titleError = titleTrim.length === 0 ? `Title is required` : titleTrim.length < TITLE_MIN ? `Min ${TITLE_MIN} characters` : titleTrim.length > TITLE_MAX ? `Max ${TITLE_MAX} characters` : ''
  const descError = descTrim.length > DESC_MAX ? `Max ${DESC_MAX} characters` : ''
  const showTitleError = submitted && !!titleError
  const showDescError = submitted && !!descError
  const canSubmit = !titleError && !descError

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (canSubmit) {
      onCreate(e)
      setSubmitted(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 md:p-6 mt-4">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            id="title"
            className={`input mt-1 ${showTitleError ? 'border-red-400 focus:ring-red-300' : ''}`}
            placeholder="e.g. Buy groceries"
            value={title}
            maxLength={TITLE_MAX}
            aria-invalid={showTitleError}
            aria-describedby="title-error"
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{titleTrim.length}/{TITLE_MAX}</span>
          </div>
          {showTitleError && <p id="title-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{titleError}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <input
            id="description"
            className={`input mt-1 ${showDescError ? 'border-red-400 focus:ring-red-300' : ''}`}
            placeholder="Optional details"
            value={description}
            maxLength={DESC_MAX}
            aria-invalid={showDescError}
            aria-describedby="desc-error"
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{descTrim.length}/{DESC_MAX}</span>
          </div>
          {showDescError && <p id="desc-error" className="mt-1 text-xs text-red-600 dark:text-red-400">{descError}</p>}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button type="submit" className="btn-solid">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1Z"/></svg>
          Add Task
        </button>
      </div>
    </form>
  )
}