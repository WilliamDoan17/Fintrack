import { useDeleteBudget } from '../../hooks/budgets'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../../contexts/NotificationContext'

const DeleteBudgetConfirmModal = ({ budgetId, budgetName, onClose }: { budgetId: string, budgetName: string, onClose: () => void }) => {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const { mutate: deleteBudget, isPending, error } = useDeleteBudget()

  const handleDelete = () => {
    deleteBudget(budgetId, {
      onSuccess: () => {
        notify('Budget deleted', 'success')
        onClose()
        navigate('/dashboard')
      },
      onError: (err) => notify(err.message, 'error'),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-semibold mb-1">Delete Budget</h2>
        <p className="text-gray-400 text-sm mb-6">
          Are you sure you want to delete <span className="text-white font-medium">{budgetName}</span>? All transactions and sub-budgets will be permanently deleted.
        </p>
        {error && <p className="text-red-400 text-sm mb-4">{error.message}</p>}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-400 active:bg-red-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteBudgetConfirmModal
