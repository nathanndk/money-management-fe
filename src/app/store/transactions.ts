'use client';
import { create } from 'zustand';
import { Transaction } from '@/app/types/finance';

const NS = 'mm';
const keyFor = (profile: string) => `${NS}:profile:${profile}`;

export type TxState = {
  profileKey: string; // 'guest' or user email
  currency: string;
  transactions: Transaction[];
  switchProfile: (profileKey: string) => void;
  add: (t: Omit<Transaction, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void;
  remove: (id: string) => void;
  clear: () => void;
};

function load(profileKey: string): { currency: string; transactions: Transaction[] } {
  if (typeof window === 'undefined') return { currency: 'IDR', transactions: [] };
  const raw = localStorage.getItem(keyFor(profileKey));
  if (!raw) return { currency: 'IDR', transactions: [] };
  try { const parsed = JSON.parse(raw); return { currency: parsed.currency || 'IDR', transactions: parsed.transactions || [] }; }
  catch { return { currency: 'IDR', transactions: [] }; }
}

function save(profileKey: string, currency: string, transactions: Transaction[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(keyFor(profileKey), JSON.stringify({ currency, transactions }));
}

export const useTxStore = create<TxState>((set, get) => ({
  profileKey: 'guest',
  currency: 'IDR',
  transactions: [],
  switchProfile: (profileKey) => { const data = load(profileKey); set({ profileKey, currency: data.currency, transactions: data.transactions }); },
  add: (t) => { const id = t.id ?? `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; const createdAt = t.createdAt ?? new Date().toISOString(); const entity: Transaction = { id, createdAt, ...t } as Transaction; set((s) => { const next = [...s.transactions, entity]; save(s.profileKey, s.currency, next); return { transactions: next }; }); },
  remove: (id) => { set((s) => { const next = s.transactions.filter((t) => t.id !== id); save(s.profileKey, s.currency, next); return { transactions: next }; }); },
  clear: () => { set((s) => { save(s.profileKey, s.currency, []); return { transactions: [] }; }); }
}));