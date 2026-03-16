import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import { updateBudget } from '../../backend/services/budgets'

const UpdateBudgetNameInput = ({ budgetId, budgetName, onSuccess, setIsOpen }: { budgetId: string, budgetName: string, onSuccess: () => Promise<void>, setIsOpen: Dispatch<SetStateAction<boolean>> }) => {
  const [name, setName] = useState<string>(budgetName)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    updateBudget(budgetId, {
      name: name,
    })
      .then(() => {
        onSuccess()
        setIsOpen(false)
      })
      .catch(setError)
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your budget's name"
      />
      {
        error && <p>{error.message}</p>
      }
      <button
        type="button"
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
      >
        Confirm
      </button>
    </form>
  )
}

export default UpdateBudgetNameInput
