import type { Transfer } from '../../backend/types/transfers'
import UpdateTransferButton from './UpdateTransferButton'
import DeleteTransferButton from './DeleteTransferButton'

const TransferCard = ({ transfer, budgetId, onEdit, onDelete }: {
  transfer: Transfer
  budgetId: string
  onEdit: () => void
  onDelete: () => void
}) => {
  const isSource = transfer.from_budget_id === budgetId

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 hover:border-gray-600 transition-all">
      <div className="flex flex-col gap-1">
        <p className="text-white font-medium">{transfer.name}</p>
        <p className="text-gray-500 text-xs uppercase tracking-widest">
          {isSource ? 'transfer out' : 'transfer in'}
        </p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-4">
        <span className={`font-semibold text-lg ${isSource ? 'text-red-400' : 'text-emerald-400'}`}>
          {isSource ? '-' : '+'}${transfer.amount}
        </span>
        <div className="flex items-center gap-2">
          <UpdateTransferButton onClick={onEdit} />
          <DeleteTransferButton onClick={onDelete} />
        </div>
      </div>
    </div>
  )
}

export default TransferCard
