import type { Budget } from '../../backend/types/budgets'

const MoveBudgetButton = ({ budget, onClick }: { budget: Budget | null, onClick: () => void }) => {
  if (!budget) return null

  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm text-gray-400 hover:text-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
    >
      Move
    </button>
  )
}

export default MoveBudgetButton
