import { useState } from 'react'
import { useIncomes } from '../../hooks/incomes'
import type { Income } from '../../backend/types/incomes'
import Pagination from '../Pagination'
import UpdateIncomeModal from './UpdateIncomeModal'
import DeleteIncomeConfirmModal from './DeleteIncomeConfirmModal'

type ModalState =
  | { type: 'update'; income: Income }
  | { type: 'delete'; income: Income }

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

const IncomeCard = ({ income, onEdit, onDelete }: { income: Income; onEdit: () => void; onDelete: () => void }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 hover:border-gray-600 transition-all">
    <div className="flex flex-col gap-1">
      <p className="text-white font-medium">{income.name}</p>
      <p className="text-gray-500 text-xs uppercase tracking-widest">
        {new Date(income.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
    <div className="flex items-center justify-between sm:justify-end gap-4">
      <span className="font-semibold text-lg text-emerald-400">+${income.amount.toFixed(2)}</span>
      <div className="flex items-center gap-2">
        <EditButton onClick={onEdit} />
        <DeleteButton onClick={onDelete} />
      </div>
    </div>
  </div>
)

const IncomeContainerSkeleton = () => (
  <div className="flex flex-col gap-3">
    {[...Array(3)].map((_, i) => (
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

const IncomeContainer = ({ limit = 10 }: { limit?: number }) => {
  const { incomes, isLoading, error } = useIncomes()
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  if (isLoading) return <IncomeContainerSkeleton />
  if (error) return <p className="text-red-400 text-sm">Error loading incomes</p>
  if (incomes.length === 0) return <p className="text-gray-500 text-sm">No income recorded yet.</p>

  const totalPages = Math.max(1, Math.ceil(incomes.length / limit))
  const displayed = incomes.slice((currentPage - 1) * limit, currentPage * limit)

  return (
    <>
      <div className="flex flex-col gap-3">
        {displayed.map(income => (
          <IncomeCard
            key={income.id}
            income={income}
            onEdit={() => setModalState({ type: 'update', income })}
            onDelete={() => setModalState({ type: 'delete', income })}
          />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      {modalState?.type === 'update' && (
        <UpdateIncomeModal income={modalState.income} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'delete' && (
        <DeleteIncomeConfirmModal income={modalState.income} onClose={() => setModalState(null)} />
      )}
    </>
  )
}

export default IncomeContainer
