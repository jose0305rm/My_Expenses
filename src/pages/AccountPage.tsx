import { useState } from 'react';
import { useStore } from '../store';
import type { Transaction, TransactionType } from '../types';
import { formatCRC, formatDate, formatTimestamp, getBalance } from '../utils';
import { paths } from '../router';
import AccountCard from '../components/AccountCard';
import TransactionForm from '../components/TransactionForm';
import ConfirmDialog from '../components/ConfirmDialog';
import NotFound from './NotFound';

type ModalState =
  | { kind: 'create'; type: TransactionType }
  | { kind: 'edit'; tx: Transaction }
  | { kind: 'delete'; tx: Transaction }
  | null;

type Filter = 'all' | TransactionType;

export default function AccountPage({ walletId, accountId }: { walletId: string; accountId: string }) {
  const { wallets, addTransaction, updateTransaction, deleteTransaction } = useStore();
  const [modal, setModal] = useState<ModalState>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const close = () => setModal(null);

  const wallet = wallets.find((w) => w.id === walletId);
  const account = wallet?.accounts.find((a) => a.id === accountId);
  if (!wallet || !account) return <NotFound />;

  const balance = getBalance(account);
  const totalExpenses = account.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalDeposits = account.transactions.filter((t) => t.type === 'deposit').reduce((s, t) => s + t.amount, 0);

  const history = [...account.transactions]
    .filter((t) => filter === 'all' || t.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'expense', label: 'Expenses' },
    { key: 'deposit', label: 'Deposits' },
  ];

  return (
    <>
      <a
        href={paths.wallet(wallet.id)}
        className="mb-4 inline-flex items-center gap-1 text-sm text-navy-600 hover:text-navy-800"
      >
        <i className="bi bi-arrow-left" /> {wallet.name}
      </a>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr]">
        {/* Left column: card + summary */}
        <div className="space-y-5">
          <AccountCard account={account} large />

          <div className="grid grid-cols-2 gap-3">
            <button className="btn-danger py-3" onClick={() => setModal({ kind: 'create', type: 'expense' })}>
              <i className="bi bi-dash-circle" /> Add expense
            </button>
            <button className="btn-success py-3" onClick={() => setModal({ kind: 'create', type: 'deposit' })}>
              <i className="bi bi-plus-circle" /> Add funds
            </button>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-navy-900">Summary</h3>
            <SummaryRow label="Starting balance" value={formatCRC(account.initialBalance)} />
            <SummaryRow label="Total deposits" value={`+ ${formatCRC(totalDeposits)}`} className="text-emerald-600" />
            <SummaryRow label="Total expenses" value={`- ${formatCRC(totalExpenses)}`} className="text-red-600" />
            <div className="border-t border-slate-100 pt-3">
              <SummaryRow label="Current balance" value={formatCRC(balance)} className="text-lg font-bold text-navy-900" />
            </div>
          </div>
        </div>

        {/* Right column: history */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
              <i className="bi bi-clock-history" /> Expense and deposit history
            </h3>
            <div className="flex rounded-lg bg-slate-100 p-1 text-sm">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-md px-3 py-1 font-medium transition ${
                    filter === f.key ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <ul className="divide-y divide-slate-100">
            {history.map((t) => {
              const isExpense = t.type === 'expense';
              return (
                <li key={t.id} className="group flex items-center gap-4 px-5 py-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                      isExpense ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    <i className={`bi ${isExpense ? 'bi-arrow-down-right' : 'bi-arrow-up-right'}`} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-800">{t.description}</p>
                    <p className="text-xs text-slate-500">
                      {formatDate(t.date)} · {isExpense ? 'Expense' : 'Deposit'}
                    </p>
                  </div>
                  <p className={`shrink-0 font-semibold ${isExpense ? 'text-red-600' : 'text-emerald-600'}`}>
                    {isExpense ? '-' : '+'} {formatCRC(t.amount)}
                  </p>
                  <div className="flex shrink-0 gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                    <button
                      className="icon-btn text-slate-500 hover:bg-navy-50 hover:text-navy-700"
                      title="Edit"
                      onClick={() => setModal({ kind: 'edit', tx: t })}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                    <button
                      className="icon-btn text-slate-500 hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                      onClick={() => setModal({ kind: 'delete', tx: t })}
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                </li>
              );
            })}

            {/* Starting balance always at the end of the history */}
            {filter !== 'expense' && (
              <li className="flex items-center gap-4 bg-slate-50/60 px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg text-emerald-600">
                  <i className="bi bi-flag" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800">Starting balance</p>
                  <p className="text-xs text-slate-500">
                    {formatTimestamp(account.createdAt)}{' '}
                    · Opening
                  </p>
                </div>
                <p className="shrink-0 font-semibold text-emerald-600">+ {formatCRC(account.initialBalance)}</p>
                <div className="hidden w-[4.25rem] sm:block" />
              </li>
            )}
          </ul>

          {history.length === 0 && filter === 'expense' && (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              <i className="bi bi-inbox mb-2 block text-3xl text-slate-300" />
              No expenses recorded yet.
            </p>
          )}
        </section>
      </div>

      {modal?.kind === 'create' && (
        <TransactionForm
          type={modal.type}
          balance={balance}
          onSubmit={(data) => addTransaction(wallet.id, account.id, data)}
          onClose={close}
        />
      )}
      {modal?.kind === 'edit' && (
        <TransactionForm
          type={modal.tx.type}
          transaction={modal.tx}
          balance={balance}
          onSubmit={(data) => updateTransaction(wallet.id, account.id, modal.tx.id, data)}
          onClose={close}
        />
      )}
      {modal?.kind === 'delete' && (
        <ConfirmDialog
          title={modal.tx.type === 'expense' ? 'Delete expense' : 'Delete deposit'}
          message={
            <>
              Delete <strong>{modal.tx.description}</strong> for{' '}
              <strong className={modal.tx.type === 'expense' ? 'text-red-600' : 'text-emerald-600'}>
                {formatCRC(modal.tx.amount)}
              </strong>
              ?
            </>
          }
          onConfirm={() => deleteTransaction(wallet.id, account.id, modal.tx.id)}
          onClose={close}
        />
      )}
    </>
  );
}

function SummaryRow({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold ${className}`}>{value}</span>
    </div>
  );
}
