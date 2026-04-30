import { useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import useBudgetInfo from "../../hooks/useBudgetInfo";
import useSpendingBudgets from "../../hooks/useSpendingBudgets";
import useTransactions from "../../hooks/useTransactions";
import PageLoader from "../../components/loaders/PageLoader";
import CreateBudgetButton from "../../components/budgets/CreateBudgetButton";
import SpendingBudgetContainer from "../../components/budgets/SpendingBudgetContainer";
import CreateBudgetModal from "../../components/budgets/CreateBudgetModal";
import TransactionContainer from "../../components/transactions/TransactionContainer";
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
import useTransfers from '../../hooks/useTransfers'
import { useNavigation } from '../../contexts/NavigationContext'

type ModalState =
  { type: 'createBudget' } |
  { type: 'addTransaction' } |
  { type: 'deleteBudgetConfirm' } |
  { type: 'moveBudget' } |
  { type: 'createTransfer' }

const BudgetDetail = () => {
  const { id: budgetId } = useParams();
  const { budget: budgetInfo, loading, error, refetch: fetchBudgetInfo } = useBudgetInfo(budgetId ?? null)
  const [isEditingName, setIsEditingName] = useState<boolean>(false)
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const budgetQuery = useSpendingBudgets(budgetId ?? null);
  const transactionQuery = useTransactions(budgetId ?? null);
  const transferQuery = useTransfers(budgetId ?? null);
  const { setBackTo } = useNavigation()

  useEffect(() => {
    if (budgetInfo) {
      setBackTo(budgetInfo.parent_id ? `/budget/${budgetInfo.parent_id}` : '/dashboard')
    } else if (error) {
      setBackTo('/dashboard')
    }
    return () => setBackTo(null)
  }, [budgetInfo, error, setBackTo])

  if (loading) return <PageLoader />
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
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-1">Budget</p>
          {isEditingName
            ? <UpdateBudgetNameInput
              budgetId={budgetId ?? ''}
              budgetName={budgetInfo?.name ?? ''}
              onSuccess={fetchBudgetInfo}
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
                <DeleteBudgetButton onClick={() => setModalState({ type: 'deleteBudgetConfirm' })} />
              </div>
            </div>
          }
        </div>
        <div className="flex flex-col gap-8 md:gap-10">

          {/* Balance + Transactions */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="w-full lg:w-[30%] shrink-0">
              <BalanceSummary transactionQuery={transactionQuery} transferQuery={transferQuery} budgetId={budgetId} />
            </div>
            <div className="w-full flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-400 text-sm uppercase tracking-widest">Recent Transactions</h2>
                <AddTransactionButton onClick={() => setModalState({ type: 'addTransaction' })} />
              </div>
              <TransactionContainer
                budgetQuery={budgetQuery}
                transactionQuery={transactionQuery}
                transferQuery={transferQuery}
                budgetId={budgetId}
              />
            </div>
          </div>

          {/* Sub-budgets Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Sub-budgets</h2>
              <CreateBudgetButton onClick={() => setModalState({ type: 'createBudget' })} />
            </div>
            <SpendingBudgetContainer budgetQuery={budgetQuery} />
          </div>
        </div>
      </div>

      {modalState?.type === 'createBudget' && (
        <CreateBudgetModal
          budgetQuery={budgetQuery}
          parentId={budgetId}
          onClose={() => setModalState(null)}
        />
      )}
      {modalState?.type === 'addTransaction' && budgetId && (
        <AddTransactionModal
          transactionQuery={transactionQuery}
          budgetId={budgetId}
          budgetType='spending'
          onClose={() => setModalState(null)}
        />
      )}
      {modalState?.type === 'deleteBudgetConfirm' && (
        <DeleteBudgetConfirmModal
          budgetId={budgetId ?? ''}
          budgetName={budgetInfo?.name ?? ''}
          onClose={() => setModalState(null)}
        />
      )}
      {modalState?.type === 'moveBudget' && budgetInfo && (
        <MoveBudgetModal
          budget={budgetInfo}
          onClose={() => setModalState(null)}
        />
      )}
      {modalState?.type === 'createTransfer' && budgetInfo && (
        <CreateTransferModal
          budget={budgetInfo}
          onSuccess={transferQuery.refetch}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  )
}

export default BudgetDetail
