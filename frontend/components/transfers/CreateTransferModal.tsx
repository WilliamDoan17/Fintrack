import { useState, useMemo, useRef, useEffect } from 'react'
import type { Budget } from '../../backend/types/budgets'
import useBudgetStructure from '../../hooks/useBudgetStructure'
import { createTransfer } from '../../backend/services/transfers'
import { useNotification } from '../../contexts/NotificationContext'

const CreateTransferModal = ({ budget, onSuccess, onClose }: { budget: Budget, onSuccess?: () => void, onClose: () => void }) => {
  const { structure, loading, error } = useBudgetStructure()
  const [toInput, setToInput] = useState('')
  const [amount, setAmount] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [submitting, setSubmitting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { notify } = useNotification()

  const currentPath = structure?.budgetIdToPath.get(budget.id) ?? ''

  const hints = useMemo(() => {
    if (!structure) return []
    const query = toInput.trim()
    return structure.paths.filter(path => {
      if (path === '/' || path === currentPath) return false
      if (!path.startsWith(query)) return false
      const remainder = path.slice(query.length)
      const nextSlash = remainder.indexOf('/')
      return nextSlash === -1 || nextSlash === remainder.length - 1
    })
  }, [toInput, structure, currentPath])

  useEffect(() => {
    setFocusedIndex(-1)
  }, [hints])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (path: string) => {
    setToInput(path)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!structure) return
    const toBudgetId = structure.pathToBudgetId.get(toInput.trim())
    if (!toBudgetId) {
      notify('No budget found at that path', 'error')
      return
    }
    setSubmitting(true)
    createTransfer({
      from_budget_id: budget.id,
      to_budget_id: toBudgetId,
      amount: parseFloat(amount),
      name,
    })
      .then(() => {
        notify('Transfer successful', 'success')
        onSuccess?.()
        onClose()
      })
      .catch((err) => notify(err.message, 'error'))
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-semibold mb-1">Transfer</h2>
        <p className="text-gray-500 text-sm mb-6">
          Move money from <span className="text-gray-300">{budget.name}</span> to another budget.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* To */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">To</label>
            <div ref={containerRef} className="relative">
              <input
                type="text"
                value={toInput}
                onChange={e => { setToInput(e.target.value); setOpen(true) }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Start typing a budget path..."
                className="w-full bg-gray-800 border border-gray-700 focus:border-emerald-400 outline-none rounded px-3 py-2 text-white placeholder:text-gray-600 text-sm transition-all"
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
            {loading && <p className="text-gray-500 text-xs">Loading budgets...</p>}
            {error && <p className="text-red-400 text-xs">Failed to load budgets</p>}
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Monthly allocation"
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 pl-7 w-full focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !toInput.trim() || !amount || !name}
              className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Transferring...' : 'Transfer'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateTransferModal
