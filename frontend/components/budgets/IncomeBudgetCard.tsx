import type { Budget } from '../../backend/types/budgets'
import { useNavigate } from 'react-router-dom'

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

export default IncomeBudgetCard
