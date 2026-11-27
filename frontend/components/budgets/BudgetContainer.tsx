import type { Budget } from '../../backend/types/budgets'
import { useBudgets, useBudgetBalance } from '../../hooks/budgets'
import { useNavigate } from 'react-router-dom'

const BudgetCard = ({ budget }: { budget: Budget }) => {
  const navigate = useNavigate()
  const { own, branch } = useBudgetBalance(budget.id)
  const balance = branch.balance
  const isPositive = balance >= 0
  const isAlert = own.balance < 0 || (budget.balance_threshold !== null && own.balance <= budget.balance_threshold)
  // Show Own only when it differs from the branch (compared to the cent), so most cards keep one number
  const showOwn = Math.round(own.balance * 100) !== Math.round(branch.balance * 100)

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
        {isPositive ? '+' : '-'}${Math.abs(balance).toFixed(2)}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">
        Branch total
        {showOwn && (
          <>
            {' · Available '}
            <span className={`font-medium ${own.balance >= 0 ? 'text-gray-300' : 'text-red-400'}`}>
              {own.balance >= 0 ? '+' : '-'}${Math.abs(own.balance).toFixed(2)}
            </span>
          </>
        )}
      </p>
    </div>
  )
}

const BudgetContainerSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex flex-col gap-3">
        <div className="w-24 h-4 bg-gray-800 rounded animate-pulse" />
        <div className="w-16 h-3 bg-gray-800 rounded animate-pulse mb-2" />
        <div className="w-20 h-6 bg-gray-800 rounded animate-pulse" />
      </div>
    ))}
  </div>
)

const BudgetContainer = ({ parentId = null }: { parentId?: string | null }) => {
  const { budgets, isLoading, error } = useBudgets(parentId)

  if (isLoading) return <BudgetContainerSkeleton />
  if (error) return <p className="text-red-400 text-sm">Something went wrong</p>
  if (budgets.length === 0) return <p className="text-gray-500 text-sm">No budgets yet. Create one to get started.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {budgets.map(budget => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </div>
  )
}

export default BudgetContainer
