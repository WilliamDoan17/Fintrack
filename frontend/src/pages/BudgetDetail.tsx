import { useParams } from "react-router-dom"
import { useState, useEffect, useCallback } from "react";
import { getBudget, type Budget } from "../../backend/services/budgets";
import useBudgets from "../../hooks/useBudgets";
import useTransactions from "../../hooks/useTransactions";
import PageLoader from "../../components/PageLoader";
import CreateBudgetButton from "../../components/budgets/CreateBudgetButton";
import BudgetContainer from "../../components/budgets/BudgetContainer";
import CreateBudgetModal from "../../components/budgets/CreateBudgetModal";
import TransactionContainer from "../../components/transactions/TransactionContainer";
import AddTransactionModal from '../../components/transactions/AddTransactionModal'
import AddTransactionButton from '../../components/transactions/AddTransactionButton'
import BalanceSummary from '../../components/transactions/BalanceSummary'
import UpdateBudgetNameInput from '../../components/budgets/UpdateBudgetNameInput'
import UpdateBudgetNameButton from '../../components/budgets/UpdateBudgetNameButton'

const BudgetDetail = () => {
  const { id: budgetId } = useParams();
  const [budgetInfo, setBudgetInfo] = useState<Budget | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [openCreateBudgetModal, setOpenCreateBudgetModal] = useState<boolean>(false);
  const [openAddTransactionModal, setOpenAddTransactionModal] = useState<boolean>(false);
  const [isEditingName, setIsEditingName] = useState<boolean>(false)
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
            ? <UpdateBudgetNameInput budgetId={budgetId ?? ''} budgetName={budgetInfo?.name ?? ''} onSuccess={fetchBudgetInfo} setIsOpen={setIsEditingName} />
            : <div className="flex items-center justify-between gap-3">
              <h1 className="text-white text-3xl font-bold">{budgetInfo?.name}</h1>
              <UpdateBudgetNameButton setIsOpen={setIsEditingName} />
            </div>
          }
        </div>

        <div className="flex flex-col gap-10">

          {/* Balance + Transactions two-column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BalanceSummary transactionQuery={transactionQuery} />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-400 text-sm uppercase tracking-widest">Recent Transactions</h2>
                <AddTransactionButton setOpenModal={setOpenAddTransactionModal} />
              </div>
              <TransactionContainer transactionQuery={transactionQuery} />
            </div>
          </div>

          {/* Sub-budgets Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm uppercase tracking-widest">Sub-budgets</h2>
              <CreateBudgetButton setOpenModal={setOpenCreateBudgetModal} />
            </div>
            <BudgetContainer budgetQuery={budgetQuery} />
          </div>

        </div>
      </div>

      {openCreateBudgetModal && (
        <CreateBudgetModal
          budgetQuery={budgetQuery}
          parentId={budgetId}
          setIsOpen={setOpenCreateBudgetModal}
        />
      )}
      {openAddTransactionModal && budgetId && (
        <AddTransactionModal
          transactionQuery={transactionQuery}
          budgetId={budgetId}
          setIsOpen={setOpenAddTransactionModal}
        />
      )}
    </div>
  )
}

export default BudgetDetail
