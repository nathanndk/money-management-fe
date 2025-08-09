import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) { return clsx(inputs); }
export const currencyFormat = (n: number, currency = 'IDR') => new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(n);