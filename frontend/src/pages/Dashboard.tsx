import useBudgets from '../../hooks/useBudgets'
import { useState } from 'react'
import BudgetContainer from '../../components/budgets/BudgetContainer'
import CreateBudgetModal from '../../components/budgets/CreateBudgetModal'

const Dashboard = () => {
  const [openCreateBudgetModal, setOpenCreateBudgetModal] = useState<boolean>(false)
  const budgetQuery = useBudgets(null)

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-white text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and track your budgets</p>
          </div>
          <button
            onClick={() => setOpenCreateBudgetModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            + Create Budget
          </button>
        </div>

        <div>
          <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-4">Your Budgets</h2>
          <BudgetContainer budgetQuery={budgetQuery} />
        </div>
      </div>

      {openCreateBudgetModal && (
        <CreateBudgetModal budgetQuery={budgetQuery} setIsOpen={setOpenCreateBudgetModal} />
      )}
    </div>
  )
}

export default Dashboard
