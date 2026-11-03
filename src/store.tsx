import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Account, AccountType, CardColor, TransactionType, Wallet } from './types';
import { getBalance, uid } from './utils';

/**
 * Los datos se guardan en el localStorage del navegador de cada visitante.
 * Así, quien abra el proyecto desde el portafolio solo ve SUS datos y nadie
 * más puede verlos (no hay servidor ni base de datos compartida).
 */
const STORAGE_KEY = 'control-gastos:data:v1';

function load(): Wallet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? (data as Wallet[]) : [];
  } catch {
    return [];
  }
}

export interface AccountInput {
  name: string;
  lastDigits?: string;
  color: CardColor;
  initialBalance: number;
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
}

/** null = éxito, string = mensaje de error */
type Result = string | null;

interface Store {
  wallets: Wallet[];
  addWallet: (name: string) => void;
  renameWallet: (id: string, name: string) => void;
  deleteWallet: (id: string) => void;
  addAccount: (walletId: string, type: AccountType, data: AccountInput) => Result;
  updateAccount: (walletId: string, accountId: string, data: AccountInput) => Result;
  deleteAccount: (walletId: string, accountId: string) => void;
  addTransaction: (walletId: string, accountId: string, data: TransactionInput) => Result;
  updateTransaction: (walletId: string, accountId: string, txId: string, data: TransactionInput) => Result;
  deleteTransaction: (walletId: string, accountId: string, txId: string) => Result;
}

const StoreContext = createContext<Store | null>(null);

const NEGATIVE_ERROR = 'Operación no permitida: la cuenta quedaría con saldo negativo.';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
  }, [wallets]);

  // Sincroniza si el usuario tiene la app abierta en varias pestañas
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setWallets(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const findAccount = (walletId: string, accountId: string) =>
    wallets.find((w) => w.id === walletId)?.accounts.find((a) => a.id === accountId);

  /** Aplica un cambio a una cuenta validando que el saldo nunca quede negativo. */
  const mutateAccount = (walletId: string, accountId: string, fn: (a: Account) => Account): Result => {
    const current = findAccount(walletId, accountId);
    if (!current) return 'La cuenta no existe.';
    const next = fn(current);
    if (getBalance(next) < 0) return NEGATIVE_ERROR;
    setWallets((ws) =>
      ws.map((w) =>
        w.id !== walletId ? w : { ...w, accounts: w.accounts.map((a) => (a.id === accountId ? next : a)) },
      ),
    );
    return null;
  };

  const store: Store = {
    wallets,

    addWallet: (name) =>
      setWallets((ws) => [...ws, { id: uid(), name: name.trim(), accounts: [], createdAt: Date.now() }]),

    renameWallet: (id, name) =>
      setWallets((ws) => ws.map((w) => (w.id === id ? { ...w, name: name.trim() } : w))),

    deleteWallet: (id) => setWallets((ws) => ws.filter((w) => w.id !== id)),

    addAccount: (walletId, type, data) => {
      const wallet = wallets.find((w) => w.id === walletId);
      if (!wallet) return 'La billetera no existe.';
      if (type === 'cash' && wallet.accounts.some((a) => a.type === 'cash'))
        return 'Esta billetera ya tiene una cuenta de efectivo.';
      if (data.initialBalance < 0) return 'El monto inicial no puede ser negativo.';
      const account: Account = {
        id: uid(),
        type,
        name: data.name.trim(),
        lastDigits: type === 'card' ? data.lastDigits?.trim() || undefined : undefined,
        color: data.color,
        initialBalance: data.initialBalance,
        transactions: [],
        createdAt: Date.now(),
      };
      setWallets((ws) => ws.map((w) => (w.id === walletId ? { ...w, accounts: [...w.accounts, account] } : w)));
      return null;
    },

    updateAccount: (walletId, accountId, data) =>
      mutateAccount(walletId, accountId, (a) => ({
        ...a,
        name: data.name.trim(),
        lastDigits: a.type === 'card' ? data.lastDigits?.trim() || undefined : undefined,
        color: data.color,
        initialBalance: data.initialBalance,
      })),

    deleteAccount: (walletId, accountId) =>
      setWallets((ws) =>
        ws.map((w) => (w.id === walletId ? { ...w, accounts: w.accounts.filter((a) => a.id !== accountId) } : w)),
      ),

    addTransaction: (walletId, accountId, data) => {
      if (data.amount <= 0) return 'El monto debe ser mayor a cero.';
      return mutateAccount(walletId, accountId, (a) => ({
        ...a,
        transactions: [...a.transactions, { ...data, description: data.description.trim(), id: uid(), createdAt: Date.now() }],
      }));
    },

    updateTransaction: (walletId, accountId, txId, data) => {
      if (data.amount <= 0) return 'El monto debe ser mayor a cero.';
      return mutateAccount(walletId, accountId, (a) => ({
        ...a,
        transactions: a.transactions.map((t) =>
          t.id === txId ? { ...t, ...data, description: data.description.trim() } : t,
        ),
      }));
    },

    deleteTransaction: (walletId, accountId, txId) =>
      mutateAccount(walletId, accountId, (a) => ({
        ...a,
        transactions: a.transactions.filter((t) => t.id !== txId),
      })),
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore debe usarse dentro de <StoreProvider>');
  return ctx;
}
