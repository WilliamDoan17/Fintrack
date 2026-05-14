import { useState, useMemo, useRef, useEffect } from 'react'
import type { Budget } from '../../backend/types/budgets'
import useSpendingBudgetStructure from '../../hooks/useSpendingBudgetStructure'
import { updateBudget } from '../../backend/services/budgets'
import { useNotification } from '../../contexts/NotificationContext'

const MoveBudgetModal = ({ budget, onClose }: { budget: Budget, onClose: () => void }) => {
  const { structure, loading, error } = useSpendingBudgetStructure()
  const [input, setInput] = useState('')
  const [moving, setMoving] = useState(false)
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const { notify } = useNotification()

  const parentPath = budget.parent_id === null ? '/' : (structure?.budgetIdToPath.get(budget.parent_id) ?? '')
  const currentPath = structure?.budgetIdToPath.get(budget.id) ?? ''

  const hints = useMemo(() => {
    if (!structure) return []
    const query = input.trim()
    return structure.paths.filter(path => {
      if (path === '/') return false
      if (path === currentPath || path.startsWith(`${currentPath}/`)) return false
      if (!path.startsWith(query)) return false
      const remainder = path.slice(query.length)
      const nextSlash = remainder.indexOf('/')
      return nextSlash === -1 || nextSlash === remainder.length - 1
    })
  }, [input, structure, currentPath])

  // reset focused index when hints change
  useEffect(() => {
    setFocusedIndex(-1)
  }, [hints])

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (structure) {
      const parentPath = budget.parent_id === null ? '/' : (structure?.budgetIdToPath.get(budget.parent_id) ?? '')
      setInput(parentPath)
    }
  }, [structure, budget])

  const handleSelect = (path: string) => {
    setInput(path)
    setOpen(false)
    setFocusedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || hints.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex(i => Math.min(i + 1, hints.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault()
      handleSelect(hints[focusedIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const handleMove = async () => {
    if (!structure || !input.trim()) return
    setMoving(true)
    try {
      if (input.trim() !== '/' && !structure.pathToBudgetId.has(input.trim())) {
        throw Error("No Budget found");
      }
      const targetBudgetId = structure.pathToBudgetId.get(input.trim())
      const newParentId = input.trim() === '/' ? null : targetBudgetId
      await updateBudget(budget.id, { parent_id: newParentId })
      notify(`Moved "${budget.name}" successfully`, 'success')
      onClose()
    } catch (err) {
      notify((err as Error).message, 'error')
    } finally {
      setMoving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md flex flex-col gap-4">

        <h2 className="text-white text-lg font-semibold">
          Move <span className="text-emerald-400">{budget.name}</span> to:
        </h2>

        <div className="text-gray-400 text-sm">
          Current: <span className="text-gray-300">{parentPath || '...'}</span>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleMove() }} className="flex flex-col gap-4">

          {/* Dropdown */}
          <div ref={containerRef} className="relative">
            <input
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={parentPath || 'Start typing a path...'}
              className="w-full bg-gray-800 border border-gray-700 focus:border-emerald-400 outline-none rounded-lg px-4 py-2 text-white placeholder:text-gray-500 text-sm transition-all"
            />

            {open && !loading && hints.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-10 max-h-48 overflow-y-auto">
                {hints.map((path, index) => (
                  <li
                    key={path}
                    onMouseDown={() => handleSelect(path)}
                    className={`px-4 py-2 text-sm cursor-pointer transition-all ${index === focusedIndex
                      ? 'bg-emerald-500/20 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                  >
                    {path}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {loading && <p className="text-gray-500 text-sm">Loading budgets...</p>}
          {error && <p className="text-red-400 text-sm">Failed to load budgets</p>}

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={moving || !input.trim()}
              className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white rounded-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {moving ? 'Moving...' : 'Move'}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

export default MoveBudgetModal
