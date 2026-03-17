import { useState } from 'react'
import { type Transaction, deleteTransaction } from '../../backend/services/transactions'

const DeleteTransactionConfirmModal = ({ transaction, onSuccess, onClose }: { transaction: Transaction, onSuccess: () => Promise<void>, onClose: () => void }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const handleDelete = async () => {
    setLoading(true)
    deleteTransaction(transaction.id)
      .then(() => {
        onSuccess()
        onClose()
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-semibold mb-1">Delete Transaction</h2>
        <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete <span className="text-white">{transaction.name}</span>? This cannot be undone.</p>

        {error && <p className="text-red-400 text-sm mb-4">{error.message}</p>}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-400 active:bg-red-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deleting...' : 'Delete Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteTransactionConfirmModal
