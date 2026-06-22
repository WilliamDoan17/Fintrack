import { useState, useMemo } from 'react'
import type { Transfer } from '../../backend/types/transfers'
import { useTransfers } from '../../hooks/transfers'
import { useBudget } from '../../hooks/budgets'
import UpdateTransferModal from './UpdateTransferModal'
import DeleteTransferConfirmModal from './DeleteTransferConfirmModal'
import Pagination from '../Pagination'

type ModalState =
  | { type: 'update'; transfer: Transfer }
  | { type: 'delete'; transfer: Transfer }

const PER_PAGE = 10

const EditButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-emerald-400 transition-all cursor-pointer">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  </button>
)

const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-red-400 transition-all cursor-pointer">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  </button>
)

export const TransferCard = ({
  transfer,
  budgetId,
  onEdit,
  onDelete,
}: {
  transfer: Transfer
  budgetId?: string
  onEdit: () => void
  onDelete: () => void
}) => {
  const { budget: fromBudget } = useBudget(transfer.from_budget_id)
  const { budget: toBudget } = useBudget(transfer.to_budget_id)
  const fromName = fromBudget?.name ?? '...'
  const toName = toBudget?.name ?? '...'
  const isSource = budgetId ? transfer.from_budget_id === budgetId : null

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 hover:border-gray-600 transition-all">
      <div className="flex flex-col gap-1">
        <p className="text-white font-medium">{transfer.name}</p>
        <p className="text-gray-500 text-xs uppercase tracking-widest">
          {fromName} → {toName}
        </p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-4">
        <span className={`font-semibold text-lg ${isSource === null ? 'text-gray-400' : isSource ? 'text-red-400' : 'text-emerald-400'}`}>
          {isSource === null ? '' : isSource ? '-' : '+'}${transfer.amount}
        </span>
        <div className="flex items-center gap-2">
          <EditButton onClick={onEdit} />
          <DeleteButton onClick={onDelete} />
        </div>
      </div>
    </div>
  )
}

const TransferContainerSkeleton = () => (
  <div className="flex flex-col gap-3">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4">
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
          <div className="w-20 h-3 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="w-16 h-5 bg-gray-700 rounded animate-pulse" />
      </div>
    ))}
  </div>
)

const ExpandedView = ({
  transfers,
  budgetId,
  onClose,
  setModalState,
}: {
  transfers: Transfer[]
  budgetId?: string
  onClose: () => void
  setModalState: (state: ModalState) => void
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [directionFilter, setDirectionFilter] = useState<'all' | 'in' | 'out'>('all')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const perPage = 10

  const filtered = useMemo(() => transfers.filter(t => {
    if (searchText && !t.name.toLowerCase().includes(searchText.toLowerCase())) return false
    if (minAmount && t.amount < parseFloat(minAmount)) return false
    if (maxAmount && t.amount > parseFloat(maxAmount)) return false
    if (budgetId && directionFilter === 'out' && t.from_budget_id !== budgetId) return false
    if (budgetId && directionFilter === 'in' && t.to_budget_id !== budgetId) return false
    return true
  }), [transfers, searchText, directionFilter, minAmount, maxAmount, budgetId])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const page = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)
  const hasFilters = searchText || directionFilter !== 'all' || minAmount || maxAmount

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-semibold">All Transfers</h2>
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
              type="text" placeholder="Search transfers..." value={searchText}
              onChange={e => { setSearchText(e.target.value); setCurrentPage(1) }}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {budgetId && (
              <select
                value={directionFilter}
                onChange={e => { setDirectionFilter(e.target.value as 'all' | 'in' | 'out'); setCurrentPage(1) }}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all cursor-pointer"
              >
                <option value="all">All directions</option>
                <option value="in">Incoming only</option>
                <option value="out">Outgoing only</option>
              </select>
            )}
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
              onClick={() => { setSearchText(''); setDirectionFilter('all'); setMinAmount(''); setMaxAmount(''); setCurrentPage(1) }}
              className="text-gray-400 hover:text-emerald-400 text-sm transition-all cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="mb-3 text-sm text-gray-500">
          Showing {filtered.length} of {transfers.length} transfers
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto flex-1">
          {page.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No transfers match your filters</p>
          ) : page.map(t => (
            <TransferCard
              key={t.id}
              transfer={t}
              budgetId={budgetId}
              onEdit={() => setModalState({ type: 'update', transfer: t })}
              onDelete={() => setModalState({ type: 'delete', transfer: t })}
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

const TransferContainer = ({
  budgetId,
  limit,
  viewAll,
}: {
  budgetId?: string
  limit?: number
  viewAll?: 'paginate' | 'expanded'
}) => {
  const { transfers, isLoading, error } = useTransfers(budgetId ?? null)
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedOpen, setExpandedOpen] = useState(false)

  if (isLoading) return <TransferContainerSkeleton />
  if (error) return <p className="text-red-400 text-sm">Error loading transfers</p>
  if (transfers.length === 0) return <p className="text-gray-500 text-sm">No transfers yet.</p>

  const displayLimit = limit ?? 3
  const totalPages = Math.max(1, Math.ceil(transfers.length / PER_PAGE))
  const displayed = viewAll === 'paginate'
    ? transfers.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
    : transfers.slice(0, displayLimit)

  return (
    <>
      <div className="flex flex-col gap-3">
        {displayed.map(transfer => (
          <TransferCard
            key={transfer.id}
            transfer={transfer}
            budgetId={budgetId}
            onEdit={() => setModalState({ type: 'update', transfer })}
            onDelete={() => setModalState({ type: 'delete', transfer })}
          />
        ))}
        {viewAll === 'expanded' && transfers.length > displayLimit && (
          <button
            onClick={() => setExpandedOpen(true)}
            className="text-gray-400 hover:text-emerald-400 text-sm transition-all cursor-pointer text-left"
          >
            View all ({transfers.length}) →
          </button>
        )}
      </div>

      {viewAll === 'paginate' && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {expandedOpen && (
        <ExpandedView
          transfers={transfers}
          budgetId={budgetId}
          onClose={() => setExpandedOpen(false)}
          setModalState={setModalState}
        />
      )}

      {modalState?.type === 'update' && (
        <UpdateTransferModal transfer={modalState.transfer} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'delete' && (
        <DeleteTransferConfirmModal transfer={modalState.transfer} onClose={() => setModalState(null)} />
      )}
    </>
  )
}

export default TransferContainer
