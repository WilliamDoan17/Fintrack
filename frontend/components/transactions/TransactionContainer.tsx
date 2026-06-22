import type { Transaction } from '../../backend/types/transactions'
import { useTransactions } from '../../hooks/transactions'
import TransactionCard from './TransactionCard'
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import UpdateTransactionModal from './UpdateTransactionModal'
import DeleteTransactionConfirmModal from './DeleteTransactionConfirmModal'
import MoveTransactionModal from './MoveTransactionModal'
import Pagination from '../Pagination'

type ModalState =
  | { type: 'update', transaction: Transaction }
  | { type: 'delete', transaction: Transaction }
  | { type: 'move', transaction: Transaction }

const PER_PAGE = 10

const TransactionContainerSkeleton = () => (
  <div className="flex flex-col gap-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4">
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
          <div className="w-16 h-3 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="w-16 h-5 bg-gray-700 rounded animate-pulse" />
      </div>
    ))}
  </div>
)

const ExpandedView = ({
  transactions,
  hideMoveButton,
  onClose,
  setModalState,
}: {
  transactions: Transaction[]
  hideMoveButton?: boolean
  onClose: () => void
  setModalState: (state: ModalState) => void
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'add' | 'withdraw'>('all')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const perPage = 10

  const filtered = useMemo(() => transactions.filter(t => {
    if (searchText && !t.name.toLowerCase().includes(searchText.toLowerCase())) return false
    if (minAmount && t.amount < parseFloat(minAmount)) return false
    if (maxAmount && t.amount > parseFloat(maxAmount)) return false
    if (typeFilter !== 'all' && t.type !== typeFilter) return false
    return true
  }), [transactions, searchText, typeFilter, minAmount, maxAmount])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const page = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)
  const hasFilters = searchText || typeFilter !== 'all' || minAmount || maxAmount

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-semibold">All Transactions</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-all cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mb-4 space-y-3">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text" placeholder="Search transactions..." value={searchText}
              onChange={e => { setSearchText(e.target.value); setCurrentPage(1) }}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value as 'all' | 'add' | 'withdraw'); setCurrentPage(1) }}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all cursor-pointer"
            >
              <option value="all">All types</option>
              <option value="add">Add only</option>
              <option value="withdraw">Withdraw only</option>
            </select>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input type="number" placeholder="Min" value={minAmount} min={0} step={0.01}
                onChange={e => { setMinAmount(e.target.value); setCurrentPage(1) }}
                className="w-24 bg-gray-800 text-white border border-gray-700 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-500"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input type="number" placeholder="Max" value={maxAmount} min={0} step={0.01}
                onChange={e => { setMaxAmount(e.target.value); setCurrentPage(1) }}
                className="w-24 bg-gray-800 text-white border border-gray-700 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-500"
              />
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={() => { setSearchText(''); setTypeFilter('all'); setMinAmount(''); setMaxAmount(''); setCurrentPage(1) }}
              className="text-gray-400 hover:text-emerald-400 text-sm transition-all cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="mb-3 text-sm text-gray-500">
          Showing {filtered.length} of {transactions.length} transactions
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto flex-1">
          {page.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No transactions match your filters</p>
          ) : page.map(t => (
            <TransactionCard
              key={t.id}
              transaction={t}
              onEdit={() => setModalState({ type: 'update', transaction: t })}
              onDelete={() => setModalState({ type: 'delete', transaction: t })}
              {...(!hideMoveButton && { onMove: () => setModalState({ type: 'move', transaction: t }) })}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
            <span className="text-gray-400 text-sm">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
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
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-all cursor-pointer ${currentPage === p ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}
                  >{p}</button>
                )
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const TransactionContainer = ({
  budgetId,
  limit = 3,
  viewAll,
  hideMoveButton,
}: {
  budgetId?: string
  limit?: number
  viewAll?: 'link' | 'paginate' | 'expanded'
  hideMoveButton?: boolean
}) => {
  const { transactions, isLoading, error } = useTransactions(budgetId ?? null)
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedOpen, setExpandedOpen] = useState(false)

  if (isLoading) return <TransactionContainerSkeleton />
  if (error) return <p className="text-red-400 text-sm">Error loading transactions</p>
  if (transactions.length === 0) return <p className="text-gray-500 text-sm">No transactions yet. Create one to get started.</p>

  const totalPages = Math.max(1, Math.ceil(transactions.length / PER_PAGE))
  const displayed = viewAll === 'paginate'
    ? transactions.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
    : transactions.slice(0, limit)

  return (
    <>
      <div className="flex flex-col gap-3">
        {displayed.map(t => (
          <TransactionCard
            key={t.id}
            transaction={t}
            onEdit={() => setModalState({ type: 'update', transaction: t })}
            onDelete={() => setModalState({ type: 'delete', transaction: t })}
            {...(!hideMoveButton && { onMove: () => setModalState({ type: 'move', transaction: t }) })}
          />
        ))}
        {viewAll === 'link' && transactions.length > limit && (
          <Link to="/spending" className="text-gray-400 hover:text-emerald-400 text-sm transition-all">
            View all spending →
          </Link>
        )}
        {viewAll === 'expanded' && transactions.length > limit && (
          <button
            onClick={() => setExpandedOpen(true)}
            className="text-gray-400 hover:text-emerald-400 text-sm transition-all cursor-pointer text-left"
          >
            View all ({transactions.length}) →
          </button>
        )}
      </div>

      {viewAll === 'paginate' && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {expandedOpen && (
        <ExpandedView
          transactions={transactions}
          hideMoveButton={hideMoveButton}
          onClose={() => setExpandedOpen(false)}
          setModalState={setModalState}
        />
      )}

      {modalState?.type === 'update' && (
        <UpdateTransactionModal transaction={modalState.transaction} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'delete' && (
        <DeleteTransactionConfirmModal transaction={modalState.transaction} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'move' && (
        <MoveTransactionModal transaction={modalState.transaction} onClose={() => setModalState(null)} />
      )}
    </>
  )
}

export default TransactionContainer
