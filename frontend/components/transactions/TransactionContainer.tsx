import type { Transaction } from "../../backend/services/transactions"
import useTransactions from "../../hooks/useTransactions"
import TransactionCard from "./TransactionCard"
import { useState } from 'react'
import UpdateTransactionModal from './UpdateTransactionModal'
import DeleteTransactionConfirmModal from './DeleteTransactionConfirmModal'

type ModalState =
  | { type: 'update', transaction: Transaction }
  | { type: 'delete', transaction: Transaction }

const TransactionContainerSkeleton = () => (
  <div className="flex flex-col gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-5 py-4">
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

  if (loading) return <TransactionContainerSkeleton />
  if (error) return <p className="text-red-400 text-sm">Error loading transactions</p>
  if (transactions.length === 0) return <p className="text-gray-500 text-sm">No transactions yet. Create one to get started.</p>

  return (
    <div className="flex flex-col gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">

      {/* Expand button */}
      <button
        onClick={() => setIsExpanded(true)}
        className="self-end text-gray-500 hover:text-emerald-400 transition-all cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>

      {transactions
        .slice(0, limit)
        .map(transaction => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onEdit={() => setModalState({ type: 'update', transaction })}
            onDelete={() => setModalState({ type: 'delete', transaction })}
          />
        ))}

      {/* Expanded overlay */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-2xl shadow-xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">All Transactions</h2>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-white transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto">
              {transactions.map(transaction => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={() => setModalState({ type: 'update', transaction })}
                  onDelete={() => setModalState({ type: 'delete', transaction })}
                />
              ))}
            </div>
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
          : <DeleteTransactionConfirmModal
              transaction={modalState.transaction}
              onSuccess={refetch}
              onClose={() => setModalState(null)}
            />
      )}
    </div>
  )
}

export default TransactionContainer
