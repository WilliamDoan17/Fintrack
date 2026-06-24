export interface Transaction {
  id: string,
  user_id: string,
  budget_id: string,
  amount: number,
  name: string,
  created_at: string,
}

export type TransactionInput = Omit<Transaction, 'id' | 'user_id' | 'created_at'>

