import { type Transaction } from "../../backend/services/transactions"
import UpdateTransactionButton from './UpdateTransactionButton'
import DeleteTransactionButton from './DeleteTransactionButton'

const TransactionCard = ({ transaction, onEdit, onDelete }: { transaction: Transaction, onEdit: () => void, onDelete: () => void }) => {
  const isAdd = transaction.type === 'add'
  return (
    <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 hover:border-gray-600 transition-all">
      <div className="flex flex-col gap-1">
        <p className="text-white font-medium">{transaction.name}</p>
        <p className="text-gray-500 text-xs uppercase tracking-widest">{transaction.type}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`font-semibold text-lg ${isAdd ? 'text-emerald-400' : 'text-red-400'}`}>
          {isAdd ? '+' : '-'}${transaction.amount}
        </span>
        <UpdateTransactionButton onClick={onEdit} />
        <DeleteTransactionButton onClick={onDelete} />
      </div>
    </div>
  )
}

export default TransactionCard
