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
import { useIncomes, useCreateIncome, useUpdateIncome, useDeleteIncome } from '../../hooks/incomes'
import Pagination from '../../components/Pagination'
import { useNotification } from '../../contexts/NotificationContext'

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

const CreateIncomeModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const { notify } = useNotification()
  const { mutate: createIncome, isPending, error } = useCreateIncome()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createIncome({ name, amount: parseFloat(amount) }, {
      onSuccess: () => { notify('Income added', 'success'); onClose() },
      onError: (err) => notify(err.message, 'error'),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-semibold mb-1">Add Income</h2>
        <p className="text-gray-500 text-sm mb-6">Record a new income entry.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="create-income-name" className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              id="create-income-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Salary, Freelance, Bonus"
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="create-income-amount" className="text-sm text-gray-400">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                id="create-income-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 pl-7 w-full focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error.message}</p>}
          <div className="flex gap-3 justify-end mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded text-gray-400 hover:text-white transition-all cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Adding...' : '+ Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const UpdateIncomeModal = ({ income, onClose }: { income: Income; onClose: () => void }) => {
  const [name, setName] = useState(income.name)
  const [amount, setAmount] = useState(income.amount.toString())
  const { notify } = useNotification()
  const { mutate: updateIncome, isPending, error } = useUpdateIncome()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateIncome({ id: income.id, updates: { name, amount: parseFloat(amount) } }, {
      onSuccess: () => { notify('Income updated', 'success'); onClose() },
      onError: (err) => notify(err.message, 'error'),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 w-full max-w-md shadow-xl">
        <h2 className="text-white text-xl font-semibold mb-1">Update Income</h2>
        <p className="text-gray-500 text-sm mb-6">Edit the details of this income entry.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="update-income-name" className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              id="update-income-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Salary, Freelance, Bonus"
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-emerald-400 transition-all placeholder:text-gray-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="update-income-amount" className="text-sm text-gray-400">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                id="update-income-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 pl-7 w-full focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error.message}</p>}
          <div className="flex gap-3 justify-end mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded text-gray-400 hover:text-white transition-all cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Updating...' : 'Update Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

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

type IncomeModalState =
  | { type: 'update'; income: Income }
  | { type: 'delete'; income: Income }

const IncomeContainerSkeleton = () => (
  <div className="flex flex-col gap-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4">
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
          <div className="w-20 h-3 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="w-16 h-5 bg-gray-700 rounded animate-pulse" />
      </div>
    ))}
  </div>
)

const IncomeContainer = ({ limit = 10 }: { limit?: number }) => {
  const { incomes, isLoading, error } = useIncomes()
  const [modalState, setModalState] = useState<IncomeModalState | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  if (isLoading) return <IncomeContainerSkeleton />
  if (error) return <p className="text-red-400 text-sm">Error loading incomes</p>
  if (incomes.length === 0) return <p className="text-gray-500 text-sm">No income recorded yet.</p>

  const totalPages = Math.max(1, Math.ceil(incomes.length / limit))
  const displayed = incomes.slice((currentPage - 1) * limit, currentPage * limit)

  return (
    <>
      <div className="flex flex-col gap-3">
        {displayed.map(income => (
          <IncomeCard
            key={income.id}
            income={income}
            onEdit={() => setModalState({ type: 'update', income })}
            onDelete={() => setModalState({ type: 'delete', income })}
          />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      {modalState?.type === 'update' && (
        <UpdateIncomeModal income={modalState.income} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === 'delete' && (
        <DeleteIncomeConfirmModal income={modalState.income} onClose={() => setModalState(null)} />
      )}
    </>
  )
}

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
