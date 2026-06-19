import type { Transaction } from '../../backend/types/transactions'
import { useTransactions } from '../../hooks/transactions'
import TransactionCard from './TransactionCard'
import { useState } from 'react'
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

const TransactionContainer = ({
  budgetId,
  limit = 3,
  viewAll,
  hideMoveButton,
}: {
  budgetId?: string
  limit?: number
  viewAll?: 'link' | 'paginate'
  hideMoveButton?: boolean
}) => {
  const { transactions, isLoading, error } = useTransactions(budgetId ?? null)
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

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
      </div>

      {viewAll === 'paginate' && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
