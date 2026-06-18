import { useState, useMemo, useRef, useEffect } from 'react'
import { useTransactions } from '../../hooks/transactions'
import { useSpendingBudgetStructure } from '../../hooks/budgets'
import type { Transaction } from '../../backend/types/transactions'

const SpendingRow = ({ transaction, budgetPath }: { transaction: Transaction, budgetPath: string }) => {
  const date = new Date(transaction.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 hover:border-gray-700 transition-all">
      <div className="flex flex-col gap-1">
        <p className="text-white text-sm font-medium">{transaction.name}</p>
        <p className="text-gray-500 text-xs">{budgetPath}</p>
      </div>
      <div className="flex flex-col sm:items-end gap-1 shrink-0">
        <p className="text-red-400 font-semibold text-sm">-${transaction.amount.toFixed(2)}</p>
        <p className="text-gray-600 text-xs">{date}</p>
      </div>
    </div>
  )
}

const PER_PAGE = 25

const Spending = () => {
  const { transactions, isLoading: txLoading } = useTransactions(null)
  const { structure, isLoading: structureLoading } = useSpendingBudgetStructure()

  const [search, setSearch] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [pathInput, setPathInput] = useState('')
  const [pathOpen, setPathOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [currentPage, setCurrentPage] = useState(1)
  const pathRef = useRef<HTMLDivElement>(null)

  const isLoading = txLoading || structureLoading

  const withdrawals = useMemo(
    () => transactions.filter(t => t.type === 'withdraw'),
    [transactions]
  )

  const pathHints = useMemo(() => {
    if (!structure) return []
    const query = pathInput.trim()
    return structure.paths.filter(p => {
      if (p === '/') return false
      if (!p.startsWith(query)) return false
      const remainder = p.slice(query.length)
      const nextSlash = remainder.indexOf('/')
      return nextSlash === -1 || nextSlash === remainder.length - 1
    })
  }, [pathInput, structure])

  useEffect(() => { setFocusedIndex(-1) }, [pathHints])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pathRef.current && !pathRef.current.contains(e.target as Node)) setPathOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = useMemo(() => {
    return withdrawals.filter(t => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
      if (minAmount && t.amount < parseFloat(minAmount)) return false
      if (maxAmount && t.amount > parseFloat(maxAmount)) return false
      if (fromDate && t.created_at < fromDate) return false
      if (toDate && t.created_at > toDate + 'T23:59:59') return false
      if (pathInput.trim() && structure) {
        const budgetPath = structure.budgetIdToPath.get(t.budget_id) ?? ''
        if (!budgetPath.startsWith(pathInput.trim())) return false
      }
      return true
    })
  }, [withdrawals, search, minAmount, maxAmount, fromDate, toDate, pathInput, structure])

  const totalSpent = useMemo(() => filtered.reduce((sum, t) => sum + t.amount, 0), [filtered])
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const handlePathKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!pathOpen || pathHints.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, pathHints.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && focusedIndex >= 0) { e.preventDefault(); setPathInput(pathHints[focusedIndex]); setPathOpen(false); setCurrentPage(1) }
    else if (e.key === 'Escape') setPathOpen(false)
  }

  const clearFilters = () => {
    setSearch(''); setMinAmount(''); setMaxAmount('')
    setFromDate(''); setToDate(''); setPathInput(''); setCurrentPage(1)
  }

  const hasFilters = search || minAmount || maxAmount || fromDate || toDate || pathInput.trim()

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-2xl md:text-3xl font-bold">Spending</h1>
          {!isLoading && (
            <p className="text-gray-500 text-sm mt-1">
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} · Total{' '}
              <span className="text-red-400 font-medium">-${totalSpent.toFixed(2)}</span>
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-6">

          {/* Search */}
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
              className="w-full bg-gray-900 text-white border border-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Amount range */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number" placeholder="Min" value={minAmount} min={0} step={0.01}
                onChange={e => { setMinAmount(e.target.value); setCurrentPage(1) }}
                className="w-28 bg-gray-900 text-white border border-gray-800 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number" placeholder="Max" value={maxAmount} min={0} step={0.01}
                onChange={e => { setMaxAmount(e.target.value); setCurrentPage(1) }}
                className="w-28 bg-gray-900 text-white border border-gray-800 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Date range */}
            <input
              type="date" value={fromDate}
              onChange={e => { setFromDate(e.target.value); setCurrentPage(1) }}
              className="bg-gray-900 text-gray-400 border border-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all"
            />
            <input
              type="date" value={toDate}
              onChange={e => { setToDate(e.target.value); setCurrentPage(1) }}
              className="bg-gray-900 text-gray-400 border border-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all"
            />
          </div>

          {/* Budget path autocomplete */}
          <div ref={pathRef} className="relative">
            <input
              type="text" value={pathInput} placeholder="Filter by budget path..."
              onChange={e => { setPathInput(e.target.value); setPathOpen(true); setCurrentPage(1) }}
              onFocus={() => setPathOpen(true)}
              onKeyDown={handlePathKeyDown}
              className="w-full bg-gray-900 text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
            />
            {pathOpen && pathHints.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-10 max-h-48 overflow-y-auto">
                {pathHints.map((path, index) => (
                  <li
                    key={path}
                    onMouseDown={() => { setPathInput(path); setPathOpen(false); setCurrentPage(1) }}
                    className={`px-4 py-2 text-sm cursor-pointer transition-all ${index === focusedIndex ? 'bg-emerald-500/20 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                  >
                    {path}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="self-start text-gray-500 hover:text-emerald-400 text-sm transition-all cursor-pointer">
              Clear filters
            </button>
          )}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex justify-between">
                <div className="flex flex-col gap-2">
                  <div className="w-32 h-4 bg-gray-800 rounded animate-pulse" />
                  <div className="w-20 h-3 bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="w-16 h-4 bg-gray-800 rounded animate-pulse" />
                  <div className="w-12 h-3 bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-sm">No spending transactions found.</p>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {paginated.map(t => (
                <SpendingRow
                  key={t.id}
                  transaction={t}
                  budgetPath={structure?.budgetIdToPath.get(t.budget_id) ?? ''}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                <span className="text-gray-500 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded bg-gray-900 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p: number
                    if (totalPages <= 5) p = i + 1
                    else if (currentPage <= 3) p = i + 1
                    else if (currentPage >= totalPages - 2) p = totalPages - 4 + i
                    else p = currentPage - 2 + i
                    return (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded text-sm font-medium transition-all cursor-pointer ${currentPage === p ? 'bg-emerald-500 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'}`}
                      >
                        {p}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded bg-gray-900 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default Spending
