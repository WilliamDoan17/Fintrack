import useTransactions from '../../hooks/useTransactions'
import useTransfers from '../../hooks/useTransfers'

const BalanceSummary = ({ transactionQuery: { transactions, loading, error }, transferQuery, budgetId }: {
  transactionQuery: ReturnType<typeof useTransactions>
  transferQuery?: ReturnType<typeof useTransfers>
  budgetId?: string
}) => {
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

  let transfersIn = 0
  let transfersOut = 0

  if (transferQuery) {
    transferQuery.transfers.forEach(({ from_budget_id, amount }) => {
      if (from_budget_id === budgetId) {
        transfersOut += amount
      } else {
        transfersIn += amount
      }
    })
  }

  const balance = income - expenses + transfersIn - transfersOut

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
        {(transfersIn > 0 || transfersOut > 0) && (
          <>
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Transferred In</p>
              <p className="text-emerald-400 font-semibold text-base md:text-lg">+${transfersIn.toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Transferred Out</p>
              <p className="text-red-400 font-semibold text-base md:text-lg">-${transfersOut.toFixed(2)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BalanceSummary

