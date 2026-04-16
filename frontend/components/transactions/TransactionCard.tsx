import { type Transaction } from "../../backend/types/transactions"
import UpdateTransactionButton from './UpdateTransactionButton'
import DeleteTransactionButton from './DeleteTransactionButton'

const TransactionCard = ({ transaction, onEdit, onDelete, onMove }: { transaction: Transaction, onEdit: () => void, onDelete: () => void, onMove: () => void }) => {
  const isAdd = transaction.type === 'add'
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 hover:border-gray-600 transition-all">
      <div className="flex flex-col gap-1">
        <p className="text-white font-medium">{transaction.name}</p>
        <p className="text-gray-500 text-xs uppercase tracking-widest">{transaction.type}</p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-4">
        <span className={`font-semibold text-lg ${isAdd ? 'text-emerald-400' : 'text-red-400'}`}>
          {isAdd ? '+' : '-'}${transaction.amount}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onMove}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Move
          </button>
          <UpdateTransactionButton onClick={onEdit} />
          <DeleteTransactionButton onClick={onDelete} />
        </div>
      </div>
    </div>
  )
}

export default TransactionCard
