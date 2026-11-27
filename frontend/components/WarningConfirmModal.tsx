// Advisory confirm dialog shared by the transaction and transfer warnings. It warns, never
// blocks: the user can always proceed (see docs/decisions/0002-transaction-warning.md).
const WarningConfirmModal = ({ message, confirmLabel, onConfirm, onCancel }: {
  message: string
  confirmLabel: string
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
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
)

export default WarningConfirmModal
