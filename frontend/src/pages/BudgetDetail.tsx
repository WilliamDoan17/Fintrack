import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import { useBudget, useUpdateBudget, useSpendingBudgetStructure } from '../../hooks/budgets'
import { useNotification } from '../../contexts/NotificationContext'
import type { Budget } from '../../backend/types/budgets'
import PageLoader from '../../components/loaders/PageLoader'
import SpendingBudgetContainer from '../../components/budgets/SpendingBudgetContainer'
import CreateBudgetModal from '../../components/budgets/CreateBudgetModal'
import TransactionContainer from '../../components/transactions/TransactionContainer'
import TransferContainer from '../../components/transfers/TransferContainer'
import Tabs from '../../components/Tabs'
import AddTransactionModal from '../../components/transactions/AddTransactionModal'
import UpdateBudgetNameInput from '../../components/budgets/UpdateBudgetNameInput'
import { useTransactions } from '../../hooks/transactions'
import { useTransfers } from '../../hooks/transfers'
import DeleteBudgetConfirmModal from '../../components/budgets/DeleteBudgetConfirmModal'
import MoveBudgetModal from '../../components/budgets/MoveBudgetModal'
import CreateTransferModal from '../../components/transfers/CreateTransferModal'
import { useNavigation } from '../../contexts/NavigationContext'

const BalanceSummary = ({ budgetId }: { budgetId: string }) => {
  const { transactions, isLoading: txLoading, error: txError } = useTransactions(budgetId)
  const { transfers, isLoading: trLoading, error: trError } = useTransfers(budgetId)

  const isLoading = txLoading || trLoading
  const error = txError || trError

  if (isLoading) return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading balance...</p>
    </div>
  )
  if (error) return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-center">
      <p className="text-red-400 text-sm">Error loading balance</p>
    </div>
  )

  const income = 0
  const expenses = transactions.reduce((sum, { amount }) => sum + amount, 0);

  let transfersIn = 0
  let transfersOut = 0
  transfers.forEach(({ from_budget_id, amount }) => {
    if (from_budget_id === budgetId) transfersOut += amount
    else transfersIn += amount
  })

  const balance = income - expenses + transfersIn - transfersOut

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6 flex flex-col gap-4">
      <div className="flex flex-col items-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Balance</p>
        <p className={`font-bold text-2xl md:text-3xl ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {balance >= 0 ? '+' : '-'}${Math.abs(balance).toFixed(2)}
        </p>
      </div>
      <div className="border-t border-gray-800" />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Income</p>
          <p className="text-emerald-400 font-semibold text-base md:text-lg">+${income.toFixed(2)}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Expenses</p>
          <p className="text-red-400 font-semibold text-base md:text-lg">-${expenses.toFixed(2)}</p>
        </div>
        {(transfersIn > 0 || transfersOut > 0) && (
          <>
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Transferred In</p>
              <p className="text-emerald-400 font-semibold text-base md:text-lg">+${transfersIn.toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Transferred Out</p>
              <p className="text-red-400 font-semibold text-base md:text-lg">-${transfersOut.toFixed(2)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

type ModalState =
  { type: 'createBudget' } |
  { type: 'addTransaction' } |
  { type: 'deleteBudgetConfirm' } |
  { type: 'moveBudget' } |
  { type: 'createTransfer' } |
  { type: 'settings' }

const BudgetBreadcrumbs = ({ budgetId }: { budgetId: string }) => {
  const { structure } = useSpendingBudgetStructure()
  const path = structure?.budgetIdToPath.get(budgetId) ?? ''
  const segments = path.split('/').filter(Boolean)

  return (
    <p className="text-gray-500 text-sm uppercase tracking-widest mb-1">
      {segments.map((name, i) => {
        const segPath = '/' + segments.slice(0, i + 1).join('/')
        const segId = structure?.pathToBudgetId.get(segPath)
        const isLast = i === segments.length - 1
        return (
          <span key={segPath}>
            {i > 0 && <span className="mx-1.5">/</span>}
            {isLast || !segId
              ? name
              : <Link to={`/budget/${segId}`} className="hover:text-gray-300 transition-colors">{name}</Link>
            }
          </span>
        )
      })}
    </p>
  )
}

const EditNameButton = ({ setIsOpen }: { setIsOpen: Dispatch<SetStateAction<boolean>> }) => (
  <button
    onClick={() => setIsOpen(true)}
    className="text-gray-500 hover:text-emerald-400 transition-all cursor-pointer"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  </button>
)

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
                <EditNameButton setIsOpen={setIsEditingName} />
              </div>
              <div className="flex gap-2">
                {budgetInfo && (
                  <button
                    onClick={() => setModalState({ type: 'moveBudget' })}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Move
                  </button>
                )}
                <button
                  onClick={() => setModalState({ type: 'settings' })}
                  className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-300 hover:text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] border border-gray-700"
                >
                  Settings
                </button>
                <button
                  onClick={() => setModalState({ type: 'deleteBudgetConfirm' })}
                  className="bg-red-500 hover:bg-red-400 active:bg-red-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  Delete Budget
                </button>
              </div>
            </div>
          }
        </div>
        {budgetInfo && (budgetInfo.balance < 0 || (budgetInfo.balance_threshold !== null && budgetInfo.balance <= budgetInfo.balance_threshold)) && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-900/20 border border-red-900/50 text-red-400 text-sm">
            {budgetInfo.balance < 0
              ? 'Balance is negative.'
              : 'Balance has reached the alert threshold.'
            }
          </div>
        )}

        <div className="flex flex-col gap-8 md:gap-10">

          {/* Balance */}
          {budgetId && <BalanceSummary budgetId={budgetId} />}

          {/* Buttons + Tabs */}
          <div>
            <div className="flex items-center justify-end gap-2 mb-4">
              <button
                onClick={() => setModalState({ type: 'createTransfer' })}
                className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-300 hover:text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] border border-gray-700"
              >
                Transfer
              </button>
              <button
                onClick={() => setModalState({ type: 'addTransaction' })}
                className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                + Add Transaction
              </button>
            </div>
            <Tabs tabs={[
              {
                label: 'Transactions',
                content: <TransactionContainer budgetId={budgetId} viewAll="paginate" />,
              },
              {
                label: 'Transfers',
                content: budgetId ? <TransferContainer budgetId={budgetId} viewAll="paginate" /> : null,
              },
            ]} />
          </div>

          {/* Sub-budgets Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Sub-budgets</h2>
              <button
                onClick={() => setModalState({ type: 'createBudget' })}
                className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                + Create Budget
              </button>
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
