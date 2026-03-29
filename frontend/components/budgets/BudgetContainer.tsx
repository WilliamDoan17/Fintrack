import useBudgets from '../../hooks/useBudgets.ts'
import BudgetCard from './BudgetCard'

const BudgetContainerSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex flex-col gap-3">
        <div className="w-24 h-4 bg-gray-800 rounded animate-pulse" />
        <div className="w-16 h-3 bg-gray-800 rounded animate-pulse mb-2" />
        <div className="w-20 h-6 bg-gray-800 rounded animate-pulse" />
      </div>
    ))}
  </div>
)

const BudgetContainer = ({ budgetQuery: { budgets, loading, error } }: { budgetQuery: ReturnType<typeof useBudgets> }) => {
  if (loading) return <BudgetContainerSkeleton />
  if (error) return <p className="text-red-400 text-sm">Something went wrong</p>
  if (budgets.length === 0) return <p className="text-gray-500 text-sm">No budgets yet. Create one to get started.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {budgets.map(budget => (
        <BudgetCard
          key={budget.id}
          budget={budget}
        />
      ))}
    </div>
  )
}

export default BudgetContainer
