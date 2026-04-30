import useSpendingBudgets from '../../hooks/useSpendingBudgets'
import useIncomeBudget from '../../hooks/useIncomeBudget'
import { useState } from 'react'
import SpendingBudgetContainer from '../../components/budgets/SpendingBudgetContainer'
import IncomeBudgetCard from '../../components/budgets/IncomeBudgetCard'
import CreateBudgetModal from '../../components/budgets/CreateBudgetModal'
import CreateBudgetButton from '../../components/budgets/CreateBudgetButton'
import TransactionContainer from '../../components/transactions/TransactionContainer'
import BalanceSummary from '../../components/transactions/BalanceSummary'
import useTransactions from '../../hooks/useTransactions'
import useTransfers from '../../hooks/useTransfers'

type ModalState = { type: 'createBudget' }

const Dashboard = () => {
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const budgetQuery = useSpendingBudgets(null)
  const { budget: incomeBudget } = useIncomeBudget()
  const transactionQuery = useTransactions(null)
  const transferQuery = useTransfers(null)

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-white text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track your finances</p>
        </div>
        <div className="flex flex-col gap-8 md:gap-10">
          {/* Balance + Recent Transactions */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="w-full lg:w-[30%] shrink-0">
              <BalanceSummary transactionQuery={transactionQuery} />
            </div>
            <div className="w-full flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-400 text-sm uppercase tracking-widest">Recent Transactions</h2>
              </div>
              <TransactionContainer
                transactionQuery={transactionQuery}
                budgetQuery={budgetQuery}
                transferQuery={transferQuery}
              />
            </div>
          </div>
          {/* Income Budget */}
          {incomeBudget && (
            <div>
              <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-4">Income</h2>
              <IncomeBudgetCard budget={incomeBudget} />
            </div>
          )}

          {/* Spending Budgets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Your Budgets</h2>
              <CreateBudgetButton onClick={() => setModalState({ type: 'createBudget' })} />
            </div>
            <SpendingBudgetContainer budgetQuery={budgetQuery} />
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
