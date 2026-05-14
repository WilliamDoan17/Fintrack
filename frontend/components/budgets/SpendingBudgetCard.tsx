import type { Budget } from '../../backend/types/budgets'
import { useNavigate } from 'react-router-dom'

const SpendingBudgetCard = ({ budget }: { budget: Budget }) => {
  const navigate = useNavigate()
  const isPositive = budget.balance >= 0

  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-emerald-900 hover:shadow-emerald-900/20 hover:shadow-lg transition-all"
      onClick={() => navigate(`/budget/${budget.id}`)}
    >
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Budget</p>
      <p className="text-white font-semibold text-lg mb-2">{budget.name}</p>
      <p className={`font-bold text-xl ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {isPositive ? '+' : '-'}${Math.abs(budget.balance).toFixed(2)}
      </p>
    </div>
  )
}

export default SpendingBudgetCard
