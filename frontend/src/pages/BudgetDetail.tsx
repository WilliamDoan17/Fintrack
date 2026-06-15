import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useBudget, useUpdateBudget } from '../../hooks/budgets'
import { useNotification } from '../../contexts/NotificationContext'
import type { Budget } from '../../backend/types/budgets'
import PageLoader from '../../components/loaders/PageLoader'
import CreateBudgetButton from '../../components/budgets/CreateBudgetButton'
import SpendingBudgetContainer from '../../components/budgets/SpendingBudgetContainer'
import CreateBudgetModal from '../../components/budgets/CreateBudgetModal'
import TransactionContainer from '../../components/transactions/TransactionContainer'
import AddTransactionModal from '../../components/transactions/AddTransactionModal'
import AddTransactionButton from '../../components/transactions/AddTransactionButton'
import BalanceSummary from '../../components/transactions/BalanceSummary'
import UpdateBudgetNameInput from '../../components/budgets/UpdateBudgetNameInput'
import UpdateBudgetNameButton from '../../components/budgets/UpdateBudgetNameButton'
import DeleteBudgetButton from '../../components/budgets/DeleteBudgetButton'
import DeleteBudgetConfirmModal from '../../components/budgets/DeleteBudgetConfirmModal'
import MoveBudgetButton from '../../components/budgets/MoveBudgetButton'
import MoveBudgetModal from '../../components/budgets/MoveBudgetModal'
import CreateTransferButton from '../../components/transfers/CreateTransferButton'
import CreateTransferModal from '../../components/transfers/CreateTransferModal'
import { useNavigation } from '../../contexts/NavigationContext'
import BudgetBreadcrumbs from '../../components/budgets/BudgetBreadcrumbs'

type ModalState =
  { type: 'createBudget' } |
  { type: 'addTransaction' } |
  { type: 'deleteBudgetConfirm' } |
  { type: 'moveBudget' } |
  { type: 'createTransfer' } |
  { type: 'settings' }

const SettingsModal = ({ budget, onClose }: { budget: Budget, onClose: () => void }) => {
  const [threshold, setThreshold] = useState<string>(
    budget.balance_threshold !== null ? String(budget.balance_threshold) : ''
  )
  const { mutate: updateBudget, isPending, error } = useUpdateBudget()
  const { notify } = useNotification()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const balance_threshold = threshold === '' ? null : parseFloat(threshold)
    updateBudget({ id: budget.id, updates: { balance_threshold } }, {
      onSuccess: () => {
        notify('Settings saved', 'success')
        onClose()
      },
      onError: (err) => notify(err.message, 'error'),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-semibold mb-1">Budget Settings</h2>
        <p className="text-gray-500 text-sm mb-6">Configure settings for <span className="text-gray-300">{budget.name}</span>.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="settings-threshold" className="text-sm text-gray-400 shrink-0">
              Balance Threshold <span className="text-gray-600">(optional)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              id="settings-threshold"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="e.g. 100"
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600 w-36"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error.message}</p>}
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
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const BudgetDetail = () => {
  const { id: budgetId } = useParams()
  const { budget: budgetInfo, isLoading, error } = useBudget(budgetId ?? null)
  const [isEditingName, setIsEditingName] = useState<boolean>(false)
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const { setBackTo } = useNavigation()

  useEffect(() => {
    if (budgetInfo) {
      setBackTo(budgetInfo.parent_id ? `/budget/${budgetInfo.parent_id}` : '/dashboard')
    } else if (error) {
      setBackTo('/dashboard')
    }
    return () => setBackTo(null)
  }, [budgetInfo, error, setBackTo])

  if (isLoading) return <PageLoader />
  if (error) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-red-400 text-sm">Cannot find budget info</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">

        {/* Header */}
        <div className="mb-8 md:mb-10">
          <BudgetBreadcrumbs budgetId={budgetId ?? ''} />
          {isEditingName
            ? <UpdateBudgetNameInput
              budgetId={budgetId ?? ''}
              budgetName={budgetInfo?.name ?? ''}
              setIsOpen={setIsEditingName}
            />
            : <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-white text-2xl md:text-3xl font-bold">{budgetInfo?.name}</h1>
                <UpdateBudgetNameButton setIsOpen={setIsEditingName} />
              </div>
              <div className="flex gap-2">
                <CreateTransferButton onClick={() => setModalState({ type: 'createTransfer' })} />
                <MoveBudgetButton
                  budget={budgetInfo}
                  onClick={() => setModalState({ type: 'moveBudget' })}
                />
                <button
                  onClick={() => setModalState({ type: 'settings' })}
                  className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-300 hover:text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] border border-gray-700"
                >
                  Settings
                </button>
                <DeleteBudgetButton onClick={() => setModalState({ type: 'deleteBudgetConfirm' })} />
              </div>
            </div>
          }
        </div>
        {budgetInfo?.balance_threshold !== null && budgetInfo !== null && budgetInfo.balance <= (budgetInfo.balance_threshold ?? Infinity) && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-900/20 border border-red-900/50 text-red-400 text-sm">
            Balance has reached the alert threshold.
          </div>
        )}

        <div className="flex flex-col gap-8 md:gap-10">

          {/* Balance + Transactions */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="w-full lg:w-[30%] shrink-0">
              <BalanceSummary budgetId={budgetId} />
            </div>
            <div className="w-full flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-400 text-sm uppercase tracking-widest">Recent Transactions</h2>
                <AddTransactionButton onClick={() => setModalState({ type: 'addTransaction' })} />
              </div>
              <TransactionContainer budgetId={budgetId} viewAll="expand" />
            </div>
          </div>

          {/* Sub-budgets Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Sub-budgets</h2>
              <CreateBudgetButton onClick={() => setModalState({ type: 'createBudget' })} />
            </div>
            <SpendingBudgetContainer parentId={budgetId} />
          </div>
        </div>
      </div>

      {modalState?.type === 'createBudget' && (
        <CreateBudgetModal parentId={budgetId} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'addTransaction' && budgetId && (
        <AddTransactionModal budgetId={budgetId} budgetType='spending' onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'deleteBudgetConfirm' && (
        <DeleteBudgetConfirmModal
          budgetId={budgetId ?? ''}
          budgetName={budgetInfo?.name ?? ''}
          onClose={() => setModalState(null)}
        />
      )}
      {modalState?.type === 'moveBudget' && budgetInfo && (
        <MoveBudgetModal budget={budgetInfo} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'createTransfer' && budgetInfo && (
        <CreateTransferModal budget={budgetInfo} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'settings' && budgetInfo && (
        <SettingsModal budget={budgetInfo} onClose={() => setModalState(null)} />
      )}
    </div>
  )
}

export default BudgetDetail
