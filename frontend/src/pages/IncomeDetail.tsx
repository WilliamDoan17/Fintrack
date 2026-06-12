import { useState, useEffect } from 'react'
import { useIncomeBudget } from '../../hooks/budgets'
import PageLoader from '../../components/loaders/PageLoader'
import BalanceSummary from '../../components/transactions/BalanceSummary'
import TransactionContainer from '../../components/transactions/TransactionContainer'
import AddTransactionModal from '../../components/transactions/AddTransactionModal'
import AddTransactionButton from '../../components/transactions/AddTransactionButton'
import UpdateBudgetNameInput from '../../components/budgets/UpdateBudgetNameInput'
import UpdateBudgetNameButton from '../../components/budgets/UpdateBudgetNameButton'
import CreateTransferButton from '../../components/transfers/CreateTransferButton'
import CreateTransferModal from '../../components/transfers/CreateTransferModal'
import { useNavigation } from '../../contexts/NavigationContext'
import type { Budget } from '../../backend/types/budgets'

type ModalState =
  { type: 'addTransaction' } |
  { type: 'createTransfer' }

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
                <UpdateBudgetNameButton setIsOpen={setIsEditingName} />
              </div>
              <div className="flex gap-2">
                <CreateTransferButton onClick={() => setModalState({ type: 'createTransfer' })} />
              </div>
            </div>
          }
        </div>

        <div className="flex flex-col gap-6">
          <BalanceSummary budgetId={budget.id} />
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Income Transactions</h2>
              <AddTransactionButton onClick={() => setModalState({ type: 'addTransaction' })} />
            </div>
            <TransactionContainer budgetId={budget.id} viewAll="expand" />
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
