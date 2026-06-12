import type { Transaction } from '../../backend/types/transactions'
import type { Transfer } from '../../backend/types/transfers'
import { useTransactions } from '../../hooks/transactions'
import { useTransfers } from '../../hooks/transfers'
import TransactionCard from './TransactionCard'
import TransferCard from '../transfers/TransferCard'
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import UpdateTransactionModal from './UpdateTransactionModal'
import DeleteTransactionConfirmModal from './DeleteTransactionConfirmModal'
import MoveTransactionModal from './MoveTransactionModal'
import UpdateTransferModal from '../transfers/UpdateTransferModal'
import DeleteTransferConfirmModal from '../transfers/DeleteTransferConfirmModal'

type ModalState =
  | { type: 'update', transaction: Transaction }
  | { type: 'delete', transaction: Transaction }
  | { type: 'move', transaction: Transaction }
  | { type: 'updateTransfer', transfer: Transfer }
  | { type: 'deleteTransfer', transfer: Transfer }

type CardItem =
  | { kind: 'transaction'; data: Transaction }
  | { kind: 'transfer'; data: Transfer }

function mergeSorted(transactions: Transaction[], transfers: Transfer[]): CardItem[] {
  const result: CardItem[] = []
  let t = 0, r = 0
  while (t < transactions.length && r < transfers.length) {
    const txDate = new Date(transactions[t].created_at).getTime()
    const trDate = new Date(transfers[r].created_at).getTime()
    if (txDate >= trDate) result.push({ kind: 'transaction', data: transactions[t++] })
    else result.push({ kind: 'transfer', data: transfers[r++] })
  }
  while (t < transactions.length) result.push({ kind: 'transaction', data: transactions[t++] })
  while (r < transfers.length) result.push({ kind: 'transfer', data: transfers[r++] })
  return result
}

const TransactionContainerSkeleton = () => (
  <div className="flex flex-col gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4">
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
          <div className="w-16 h-3 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="w-16 h-5 bg-gray-700 rounded animate-pulse" />
      </div>
    ))}
  </div>
)

const TransactionContainer = ({ budgetId, limit = 3 }: { budgetId?: string, limit?: number }) => {
  const { transactions, isLoading: txLoading, error: txError } = useTransactions(budgetId ?? null)
  const { transfers } = useTransfers(budgetId ?? null)
  const [modalState, setModalState] = useState<ModalState | null>(null)

  const merged = useMemo(() => mergeSorted(transactions, transfers), [transactions, transfers])

  if (txLoading) return <TransactionContainerSkeleton />
  if (txError) return <p className="text-red-400 text-sm">Error loading transactions</p>
  if (merged.length === 0) return <p className="text-gray-500 text-sm">No transactions yet. Create one to get started.</p>

  return (
    <div className="flex flex-col gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
      {merged.slice(0, limit).map(item =>
        item.kind === 'transaction' ? (
          <TransactionCard
            key={item.data.id}
            transaction={item.data}
            onEdit={() => setModalState({ type: 'update', transaction: item.data })}
            onDelete={() => setModalState({ type: 'delete', transaction: item.data })}
            onMove={() => setModalState({ type: 'move', transaction: item.data })}
          />
        ) : (
          <TransferCard
            key={item.data.id}
            transfer={item.data}
            budgetId={budgetId!}
            onEdit={() => setModalState({ type: 'updateTransfer', transfer: item.data })}
            onDelete={() => setModalState({ type: 'deleteTransfer', transfer: item.data })}
          />
        )
      )}

      {merged.length > limit && (
        <Link
          to="/spending"
          className="text-gray-400 hover:text-emerald-400 text-sm transition-all mt-2"
        >
          View all spending →
        </Link>
      )}

      {modalState?.type === 'update' && (
        <UpdateTransactionModal transaction={modalState.transaction} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'delete' && (
        <DeleteTransactionConfirmModal transaction={modalState.transaction} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'move' && (
        <MoveTransactionModal transaction={modalState.transaction} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'updateTransfer' && (
        <UpdateTransferModal transfer={modalState.transfer} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'deleteTransfer' && (
        <DeleteTransferConfirmModal transfer={modalState.transfer} onClose={() => setModalState(null)} />
      )}
    </div>
  )
}

export default TransactionContainer
