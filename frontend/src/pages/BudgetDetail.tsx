import { useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import { getBudget, type Budget } from "../../backend/services/budgets";
import useBudgets from "../../hooks/useBudgets";
import PageLoader from "../../components/PageLoader";
import CreateBudgetButton from "../../components/budgets/CreateBudgetButton";
import BudgetContainer from "../../components/budgets/BudgetContainer";
import CreateBudgetModal from "../../components/budgets/CreateBudgetModal";

const BudgetDetail = () => {
  const { id: budgetId } = useParams();
  const [budgetInfo, setBudgetInfo] = useState<Budget | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [openCreateBudgetModal, setOpenCreateBudgetModal] = useState<boolean>(false);
  const budgetQuery = useBudgets(budgetId ?? null);

  useEffect(() => {
    if (budgetId)
      getBudget(budgetId)
        .then(setBudgetInfo)
        .catch(setError)
        .finally(() => setLoading(false))
  }, [budgetId])

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
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-widest mb-1">Budget</p>
            <h1 className="text-white text-3xl font-bold">{budgetInfo?.name}</h1>
          </div>
          <CreateBudgetButton setOpenModal={setOpenCreateBudgetModal} />
        </div>

        {/* Sub-budgets Section */}
        <div>
          <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-4">Sub-budgets</h2>
          <BudgetContainer budgetQuery={budgetQuery} />
        </div>
      </div>

      {openCreateBudgetModal && (
        <CreateBudgetModal
          budgetQuery={budgetQuery}
          parentId={budgetId}
          setIsOpen={setOpenCreateBudgetModal}
        />
      )}
    </div>
  )
}

export default BudgetDetail
