import type { Transaction } from "../../backend/types/transactions"
import useTransactions from "../../hooks/useTransactions"
import TransactionCard from "./TransactionCard"
import { useState, useMemo } from 'react'
import UpdateTransactionModal from './UpdateTransactionModal'
import DeleteTransactionConfirmModal from './DeleteTransactionConfirmModal'
import MoveTransactionModal from './MoveTransactionModal'

type ModalState =
  | { type: 'update', transaction: Transaction }
  | { type: 'delete', transaction: Transaction }
  | { type: 'move', transaction: Transaction }

const TransactionContainerSkeleton = () => (
  <div className="flex flex-col gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
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

const TransactionContainer = ({ transactionQuery: { transactions, loading, error, refetch }, limit = 3 }: { transactionQuery: ReturnType<typeof useTransactions>, limit?: number }) => {
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const transactionsPerPage = 10

  // Filter states
  const [searchText, setSearchText] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'add' | 'withdraw'>('all')
  const [minAmount, setMinAmount] = useState<string>('')
  const [maxAmount, setMaxAmount] = useState<string>('')

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Search filter (case insensitive)
      if (searchText && !transaction.name.toLowerCase().includes(searchText.toLowerCase())) {
        return false
      }

      // Type filter
      if (typeFilter !== 'all' && transaction.type !== typeFilter) {
        return false
      }

      // Amount range filter
      if (minAmount && transaction.amount < parseFloat(minAmount)) {
        return false
      }
      if (maxAmount && transaction.amount > parseFloat(maxAmount)) {
        return false
      }

      return true
    })
  }, [transactions, searchText, typeFilter, minAmount, maxAmount])

  // Pagination with filtered transactions
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)
  const startIndex = (currentPage - 1) * transactionsPerPage
  const endIndex = startIndex + transactionsPerPage
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Reset page when filters change (handled in filter change handlers)

  if (loading) return <TransactionContainerSkeleton />
  if (error) return <p className="text-red-400 text-sm">Error loading transactions</p>
  if (transactions.length === 0) return <p className="text-gray-500 text-sm">No transactions yet. Create one to get started.</p>

  return (
    <div className="flex flex-col gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
      {transactions
        .slice(0, limit)
        .map(transaction => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onEdit={() => setModalState({ type: 'update', transaction })}
            onDelete={() => setModalState({ type: 'delete', transaction })}
            onMove={() => setModalState({ type: 'move', transaction })}
          />
        ))}

      {/* Show "View all" button if there are more transactions */}
      {transactions.length > limit && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-gray-400 hover:text-emerald-400 text-sm transition-all cursor-pointer mt-2"
        >
          View all {transactions.length} transactions
        </button>
      )}

      {/* Expanded overlay */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">All Transactions</h2>
              <button
                onClick={() => {
                  setIsExpanded(false)
                  setCurrentPage(1)
                }}
                className="text-gray-500 hover:text-white transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Filter controls */}
            <div className="mb-4 space-y-3">
              {/* Search input */}
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-500"
                />
              </div>

              {/* Filter row */}
              <div className="flex flex-wrap gap-3">
                {/* Type filter */}
                <div className="flex-1 min-w-[120px]">
                  <select
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value as 'all' | 'add' | 'withdraw')
                      setCurrentPage(1)
                    }}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all cursor-pointer"
                  >
                    <option value="all">All types</option>
                    <option value="add">Add only</option>
                    <option value="withdraw">Withdraw only</option>
                  </select>
                </div>
              </div>

              {/* Amount range */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="Min amount"
                    value={minAmount}
                    onChange={(e) => {
                      setMinAmount(e.target.value)
                      setCurrentPage(1)
                    }}
                    min={0}
                    step={0.01}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-500"
                  />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="Max amount"
                    value={maxAmount}
                    onChange={(e) => {
                      setMaxAmount(e.target.value)
                      setCurrentPage(1)
                    }}
                    min={0}
                    step={0.01}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Clear filters button */}
              {(searchText || typeFilter !== 'all' || minAmount || maxAmount) && (
                <button
                  onClick={() => {
                    setSearchText('')
                    setTypeFilter('all')
                    setMinAmount('')
                    setMaxAmount('')
                    setCurrentPage(1)
                  }}
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-all cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Results count */}
            <div className="mb-3 text-sm text-gray-500">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>

            {/* Transactions list */}
            <div className="flex flex-col gap-3 overflow-y-auto flex-1">
              {currentTransactions.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No transactions match your filters</p>
              ) : (
                currentTransactions.map(transaction => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={() => setModalState({ type: 'update', transaction })}
                    onDelete={() => setModalState({ type: 'delete', transaction })}
                    onMove={() => setModalState({ type: 'move', transaction })}
                  />
                ))
              )}
            </div>

            {/* Pagination controls */}
            {filteredTransactions.length > 0 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <span className="text-gray-500 text-xs">
                    ({startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-8 h-8 rounded text-sm font-medium transition-all cursor-pointer ${currentPage === pageNumber
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
      )}

      {modalState && (
        modalState.type === 'update'
          ? <UpdateTransactionModal
            transaction={modalState.transaction}
            onSuccess={refetch}
            onClose={() => setModalState(null)}
          />
          : modalState.type === 'delete'
            ? <DeleteTransactionConfirmModal
              transaction={modalState.transaction}
              onSuccess={refetch}
              onClose={() => setModalState(null)}
            />
            : <MoveTransactionModal
              transaction={modalState.transaction}
              onSuccess={refetch}
              onClose={() => setModalState(null)}
            />
      )}
    </div>
  )
}

export default TransactionContainer
