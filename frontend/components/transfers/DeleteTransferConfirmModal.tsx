import { useState } from 'react'
import { deleteTransfer, type Transfer } from '../../backend/services/transfers'
import { useNotification } from '../../contexts/NotificationContext'

const DeleteTransferConfirmModal = ({ transfer, onSuccess, onClose }: { transfer: Transfer, onSuccess: () => void, onClose: () => void }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { notify } = useNotification()

  const handleDelete = () => {
    setLoading(true)
    deleteTransfer(transfer.id)
      .then(() => {
        notify('Transfer deleted', 'success')
        onSuccess()
        onClose()
      })
      .catch((err) => {
        notify(err.message, 'error')
        setError(err)
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-semibold mb-1">Delete Transfer</h2>
        <p className="text-gray-500 text-sm mb-6">
          Are you sure you want to delete <span className="text-white">{transfer.name}</span>? This will reverse the balance on both budgets.
        </p>
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
            {loading ? 'Deleting...' : 'Delete Transfer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteTransferConfirmModal
