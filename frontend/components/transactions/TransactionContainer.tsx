import useTransactions from "../../hooks/useTransactions"
import TransactionCard from "./TransactionCard"

const TransactionContainer = ({ transactionQuery: { transactions, loading, error } }: { transactionQuery: ReturnType<typeof useTransactions> }) => {
  if (loading) return <p className="text-gray-500 text-sm">Loading transactions...</p>
  if (error) return <p className="text-red-400 text-sm">Error loading transactions</p>
  if (transactions.length === 0) return <p className="text-gray-500 text-sm">No transactions yet. Create one to get started.</p>
  return (
    <div className="flex flex-col gap-3">
      {transactions.map(transaction => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
        />
      ))}
    </div>
  )
}

export default TransactionContainer
