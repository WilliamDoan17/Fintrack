import { useState, type Dispatch, type SetStateAction } from 'react'
import { createBudget } from '../../backend/services/budgets'
import useBudgets from '../../hooks/useBudgets'

const CreateBudgetModal = ({ budgetQuery: { refetch }, setIsOpen, parentId = null }: { budgetQuery: ReturnType<typeof useBudgets>, setIsOpen: Dispatch<SetStateAction<boolean>>, parentId?: string | null }) => {
  const [name, setName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const handleClose = () => setIsOpen(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    createBudget({ name, parent_id: parentId })
      .then(() => {
        refetch()
        handleClose()
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md shadow-xl">
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
              onClick={handleClose}
              className="px-4 py-2 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBudgetModal
