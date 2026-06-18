import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import { useIncomeBudget } from '../../hooks/budgets'
import PageLoader from '../../components/loaders/PageLoader'
import BalanceSummary from '../../components/transactions/BalanceSummary'
import TransactionContainer from '../../components/transactions/TransactionContainer'
import AddTransactionModal from '../../components/transactions/AddTransactionModal'
import UpdateBudgetNameInput from '../../components/budgets/UpdateBudgetNameInput'
import CreateTransferModal from '../../components/transfers/CreateTransferModal'
import { useNavigation } from '../../contexts/NavigationContext'
import type { Budget } from '../../backend/types/budgets'

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
            : <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-white text-2xl md:text-3xl font-bold">{budget.name}</h1>
                <EditNameButton setIsOpen={setIsEditingName} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setModalState({ type: 'createTransfer' })}
                  className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-300 hover:text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] border border-gray-700"
                >
                  Transfer
                </button>
              </div>
            </div>
          }
        </div>

        <div className="flex flex-col gap-6">
          <BalanceSummary budgetId={budget.id} />
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Income Transactions</h2>
              <button
                onClick={() => setModalState({ type: 'addTransaction' })}
                className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-medium px-4 py-2 rounded transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                + Add Transaction
              </button>
            </div>
            <TransactionContainer budgetId={budget.id} viewAll="expand" hideMoveButton />
          </div>
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
