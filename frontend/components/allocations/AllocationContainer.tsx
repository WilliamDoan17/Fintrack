import { useState } from 'react'
import { useAllocations } from '../../hooks/allocations'
import { useBudgetStructure } from '../../hooks/budgets'
import type { Allocation } from '../../backend/types/allocations'
import Pagination from '../Pagination'
import DeleteAllocationConfirmModal from './DeleteAllocationConfirmModal'
import { formatDate } from '../../utils/time'

type ModalState = { type: 'delete'; allocation: Allocation; budgetPath: string }

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

const AllocationCard = ({ allocation, budgetPath, onDelete }: {
  allocation: Allocation
  budgetPath: string
  onDelete: () => void
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 hover:border-gray-600 transition-all">
    <div className="flex flex-col gap-1">
      <p className="text-white font-medium">{budgetPath}</p>
      <p className="text-gray-500 text-xs uppercase tracking-widest">{formatDate(allocation.created_at)}</p>
    </div>
    <div className="flex items-center justify-between sm:justify-end gap-4">
      <span className="font-semibold text-lg text-emerald-400">+${allocation.amount.toFixed(2)}</span>
      <DeleteButton onClick={onDelete} />
    </div>
  </div>
)

const AllocationContainerSkeleton = () => (
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

const AllocationContainer = ({ limit = 10 }: { limit?: number }) => {
  const { allocations, isLoading: alLoading, error: alError } = useAllocations()
  const { structure, isLoading: stLoading } = useBudgetStructure()
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const isLoading = alLoading || stLoading

  if (isLoading) return <AllocationContainerSkeleton />
  if (alError) return <p className="text-red-400 text-sm">Error loading allocations</p>
  if (allocations.length === 0) return <p className="text-gray-500 text-sm">No allocations yet.</p>

  const totalPages = Math.max(1, Math.ceil(allocations.length / limit))
  const displayed = allocations.slice((currentPage - 1) * limit, currentPage * limit)

  return (
    <>
      <div className="flex flex-col gap-3">
        {displayed.map(allocation => {
          const budgetPath = structure?.budgetIdToPath.get(allocation.to_budget_id) ?? allocation.to_budget_id
          return (
            <AllocationCard
              key={allocation.id}
              allocation={allocation}
              budgetPath={budgetPath}
              onDelete={() => setModalState({ type: 'delete', allocation, budgetPath })}
            />
          )
        })}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      {modalState?.type === 'delete' && (
        <DeleteAllocationConfirmModal
          allocation={modalState.allocation}
          budgetPath={modalState.budgetPath}
          onClose={() => setModalState(null)}
        />
      )}
    </>
  )
}

export default AllocationContainer
