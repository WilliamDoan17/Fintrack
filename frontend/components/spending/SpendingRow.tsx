import type { Transaction } from '../../backend/types/transactions'

const SpendingRow = ({ transaction, budgetPath }: { transaction: Transaction, budgetPath: string }) => {
  const date = new Date(transaction.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 hover:border-gray-700 transition-all">
      <div className="flex flex-col gap-1">
        <p className="text-white text-sm font-medium">{transaction.name}</p>
        <p className="text-gray-500 text-xs">{budgetPath}</p>
      </div>
      <div className="flex flex-col sm:items-end gap-1 shrink-0">
        <p className="text-red-400 font-semibold text-sm">-${transaction.amount.toFixed(2)}</p>
        <p className="text-gray-600 text-xs">{date}</p>
      </div>
    </div>
  )
}

export default SpendingRow
