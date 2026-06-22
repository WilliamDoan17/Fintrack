export interface Income {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  created_at: string;
}

export type IncomeInput = Omit<Income, 'id' | 'user_id' | 'created_at'>
