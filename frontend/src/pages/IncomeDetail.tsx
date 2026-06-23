import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import { useIncomeBudget } from '../../hooks/budgets'
import PageLoader from '../../components/loaders/PageLoader'
import TransactionContainer from '../../components/transactions/TransactionContainer'
import TransferContainer from '../../components/transfers/TransferContainer'
import Tabs from '../../components/Tabs'
import { useTransactions } from '../../hooks/transactions'
import { useTransfers } from '../../hooks/transfers'
import AddTransactionModal from '../../components/transactions/AddTransactionModal'
import UpdateBudgetNameInput from '../../components/budgets/UpdateBudgetNameInput'
import CreateTransferModal from '../../components/transfers/CreateTransferModal'
import { useNavigation } from '../../contexts/NavigationContext'
import type { Budget } from '../../backend/types/budgets'
import type { Income } from '../../backend/types/incomes'

const IncomeEditButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-emerald-400 transition-all cursor-pointer">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  </button>
)

const IncomeDeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-red-400 transition-all cursor-pointer">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  </button>
)

const IncomeCard = ({ income, onEdit, onDelete }: { income: Income; onEdit: () => void; onDelete: () => void }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 hover:border-gray-600 transition-all">
    <div className="flex flex-col gap-1">
      <p className="text-white font-medium">{income.name}</p>
      <p className="text-gray-500 text-xs uppercase tracking-widest">
        {new Date(income.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
    <div className="flex items-center justify-between sm:justify-end gap-4">
      <span className="font-semibold text-lg text-emerald-400">+${income.amount.toFixed(2)}</span>
      <div className="flex items-center gap-2">
        <IncomeEditButton onClick={onEdit} />
        <IncomeDeleteButton onClick={onDelete} />
      </div>
    </div>
  </div>
)

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

  let income = 0
  transactions.forEach(({ type, amount }) => { if (type === 'add') income += amount })

  let transfersOut = 0
  transfers.forEach(({ from_budget_id, amount }) => { if (from_budget_id === budgetId) transfersOut += amount })

  const balance = income - transfersOut

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
        {transfersOut > 0 && (
          <div className="flex flex-col items-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Transferred Out</p>
            <p className="text-red-400 font-semibold text-base md:text-lg">-${transfersOut.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

type ModalState =
  { type: 'addTransaction' } |
  { type: 'createTransfer' }

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

const IncomeDetailContent = ({ budget }: { budget: Budget }) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false)
  const [modalState, setModalState] = useState<ModalState | null>(null)

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">

        {/* Header */}
        <div className="mb-8 md:mb-10">
          <p className="text-xs text-emerald-600 uppercase tracking-widest mb-1">Income</p>
          {isEditingName
            ? <UpdateBudgetNameInput
              budgetId={budget.id}
              budgetName={budget.name}
              setIsOpen={setIsEditingName}
            />
            : <div className="flex items-center gap-3">
              <h1 className="text-white text-2xl md:text-3xl font-bold">{budget.name}</h1>
              <EditNameButton setIsOpen={setIsEditingName} />
            </div>
          }
        </div>

        <div className="flex flex-col gap-6">
          <BalanceSummary budgetId={budget.id} />
          <div className="flex items-center justify-end gap-2">
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
              + Add Income
            </button>
          </div>
          <Tabs tabs={[
            {
              label: 'Transactions',
              content: <TransactionContainer budgetId={budget.id} viewAll="paginate" hideMoveButton />,
            },
            {
              label: 'Transfers',
              content: <TransferContainer budgetId={budget.id} viewAll="paginate" />,
            },
          ]} />
        </div>
      </div>

      {modalState?.type === 'addTransaction' && (
        <AddTransactionModal budgetId={budget.id} budgetType='income' onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'createTransfer' && (
        <CreateTransferModal budget={budget} onClose={() => setModalState(null)} />
      )}
    </div>
  )
}

const IncomeDetail = () => {
  const { budget, isLoading, error } = useIncomeBudget()
  const { setBackTo } = useNavigation()

  useEffect(() => {
    if (budget || error) setBackTo('/dashboard')
    return () => setBackTo(null)
  }, [budget, error, setBackTo])

  if (isLoading) return <PageLoader />
  if (error || !budget) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-red-400 text-sm">Cannot find income budget</p>
    </div>
  )

  return <IncomeDetailContent budget={budget} />
}

export default IncomeDetail
