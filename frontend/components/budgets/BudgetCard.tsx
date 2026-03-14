import { type Budget } from '../../backend/services/budgets.ts'

const BudgetCard = ({ budget }: { budget: Budget }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-emerald-900 hover:shadow-emerald-900/20 hover:shadow-lg transition-all">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Budget</p>
      <p className="text-white font-semibold text-lg">{budget.name}</p>
    </div>
  )
}

export default BudgetCard
