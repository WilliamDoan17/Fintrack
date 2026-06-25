export interface Allocation {
  id: string
  user_id: string
  to_budget_id: string
  amount: number
  created_at: string
}

export type AllocationInput = Omit<Allocation, 'id' | 'user_id' | 'created_at'>
