import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getRootBudgets,
  getChildBudgets,
  getBudget,
  getIncomeBudget,
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../backend/services/budgets'
import type { Budget, BudgetInput } from '../backend/types/budgets'
import { useTransactions } from './transactions'
import { useTransfers } from './transfers'

export const useBudgets = (parentId: string | null) => {
  const { data: budgets = [], isLoading, error } = useQuery<Budget[]>({
    queryKey: ['budgets', parentId],
    queryFn: () => parentId ? getChildBudgets(parentId) : getRootBudgets(),
  })
  return { budgets, isLoading, error }
}

export const useBudget = (id: string | null) => {
  const { data: budget = null, isLoading, error } = useQuery<Budget | null>({
    queryKey: ['budget', id],
    queryFn: () => getBudget(id!),
    enabled: id !== null,
  })
  return { budget, isLoading, error }
}

export const useIncomeBudget = () => {
  const { data: budget = null, isLoading, error } = useQuery<Budget>({
    queryKey: ['income-budget'],
    queryFn: getIncomeBudget,
  })
  return { budget, isLoading, error }
}

export const useBudgetBalance = (budgetId: string) => {
  const { transactions, isLoading: txLoading, error: txError } = useTransactions(budgetId)
  const { transfers, isLoading: trLoading, error: trError } = useTransfers(budgetId)

  const isLoading = txLoading || trLoading
  const error = txError || trError

  const incomes = 0
  const expenses = transactions.reduce((sum, { amount }) => sum + amount, 0)
  let transfersIn = 0
  let transfersOut = 0
  transfers.forEach(({ from_budget_id, amount }) => {
    if (from_budget_id === budgetId) transfersOut += amount
    else transfersIn += amount
  })
  const balance = incomes - expenses + transfersIn - transfersOut

  return { balance, incomes, expenses, transfersIn, transfersOut, isLoading, error }
}

export const useBudgetStructure = () => {
  const { data: structure = null, isLoading, error } = useQuery({
    queryKey: ['budget-structure'],
    queryFn: async () => {
      const budgets = await getAllBudgets()
      const budgetIdToPath = new Map<string, string>()
      const pathToBudgetId = new Map<string, string>()
      const paths: string[] = ['/']

      const buildPath = (budget: Budget): void => {
        if (budget.parent_id !== null && !budgetIdToPath.has(budget.parent_id)) {
          const parent = budgets.find(b => b.id === budget.parent_id)
          if (!parent) throw new Error('Parent budget not found')
          buildPath(parent)
        }
        const parentPath = budget.parent_id === null ? '' : budgetIdToPath.get(budget.parent_id)!
        const currentPath = `${parentPath}/${budget.name}`
        budgetIdToPath.set(budget.id, currentPath)
        pathToBudgetId.set(currentPath, budget.id)
        paths.push(currentPath)
      }

      budgets.forEach(b => { if (!budgetIdToPath.has(b.id)) buildPath(b) })
      return { budgetIdToPath, pathToBudgetId, paths }
    },
  })
  return { structure, isLoading, error }
}

const BUDGET_KEYS = [
  ['budgets'],
  ['budget'],
  ['income-budget'],
  ['budget-structure'],
]

export const useCreateBudget = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, BudgetInput>({
    mutationFn: createBudget,
    onSuccess: () => { BUDGET_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key })) },
  })
}

export const useUpdateBudget = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, { id: string; updates: Partial<BudgetInput> }>({
    mutationFn: ({ id, updates }) => updateBudget(id, updates),
    onSuccess: () => { BUDGET_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key })) },
  })
}

export const useDeleteBudget = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteBudget,
    onSuccess: () => { BUDGET_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key })) },
  })
}
