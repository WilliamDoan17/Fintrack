import { type Dispatch, type FormEvent, type SetStateAction, useState } from "react"
import { updateBudget } from '../../backend/services/budgets'

const UpdateBudgetNameInput = ({ budgetId, budgetName, onSuccess, setIsOpen }: { budgetId: string, budgetName: string, onSuccess: () => Promise<void>, setIsOpen: Dispatch<SetStateAction<boolean>> }) => {
  const [name, setName] = useState<string>(budgetName)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    updateBudget(budgetId, { name })
      .then(() => {
        onSuccess()
        setIsOpen(false)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your budget's name"
          className="bg-gray-800 text-white text-3xl font-bold border border-gray-700 rounded px-3 py-1 focus:outline-none focus:border-emerald-400 transition-all w-full"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-3 py-1 rounded text-gray-400 hover:text-white transition-all cursor-pointer text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white text-sm font-medium px-3 py-1 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error.message}</p>}
    </form>
  )
}

export default UpdateBudgetNameInput
