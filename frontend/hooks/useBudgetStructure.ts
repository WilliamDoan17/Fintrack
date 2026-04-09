import { useEffect, useState } from 'react';
import { getAllBudgets } from '../backend/services/budgets.ts'
import type { Budget } from '../backend/types/budgets';

interface BudgetStructure {
  budgetIdToPath: Map<string, string>
  pathToBudgetId: Map<string, string>
  paths: string[]
}

const useBudgetStructure = () => {
  const [structure, setStructure] = useState<BudgetStructure | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    getAllBudgets()
      .then(budgets => {
        const budgetIdToPath = new Map<string, string>()
        const pathToBudgetId = new Map<string, string>()
        const paths: string[] = ['/']

        const buildPathByBudget = (budget: Budget): void => {
          if (budget.parent_id !== null && !budgetIdToPath.has(budget.parent_id)) {
            const parentBudget = budgets.find(b => b.id === budget.parent_id)
            if (parentBudget === undefined) throw new Error("Parent budget not found")
            buildPathByBudget(parentBudget)
          }
          const parentPath = budget.parent_id === null ? '' : budgetIdToPath.get(budget.parent_id)!
          const currentPath = `${parentPath}/${budget.name}`
          budgetIdToPath.set(budget.id, currentPath)
          pathToBudgetId.set(currentPath, budget.id)
          paths.push(currentPath)
        }

        budgets.forEach(budget => {
          if (!budgetIdToPath.has(budget.id)) buildPathByBudget(budget)
        })

        setStructure({ budgetIdToPath, pathToBudgetId, paths })
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { structure, loading, error }
}

export default useBudgetStructure
