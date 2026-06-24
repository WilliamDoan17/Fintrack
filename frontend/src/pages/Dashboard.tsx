import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BudgetContainer from '../../components/budgets/BudgetContainer'
import CreateBudgetModal from '../../components/budgets/CreateBudgetModal'
import TransactionContainer from '../../components/transactions/TransactionContainer'
import TransferContainer from '../../components/transfers/TransferContainer'
import Tabs from '../../components/Tabs'
import { useTransactions } from '../../hooks/transactions'
import { useIncomes } from '../../hooks/incomes'

const BalanceSummary = () => {
  const { transactions, isLoading, error } = useTransactions(null)

  if (isLoading) return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading balance...</p>
    </div>
  )
  if (error) return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-center">
      <p className="text-red-400 text-sm">Error loading balance</p>
    </div>
  )

  const income = 0
  let expenses = 0
  transactions.forEach(({ amount }) => {
    expenses += amount
  })
  const balance = income - expenses

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6 flex flex-col gap-4">
      <div className="flex flex-col items-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Balance</p>
        <p className={`font-bold text-2xl md:text-3xl ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {balance >= 0 ? '+' : '-'}${Math.abs(balance).toFixed(2)}
        </p>
      </div>
      <div className="border-t border-gray-800" />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Income</p>
          <p className="text-emerald-400 font-semibold text-base md:text-lg">+${income.toFixed(2)}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Expenses</p>
          <p className="text-red-400 font-semibold text-base md:text-lg">-${expenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

type ModalState = { type: 'createBudget' }

const IncomeSummary = () => {
  const navigate = useNavigate()
  const { incomes, isLoading, error } = useIncomes()

  if (isLoading) return (
    <div className="bg-gray-900 border border-emerald-900/40 rounded-xl p-5 h-full flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  )
  if (error) return (
    <div className="bg-gray-900 border border-emerald-900/40 rounded-xl p-5 h-full flex items-center justify-center">
      <p className="text-red-400 text-sm">Error loading income</p>
    </div>
  )

  const total = incomes.reduce((sum, { amount }) => sum + amount, 0)

  return (
    <div
      className="bg-gray-900 border border-emerald-900/40 rounded-xl p-5 cursor-pointer hover:border-emerald-700 hover:shadow-emerald-900/20 hover:shadow-lg transition-all h-full flex flex-col items-center"
      onClick={() => navigate('/income')}
    >
      <p className="text-xs text-gray-500 uppercase tracking-widest">Income</p>
      <div className="flex-1 flex items-center justify-center">
        <p className="font-bold text-2xl md:text-3xl text-emerald-400">
          +${total.toFixed(2)}
        </p>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [modalState, setModalState] = useState<ModalState | null>(null)

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
            <div className="w-full md:w-56 shrink-0">
              <IncomeSummary />
            </div>
          </div>

          {/* Recent Activity */}
          <Tabs tabs={[
            { label: 'Transactions', content: <TransactionContainer viewAll="link" /> },
            { label: 'Transfers', content: <TransferContainer limit={3} /> },
          ]} />

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
            <BudgetContainer />
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
