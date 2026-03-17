import type { Transaction } from "../../backend/services/transactions"
import useTransactions from "../../hooks/useTransactions"
import TransactionCard from "./TransactionCard"
import { useState } from 'react'
import UpdateTransactionModal from './UpdateTransactionModal'
import DeleteTransactionConfirmModal from './DeleteTransactionConfirmModal'

type ModalState =
  | { type: 'update', transaction: Transaction }
  | { type: 'delete', transaction: Transaction }

const TransactionContainer = ({ transactionQuery: { transactions, loading, error, refetch }, limit = 3 }: { transactionQuery: ReturnType<typeof useTransactions>, limit?: number }) => {
  const [modalState, setModalState] = useState<ModalState | null>(null)

  if (loading) return <p className="text-gray-500 text-sm">Loading transactions...</p>
  if (error) return <p className="text-red-400 text-sm">Error loading transactions</p>
  if (transactions.length === 0) return <p className="text-gray-500 text-sm">No transactions yet. Create one to get started.</p>

  return (
    <div className="flex flex-col gap-3">
      {transactions
        .slice(0, limit)
        .map(transaction => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onEdit={() => setModalState({ type: 'update', transaction })}
            onDelete={() => setModalState({ type: 'delete', transaction })}
          />
        ))}
      {modalState?.type === 'update' && (
        <UpdateTransactionModal
          transaction={modalState.transaction}
          onSuccess={refetch}
          onClose={() => setModalState(null)}
        />
      )}
      {
        modalState?.type === 'delete' && (
          <DeleteTransactionConfirmModal
            transaction={modalState.transaction}
            onSuccess={refetch}
            onClose={() => setModalState(null)}
          />
        )
      }
    </div>
  )
}

export default TransactionContainer
