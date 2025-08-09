import { OverviewCards, Transaction } from '@/types/finance';

export const mockUsers = [
  { id: 'u_demo', name: 'Demo User', email: 'demo@local.test', password: 'demo1234' }
];

export const exampleTransactions: Transaction[] = [
  { id: 't1', type: 'income', category: 'Salary', amount: 10000000, currency: 'IDR', createdAt: new Date().toISOString() },
  { id: 't2', type: 'outcome', category: 'Food', amount: 1500000, currency: 'IDR', createdAt: new Date().toISOString() },
  { id: 't3', type: 'outcome', category: 'Transport', amount: 500000, currency: 'IDR', createdAt: new Date().toISOString() }
];

export const exampleCards: OverviewCards = {
  balance: { label: 'Balance', value: 8000000, currency: 'IDR' },
  totalIncome: { label: 'Total Income', value: 10000000, currency: 'IDR' },
  totalOutcome: { label: 'Total Outcome', value: 2000000, currency: 'IDR' },
  savings: { label: 'Savings', value: 2000000, currency: 'IDR' },
  advice: { label: 'Advice', text: 'Solid month. Savings rate ~20%. Keep fixed costs under 50%.' }
};