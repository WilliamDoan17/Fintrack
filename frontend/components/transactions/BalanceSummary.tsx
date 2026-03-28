import useTransactions from '../../hooks/useTransactions'

const BalanceSummary = ({ transactionQuery: { transactions, loading, error } }: { transactionQuery: ReturnType<typeof useTransactions> }) => {
  if (loading) return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading balance...</p>
    </div>
  )
  if (error) return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-center">
      <p className="text-red-400 text-sm">Error loading balance</p>
    </div>
  )

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

export default BalanceSummary

