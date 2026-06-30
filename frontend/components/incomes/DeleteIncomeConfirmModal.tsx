import { useDeleteIncome } from '../../hooks/incomes'
import { useNotification } from '../../contexts/NotificationContext'
import type { Income } from '../../backend/types/incomes'

const DeleteIncomeConfirmModal = ({ income, onClose }: { income: Income; onClose: () => void }) => {
  const { notify } = useNotification()
  const { mutate: deleteIncome, isPending, error } = useDeleteIncome()

  const handleDelete = () => {
    deleteIncome(income.id, {
      onSuccess: () => { notify('Income deleted', 'success'); onClose() },
      onError: (err) => notify(err.message, 'error'),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-semibold mb-1">Delete Income</h2>
        <p className="text-gray-500 text-sm mb-6">
          Are you sure you want to delete <span className="text-white">{income.name}</span>? This cannot be undone.
        </p>
        {error && <p className="text-red-400 text-sm mb-4">{error.message}</p>}
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded text-gray-400 hover:text-white transition-all cursor-pointer">
            Cancel
          </button>
          <button
            disabled={isPending}
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-400 active:bg-red-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Deleting...' : 'Delete Income'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteIncomeConfirmModal
