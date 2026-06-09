import { useState } from 'react'
import { useCreateBudget } from '../../hooks/budgets'
import { useNotification } from '../../contexts/NotificationContext'

const CreateBudgetModal = ({ onClose, parentId = null }: { onClose: () => void, parentId?: string | null }) => {
  const [name, setName] = useState<string>('')
  const { notify } = useNotification()
  const { mutate: createBudget, isPending, error } = useCreateBudget()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createBudget({ name: name.trim(), parent_id: parentId }, {
      onSuccess: () => {
        notify('Budget created', 'success')
        onClose()
      },
      onError: (err) => notify(err.message, 'error'),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-semibold mb-1">Create a new budget</h2>
        <p className="text-gray-500 text-sm mb-6">Give your budget a name to get started.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor='budget-create-name' className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id='budget-create-name'
              placeholder="e.g. Groceries, Rent, Travel"
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error.message}</p>}
          <div className="flex gap-3 justify-end mt-2">
            <button
              type='button'
              onClick={onClose}
              className="px-4 py-2 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isPending}
              className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Creating...' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBudgetModal
