import { useState } from 'react'
import useIncomeBudget from '../../hooks/useIncomeBudget'
import useTransactions from '../../hooks/useTransactions'
import useTransfers from '../../hooks/useTransfers'
import PageLoader from '../../components/loaders/PageLoader'
import BalanceSummary from '../../components/transactions/BalanceSummary'
import TransactionContainer from '../../components/transactions/TransactionContainer'
import AddTransactionModal from '../../components/transactions/AddTransactionModal'
import AddTransactionButton from '../../components/transactions/AddTransactionButton'
import UpdateBudgetNameInput from '../../components/budgets/UpdateBudgetNameInput'
import UpdateBudgetNameButton from '../../components/budgets/UpdateBudgetNameButton'
import CreateTransferButton from '../../components/transfers/CreateTransferButton'
import CreateTransferModal from '../../components/transfers/CreateTransferModal'

type ModalState =
  { type: 'addTransaction' } |
  { type: 'createTransfer' }

const IncomeBudgetDetail = () => {
  const { budget, loading, error, refetch } = useIncomeBudget()
  const transactionQuery = useTransactions(budget?.id ?? null)
  const transferQuery = useTransfers(budget?.id ?? null)
  const [isEditingName, setIsEditingName] = useState<boolean>(false)
  const [modalState, setModalState] = useState<ModalState | null>(null)

  if (loading) return <PageLoader />
  if (error || !budget) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-red-400 text-sm">Cannot find income budget</p>
    </div>
  )

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
              onSuccess={refetch}
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

        <div className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="w-full lg:w-[30%] shrink-0">
              <BalanceSummary transactionQuery={transactionQuery} transferQuery={transferQuery} budgetId={budget.id} />
            </div>
            <div className="w-full flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-400 text-sm uppercase tracking-widest">Income Transactions</h2>
                <AddTransactionButton onClick={() => setModalState({ type: 'addTransaction' })} />
              </div>
              <TransactionContainer
                transactionQuery={transactionQuery}
                transferQuery={transferQuery}
                budgetId={budget.id}
              />
            </div>
          </div>
        </div>
      </div>

      {modalState?.type === 'addTransaction' && (
        <AddTransactionModal
          transactionQuery={transactionQuery}
          budgetId={budget.id}
          budgetType='income'
          onClose={() => setModalState(null)}
        />
      )}
      {modalState?.type === 'createTransfer' && (
        <CreateTransferModal
          budget={budget}
          onSuccess={transferQuery.refetch}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  )
}

export default IncomeBudgetDetail
