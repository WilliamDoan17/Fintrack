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
  const spendingBudgetQuery = useSpendingBudgets(null)
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
          {/* Summary Row: Balance + Income */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <BalanceSummary transactionQuery={transactionQuery} />
            {incomeBudget && <IncomeBudgetCard budget={incomeBudget} />}
          </div>

          {/* Recent Transactions */}
          <div>
            <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-4">Recent Transactions</h2>
            <TransactionContainer
              transactionQuery={transactionQuery}
              spendingBudgetQuery={spendingBudgetQuery}
              transferQuery={transferQuery}
            />
          </div>

          {/* Spending Budgets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Your Budgets</h2>
              <CreateBudgetButton onClick={() => setModalState({ type: 'createBudget' })} />
            </div>
            <SpendingBudgetContainer spendingBudgetQuery={spendingBudgetQuery} />
          </div>
        </div>
      </div>
      {modalState?.type === 'createBudget' && (
        <CreateBudgetModal spendingBudgetQuery={spendingBudgetQuery} onClose={() => setModalState(null)} />
      )}
    </div>
  )
}

export default Dashboard
