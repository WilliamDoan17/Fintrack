export interface Transfer {
  id: string;
  user_id: string;
  from_budget_id: string;
  to_budget_id: string;
  amount: number;
  name: string;
  created_at: string;
}

export type TransferInput = Omit<Transfer, 'id' | 'user_id' | 'created_at'>
