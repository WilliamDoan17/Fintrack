import { type Transaction } from "../../backend/types/transactions"

const EditButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-emerald-400 transition-all cursor-pointer">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  </button>
)

const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-red-400 transition-all cursor-pointer">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  </button>
)

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
          <EditButton onClick={onEdit} />
          <DeleteButton onClick={onDelete} />
        </div>
      </div>
    </div>
  )
}

export default TransactionCard
