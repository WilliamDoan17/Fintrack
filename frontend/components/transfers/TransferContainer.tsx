import { useState } from 'react'
import type { Transfer } from '../../backend/types/transfers'
import { useTransfers } from '../../hooks/transfers'
import { useBudget } from '../../hooks/budgets'
import UpdateTransferModal from './UpdateTransferModal'
import DeleteTransferConfirmModal from './DeleteTransferConfirmModal'
import Pagination from '../Pagination'

type ModalState =
  | { type: 'update'; transfer: Transfer }
  | { type: 'delete'; transfer: Transfer }

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

const TransferContainer = ({
  budgetId,
  limit = 3,
  viewAll,
}: {
  budgetId?: string
  limit?: number
  viewAll?: 'paginate'
}) => {
  const { transfers, isLoading, error } = useTransfers(budgetId ?? null)
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  if (isLoading) return <TransferContainerSkeleton />
  if (error) return <p className="text-red-400 text-sm">Error loading transfers</p>
  if (transfers.length === 0) return <p className="text-gray-500 text-sm">No transfers yet.</p>

  const totalPages = Math.max(1, Math.ceil(transfers.length / limit))
  const displayed = viewAll === 'paginate'
    ? transfers.slice((currentPage - 1) * limit, currentPage * limit)
    : transfers.slice(0, limit)

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
      </div>

      {viewAll === 'paginate' && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
