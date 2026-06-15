import type { Budget } from '../../backend/types/budgets'
import { useNavigate } from 'react-router-dom'

const SpendingBudgetCard = ({ budget }: { budget: Budget }) => {
  const navigate = useNavigate()
  const isPositive = budget.balance >= 0

  const isAlert = budget.balance_threshold !== null && budget.balance <= budget.balance_threshold

  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-emerald-900 hover:shadow-emerald-900/20 hover:shadow-lg transition-all"
      onClick={() => navigate(`/budget/${budget.id}`)}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="text-xs text-gray-500 uppercase tracking-widest">Budget</p>
        {isAlert && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-900/50 text-red-400">
            Alert
          </span>
        )}
      </div>
      <p className="text-white font-semibold text-lg mb-2">{budget.name}</p>
      <p className={`font-bold text-xl ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {isPositive ? '+' : '-'}${Math.abs(budget.balance).toFixed(2)}
      </p>
    </div>
  )
}

export default SpendingBudgetCard
