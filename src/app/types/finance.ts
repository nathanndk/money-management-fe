export type Transaction = {
  id: string;
  type: 'income' | 'outcome';
  category: string;
  amount: number;
  currency: string;
  createdAt: string; // ISO
};

export type OverviewCards = {
  balance: { label: string; value: number; currency: string };
  totalIncome: { label: string; value: number; currency: string };
  totalOutcome: { label: string; value: number; currency: string };
  savings: { label: string; value: number; currency: string };
  advice: { label: string; text: string };
};