import { useParams } from "react-router-dom"
import { useState, useEffect, useCallback } from "react";
import { getBudget, type Budget } from "../../backend/services/budgets";
import useBudgets from "../../hooks/useBudgets";
import useTransactions from "../../hooks/useTransactions";
import PageLoader from "../../components/loaders/PageLoader";
import CreateBudgetButton from "../../components/budgets/CreateBudgetButton";
import BudgetContainer from "../../components/budgets/BudgetContainer";
import CreateBudgetModal from "../../components/budgets/CreateBudgetModal";
import TransactionContainer from "../../components/transactions/TransactionContainer";
import AddTransactionModal from '../../components/transactions/AddTransactionModal'
import AddTransactionButton from '../../components/transactions/AddTransactionButton'
import BalanceSummary from '../../components/transactions/BalanceSummary'
import UpdateBudgetNameInput from '../../components/budgets/UpdateBudgetNameInput'
import UpdateBudgetNameButton from '../../components/budgets/UpdateBudgetNameButton'
import DeleteBudgetButton from '../../components/budgets/DeleteBudgetButton'
import DeleteBudgetConfirmModal from '../../components/budgets/DeleteBudgetConfirmModal'

type ModalState =
  { type: 'createBudget' } |
  { type: 'addTransaction' } |
  { type: 'deleteBudgetConfirm' }

const BudgetDetail = () => {
  const { id: budgetId } = useParams();
  const [budgetInfo, setBudgetInfo] = useState<Budget | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditingName, setIsEditingName] = useState<boolean>(false)
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const budgetQuery = useBudgets(budgetId ?? null);
  const transactionQuery = useTransactions(budgetId ?? null);

  const fetchBudgetInfo = useCallback(async () => {
    setLoading(true)
    if (budgetId) {
      try {
        const data = await getBudget(budgetId);
        setBudgetInfo(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false)
      }
    }
  }, [budgetId])

  useEffect(() => {
    fetchBudgetInfo()
  }, [fetchBudgetInfo])

  if (loading) return <PageLoader />
  if (error) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-red-400 text-sm">Cannot find budget info</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-1">Budget</p>
          {isEditingName
            ? <UpdateBudgetNameInput
              budgetId={budgetId ?? ''}
              budgetName={budgetInfo?.name ?? ''}
              onSuccess={fetchBudgetInfo}
              setIsOpen={setIsEditingName}
            />
            : <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-white text-3xl font-bold">{budgetInfo?.name}</h1>
                <UpdateBudgetNameButton setIsOpen={setIsEditingName} />
              </div>
              <DeleteBudgetButton onClick={() => setModalState({ type: 'deleteBudgetConfirm' })} />
            </div>
          }
        </div>
        <div className="flex flex-col gap-10">

          {/* Balance + Transactions two-column */}
          <div className="flex gap-6 items-start">
            <div className="w-[30%] shrink-0">
              <BalanceSummary transactionQuery={transactionQuery} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-400 text-sm uppercase tracking-widest">Recent Transactions</h2>
                <AddTransactionButton onClick={() => setModalState({ type: 'addTransaction' })} />
              </div>
              <TransactionContainer transactionQuery={transactionQuery} />
            </div>
          </div>
          {/* Sub-budgets Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Sub-budgets</h2>
              <CreateBudgetButton onClick={() => setModalState({ type: 'createBudget' })} />
            </div>
            <BudgetContainer budgetQuery={budgetQuery} />
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
    </div>
  )
}

export default BudgetDetail
