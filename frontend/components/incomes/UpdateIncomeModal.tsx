import { useState } from 'react'
import { useUpdateIncome } from '../../hooks/incomes'
import { useNotification } from '../../contexts/NotificationContext'
import type { Income } from '../../backend/types/incomes'

const UpdateIncomeModal = ({ income, onClose }: { income: Income; onClose: () => void }) => {
  const [name, setName] = useState(income.name)
  const [amount, setAmount] = useState(income.amount.toString())
  const { notify } = useNotification()
  const { mutate: updateIncome, isPending, error } = useUpdateIncome()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateIncome({ id: income.id, updates: { name, amount: parseFloat(amount) } }, {
      onSuccess: () => { notify('Income updated', 'success'); onClose() },
      onError: (err) => notify(err.message, 'error'),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-semibold mb-1">Update Income</h2>
        <p className="text-gray-500 text-sm mb-6">Edit the details of this income entry.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="update-income-name" className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              id="update-income-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Salary, Freelance, Bonus"
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="update-income-amount" className="text-sm text-gray-400">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                id="update-income-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 pl-7 w-full focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error.message}</p>}
          <div className="flex gap-3 justify-end mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded text-gray-400 hover:text-white transition-all cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Updating...' : 'Update Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateIncomeModal
