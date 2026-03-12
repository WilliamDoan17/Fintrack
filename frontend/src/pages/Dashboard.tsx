import useBudgets from '../../hooks/useBudgets'
import { createBudget } from '../../backend/services/budgets'
import type { Budget } from '../../backend/services/budgets'
import { useState } from 'react'

const BudgetCard = ({ budget }: { budget: Budget }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-4 cursor-pointer hover:shadow-emerald-900/20 hover:shadow-lg transition-all">
      <p className="text-white font-medium">{budget.name}</p>
    </div>
  )
}

const BudgetContainer = ({ budgetQuery: { budgets, loading, error } }: { budgetQuery: ReturnType<typeof useBudgets> }) => {
  if (error) return <div className="text-red-400 text-sm">Something went wrong</div>
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading
        ? <div className="text-gray-400 text-sm">Loading...</div>
        : budgets.map(budget => (
          <BudgetCard
            key={budget.id}
            budget={budget}
          />
        ))
      }
    </div>
  )
}

const CreateBudgetModal = ({ budgetQuery: { refetch } }: { budgetQuery: ReturnType<typeof useBudgets> }) => {
  const [name, setName] = useState<string>('');
  const handleSubmit = async () => {
    createBudget({
      name: name,
    })
  }
  return (
    <div
    >
      <form
        onSubmit={handleSubmit}
      >

      </form>
    </div>
  )
}

const Dashboard = () => {
  const budgetQuery = useBudgets(null)

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <h1 className="text-white text-2xl font-semibold mb-6">Dashboard</h1>
      <button>Add Budget</button>
      <BudgetContainer budgetQuery={budgetQuery} />
    </div>
  )
}

export default Dashboard
