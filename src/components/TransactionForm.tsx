import { useState, type FormEvent } from 'react';
import Modal from './Modal';
import { ErrorAlert } from './ConfirmDialog';
import type { Transaction, TransactionType } from '../types';
import type { TransactionInput } from '../store';
import { centsToInput, formatCRC, parseAmount, todayISO } from '../utils';

interface Props {
  type: TransactionType;
  transaction?: Transaction;
  /** Saldo actual de la cuenta (en céntimos) */
  balance: number;
  onSubmit: (data: TransactionInput) => string | null;
  onClose: () => void;
}

export default function TransactionForm({ type, transaction, balance, onSubmit, onClose }: Props) {
  const isExpense = type === 'expense';
  const [amount, setAmount] = useState(transaction ? centsToInput(transaction.amount) : '');
  const [date, setDate] = useState(transaction?.date ?? todayISO());
  const [description, setDescription] = useState(transaction?.description ?? '');
  const [error, setError] = useState<string | null>(null);

  // Saldo disponible para un gasto (si se edita, se "devuelve" el monto original)
  const available = isExpense && transaction ? balance + transaction.amount : balance;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cents = parseAmount(amount);
    if (cents === null || cents <= 0) return setError('Ingresa un monto mayor a cero.');
    if (!date) return setError('La fecha es obligatoria.');
    if (!description.trim()) return setError('La descripción es obligatoria.');
    if (isExpense && cents > available)
      return setError(`Saldo insuficiente. Disponible: ${formatCRC(available)}.`);

    const result = onSubmit({ type, amount: cents, date, description });
    if (result) setError(result);
    else onClose();
  };

  const title = `${transaction ? 'Editar' : isExpense ? 'Registrar' : 'Agregar'} ${isExpense ? 'gasto' : 'saldo'}`;

  return (
    <Modal
      title={title}
      icon={isExpense ? 'bi-arrow-down-circle text-red-600' : 'bi-arrow-up-circle text-emerald-600'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {isExpense && (
          <div className="rounded-lg bg-navy-50 px-3 py-2 text-sm text-navy-800">
            Saldo disponible: <strong>{formatCRC(available)}</strong>
          </div>
        )}

        <div>
          <label className="label" htmlFor="tx-amount">
            Monto (₡)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500">₡</span>
            <input
              id="tx-amount"
              className="input pl-7"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              autoFocus
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="tx-date">
            Fecha
          </label>
          <input id="tx-date" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <label className="label" htmlFor="tx-desc">
            Descripción
          </label>
          <input
            id="tx-desc"
            className="input"
            placeholder={isExpense ? 'Ej: Supermercado, gasolina…' : 'Ej: Salario, transferencia…'}
            value={description}
            maxLength={80}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className={isExpense ? 'btn-danger' : 'btn-success'}>
            <i className="bi bi-check-lg" /> Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
}
