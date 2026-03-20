import useBudgets from '../../hooks/useBudgets'
import { useState } from 'react'
import BudgetContainer from '../../components/budgets/BudgetContainer'
import CreateBudgetModal from '../../components/budgets/CreateBudgetModal'
import CreateBudgetButton from '../../components/budgets/CreateBudgetButton'
import TransactionContainer from '../../components/transactions/TransactionContainer'
import BalanceSummary from '../../components/transactions/BalanceSummary'
import useTransactions from '../../hooks/useTransactions'

type ModalState = { type: 'createBudget' }

const Dashboard = () => {
  const [modalState, setModalState] = useState<ModalState | null>(null)
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
        <div className="flex flex-col gap-10">
          {/* Balance + Recent Transactions two-column */}
          <div className="flex gap-6 items-start">
            <div className="w-[30%] shrink-0">
              <BalanceSummary transactionQuery={transactionQuery} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-400 text-sm uppercase tracking-widest">Recent Transactions</h2>
              </div>
              <TransactionContainer transactionQuery={transactionQuery} />
            </div>
          </div>
          {/* Budgets Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Your Budgets</h2>
              <CreateBudgetButton onClick={() => setModalState({ type: 'createBudget' })} />
            </div>
            <BudgetContainer budgetQuery={budgetQuery} />
          </div>
        </div>
      </div>
      {modalState?.type === 'createBudget' && (
        <CreateBudgetModal budgetQuery={budgetQuery} onClose={() => setModalState(null)} />
      )}
    </div>
  )
}

export default Dashboard
