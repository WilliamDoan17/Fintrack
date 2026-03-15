import { Transaction } from '../../backend/services/transactions'

const BalanceSummary = ({ transactions }: { transactions: Transaction[] }) => {
  let income = 0
  let expenses = 0

  transactions.forEach(({ type, amount }) => {
    if (type === 'add') {
      income += amount
    } else {
      expenses += amount
    }
  })

  const balance = income - expenses

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Income</p>
        <p className="text-emerald-400 font-semibold text-xl">+${income.toFixed(2)}</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Expenses</p>
        <p className="text-red-400 font-semibold text-xl">-${expenses.toFixed(2)}</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Balance</p>
        <p className={`font-semibold text-xl ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {balance >= 0 ? '+' : '-'}${Math.abs(balance).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

export default BalanceSummary
