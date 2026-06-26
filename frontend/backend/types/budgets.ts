export interface Budget {
  id: string,
  user_id: string,
  created_at: string,
  name: string,
  parent_id: string | null,
  balance_threshold: number | null,
}

export type BudgetInput = Omit<Budget, 'id' | 'created_at' | 'user_id'>;

