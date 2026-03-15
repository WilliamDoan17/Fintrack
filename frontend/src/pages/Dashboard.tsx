import useBudgets from '../../hooks/useBudgets'
import { useState } from 'react'
import BudgetContainer from '../../components/budgets/BudgetContainer'
import CreateBudgetModal from '../../components/budgets/CreateBudgetModal'
import CreateBudgetButton from '../../components/budgets/CreateBudgetButton'
import TransactionContainer from '../../components/transactions/TransactionContainer'
import useTransactions from '../../hooks/useTransactions'

const Dashboard = () => {
  const [openCreateBudgetModal, setOpenCreateBudgetModal] = useState<boolean>(false)
  const budgetQuery = useBudgets(null)
  const transactionQuery = useTransactions(null)

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-white text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track your finances</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-10">

          {/* Recent Transactions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Recent Transactions</h2>
            </div>
            <TransactionContainer transactionQuery={transactionQuery} />
          </div>

          {/* Budgets Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Your Budgets</h2>
              <CreateBudgetButton setOpenModal={setOpenCreateBudgetModal} />
            </div>
            <BudgetContainer budgetQuery={budgetQuery} />
          </div>

        </div>
      </div>

      {openCreateBudgetModal && (
        <CreateBudgetModal budgetQuery={budgetQuery} setIsOpen={setOpenCreateBudgetModal} />
      )}
    </div>
  )
}

export default Dashboard
