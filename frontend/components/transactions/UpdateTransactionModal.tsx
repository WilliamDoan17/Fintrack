import { useState } from 'react'
import { updateTransaction, type Transaction, type TransactionType } from '../../backend/services/transactions'
import { useNotification } from '../../contexts/NotificationContext'

const UpdateTransactionModal = ({ transaction, onSuccess, onClose }: { transaction: Transaction, onSuccess: () => void, onClose: () => void }) => {
  const [name, setName] = useState<string>(transaction.name)
  const [type, setType] = useState<TransactionType>(transaction.type)
  const [amount, setAmount] = useState<number>(transaction.amount)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const { notify } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    updateTransaction(transaction.id, { name, type, amount })
      .then(() => {
        notify('Transaction updated', 'success')
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-semibold mb-1">Update Transaction</h2>
        <p className="text-gray-500 text-sm mb-6">Edit the details of this transaction.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor='update-transaction-name' className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              id='update-transaction-name'
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="e.g. Groceries, Salary, Rent"
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType('add')}
                className={`flex-1 py-2 rounded border transition-all cursor-pointer ${type === 'add'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
              >
                + Add
              </button>
              <button
                type="button"
                onClick={() => setType('withdraw')}
                className={`flex-1 py-2 rounded border transition-all cursor-pointer ${type === 'withdraw'
                  ? 'bg-red-500/10 border-red-500 text-red-400'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
              >
                - Withdraw
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label htmlFor='update-transaction-amount' className="text-sm text-gray-400">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id='update-transaction-amount'
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                min={0}
                step={0.01}
                className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 pl-7 w-full focus:outline-none focus:border-emerald-400 transition-all"
                placeholder='0'
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error.message}</p>}

          {/* Actions */}
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
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Transaction'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default UpdateTransactionModal
