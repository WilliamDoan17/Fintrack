import { useState } from 'react'
import { updateTransfer, type Transfer } from '../../backend/services/transfers'
import { useNotification } from '../../contexts/NotificationContext'

const UpdateTransferModal = ({ transfer, onSuccess, onClose }: { transfer: Transfer, onSuccess: () => void, onClose: () => void }) => {
  const [name, setName] = useState(transfer.name)
  const [amount, setAmount] = useState(transfer.amount.toString())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { notify } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    updateTransfer(transfer.id, { name, amount: parseFloat(amount) })
      .then(() => {
        notify('Transfer updated', 'success')
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
        <h2 className="text-white text-xl font-semibold mb-1">Update Transfer</h2>
        <p className="text-gray-500 text-sm mb-6">Edit the details of this transfer.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 pl-7 w-full focus:outline-none focus:border-emerald-400 transition-all"
                placeholder="0"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error.message}</p>}

          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name || !amount}
              className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Transfer'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default UpdateTransferModal
