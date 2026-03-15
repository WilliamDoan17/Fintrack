import useBudgets from '../../hooks/useBudgets.ts'
import BudgetCard from './BudgetCard'

const BudgetContainer = ({ budgetQuery: { budgets, loading, error } }: { budgetQuery: ReturnType<typeof useBudgets> }) => {
  if (loading) return <p className="text-gray-500 text-sm">Loading budgets...</p>
  if (error) return <p className="text-red-400 text-sm">Something went wrong</p>
  if (budgets.length === 0) return <p className="text-gray-500 text-sm">No budgets yet. Create one to get started.</p>
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
