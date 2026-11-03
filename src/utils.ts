import type { Account, CardColor, Wallet } from './types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'CRC',
  currencyDisplay: 'narrowSymbol',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats cents as Costa Rican colones (₡). */
export const formatCRC = (cents: number) => currency.format(cents / 100);

/** Converts input text to cents. Returns null if invalid. */
export function parseAmount(value: string): number | null {
  const n = Number(value.trim().replace(',', '.'));
  if (!value.trim() || !Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

/** Cents -> text to prefill inputs. */
export const centsToInput = (cents: number) => (cents / 100).toString();

export function getBalance(account: Account): number {
  return account.transactions.reduce(
    (sum, t) => (t.type === 'deposit' ? sum + t.amount : sum - t.amount),
    account.initialBalance,
  );
}

export const getWalletTotal = (wallet: Wallet) =>
  wallet.accounts.reduce((sum, a) => sum + getBalance(a), 0);

export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const dateFormat: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', dateFormat);
}

export const formatTimestamp = (ms: number) => new Date(ms).toLocaleDateString('en-US', dateFormat);

export const CARD_COLORS: Record<CardColor, { label: string; gradient: string; swatch: string }> = {
  navy: { label: 'Navy blue', gradient: 'from-navy-700 via-navy-800 to-navy-950', swatch: 'bg-navy-800' },
  slate: { label: 'Graphite', gradient: 'from-slate-600 via-slate-700 to-slate-900', swatch: 'bg-slate-700' },
  emerald: { label: 'Emerald', gradient: 'from-emerald-600 via-emerald-700 to-teal-900', swatch: 'bg-emerald-700' },
  purple: { label: 'Purple', gradient: 'from-violet-600 via-purple-700 to-indigo-900', swatch: 'bg-purple-700' },
  rose: { label: 'Ruby', gradient: 'from-rose-600 via-rose-700 to-red-900', swatch: 'bg-rose-700' },
  amber: { label: 'Gold', gradient: 'from-amber-500 via-amber-600 to-orange-800', swatch: 'bg-amber-600' },
};
