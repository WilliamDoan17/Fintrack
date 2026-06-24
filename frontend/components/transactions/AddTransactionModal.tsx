import { useState } from 'react'
import { useCreateTransaction } from '../../hooks/transactions'
import { useBudget, useBudgetBalance } from '../../hooks/budgets'
import { useNotification } from '../../contexts/NotificationContext'

const TransactionWarningModal = ({ message, onConfirm, onCancel }: {
  message: string
  onConfirm: () => void
  onCancel: () => void
}) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-md shadow-xl">
      <h2 className="text-white text-xl font-semibold mb-1">Are you sure?</h2>
      <p className="text-gray-400 text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-500 hover:bg-red-400 active:bg-red-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          Add Anyway
        </button>
      </div>
    </div>
  </div>
)

const AddTransactionModal = ({ onClose, budgetId, budgetType }: {
  onClose: () => void
  budgetId: string
  budgetType: 'spending' | 'income'
}) => {
  const [name, setName] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [warningMessage, setWarningMessage] = useState<string | null>(null)
  const { notify } = useNotification()
  const { mutate: createTransaction, isPending, error } = useCreateTransaction()
  const { budget } = useBudget(budgetType === 'spending' ? budgetId : null)
  const { balance } = useBudgetBalance(budgetId)

  const submit = () => {
    createTransaction({ name, amount: parseFloat(amount), budget_id: budgetId }, {
      onSuccess: () => {
        notify('Transaction added', 'success')
        onClose()
      },
      onError: (err) => notify(err.message, 'error'),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (budgetType === 'spending') {
      const newBalance = balance - parseFloat(amount)
      if (newBalance < 0) {
        setWarningMessage('This transaction will result in a negative balance.')
        return
      }
      if (budget?.balance_threshold !== null && budget?.balance_threshold !== undefined && newBalance <= budget.balance_threshold) {
        setWarningMessage('This transaction will push your balance to or below the alert threshold.')
        return
      }
    }
    submit()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-md shadow-xl">
          <h2 className="text-white text-xl font-semibold mb-1">Add Transaction</h2>
          <p className="text-gray-500 text-sm mb-6">Record a new transaction for this budget.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor='add-transaction-name' className="text-sm text-gray-400">Name</label>
              <input
                type="text"
                id='add-transaction-name'
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="e.g. Groceries, Salary, Rent"
                className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1">
              <label htmlFor='add-transaction-amount' className="text-sm text-gray-400">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  id='add-transaction-amount'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                disabled={isPending}
                className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Adding...' : '+ Add Transaction'}
              </button>
            </div>

          </form>
        </div>
      </div>

      {warningMessage && (
        <TransactionWarningModal
          message={warningMessage}
          onConfirm={() => { setWarningMessage(null); submit() }}
          onCancel={() => setWarningMessage(null)}
        />
      )}
    </>
  )
}

export default AddTransactionModal
