import { useEffect } from 'react'

export default function Header() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur border-b border-gray-800">
      <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-100">My Tasks</h1>
      </div>
    </header>
  )
}