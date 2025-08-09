import { NextResponse } from 'next/server';
import { z } from 'zod';
import { exampleCards } from '@/data/mock';

const Tx = z.object({ id: z.string(), type: z.enum(['income', 'outcome']), category: z.string(), amount: z.number().nonnegative(), currency: z.string().min(3), createdAt: z.string() });
const Body = z.object({ transactions: z.array(Tx).default([]), currency: z.string().optional() });

export async function GET() { return NextResponse.json(exampleCards); }

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const { transactions, currency } = parsed.data;
  const ccy = currency || (transactions[0]?.currency ?? 'IDR');
  const income = transactions.filter((t) => t.type === 'income' && t.currency === ccy).reduce((s, t) => s + t.amount, 0);
  const outcome = transactions.filter((t) => t.type === 'outcome' && t.currency === ccy).reduce((s, t) => s + t.amount, 0);
  const balance = income - outcome;
  const targetSavings = income * 0.2; // goal
  const savings = Math.max(balance, 0);
  const rate = income > 0 ? (savings / income) : 0;
  let advice = 'Add income to start tracking.';
  if (income > 0) {
    if (rate >= 0.2) advice = 'Solid month. Savings rate ≥20%. Keep it up and watch fixed costs.';
    else if (rate >= 0.1) advice = 'Decent. Push discretionary spend down ~5–10% to hit 20% savings.';
    else advice = 'Warning: spending high. Audit top 3 categories and set weekly caps.';
  }
  return NextResponse.json({
    balance: { label: 'Balance', value: Math.round(balance), currency: ccy },
    totalIncome: { label: 'Total Income', value: Math.round(income), currency: ccy },
    totalOutcome: { label: 'Total Outcome', value: Math.round(outcome), currency: ccy },
    savings: { label: 'Savings', value: Math.round(savings), currency: ccy },
    advice: { label: 'Advice', text: advice }
  });
}