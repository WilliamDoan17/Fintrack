import { useIncomeBudget } from '../../hooks/budgets'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Budget } from '../../backend/types/budgets'
import SpendingBudgetContainer from '../../components/budgets/SpendingBudgetContainer'
import CreateBudgetModal from '../../components/budgets/CreateBudgetModal'
import TransactionContainer from '../../components/transactions/TransactionContainer'
import BalanceSummary from '../../components/transactions/BalanceSummary'

type ModalState = { type: 'createBudget' }

const IncomeBudgetCard = ({ budget }: { budget: Budget }) => {
  const navigate = useNavigate()
  const isPositive = budget.balance >= 0

  return (
    <div
      className="bg-gray-900 border border-emerald-900/40 rounded-xl p-5 cursor-pointer hover:border-emerald-700 hover:shadow-emerald-900/20 hover:shadow-lg transition-all h-full flex flex-col items-center"
      onClick={() => navigate('/income')}
    >
      <p className="text-xs text-gray-500 uppercase tracking-widest">{budget.name}</p>
      <div className="flex-1 flex items-center justify-center">
        <p className={`font-bold text-2xl md:text-3xl ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '+' : '-'}${Math.abs(budget.balance).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const { budget: incomeBudget } = useIncomeBudget()

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
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            <div className="flex-1">
              <BalanceSummary />
            </div>
            {incomeBudget && (
              <div className="w-full md:w-56 shrink-0">
                <IncomeBudgetCard budget={incomeBudget} />
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div>
            <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-4">Recent Transactions</h2>
            <TransactionContainer />
          </div>

          {/* Spending Budgets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Your Budgets</h2>
              <button
                onClick={() => setModalState({ type: 'createBudget' })}
                className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                + Create Budget
              </button>
            </div>
            <SpendingBudgetContainer />
          </div>
        </div>
      </div>
      {modalState?.type === 'createBudget' && (
        <CreateBudgetModal onClose={() => setModalState(null)} />
      )}
    </div>
  )
}

export default Dashboard
