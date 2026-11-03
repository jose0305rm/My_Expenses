import { useState, type FormEvent } from 'react';
import Modal from './Modal';
import { ErrorAlert } from './ConfirmDialog';
import type { Account, AccountType, CardColor } from '../types';
import type { AccountInput } from '../store';
import { CARD_COLORS, centsToInput, parseAmount } from '../utils';

interface Props {
  type: AccountType;
  account?: Account;
  /** Returns an error message, or null if saved successfully. */
  onSubmit: (data: AccountInput) => string | null;
  onClose: () => void;
}

export default function AccountForm({ type, account, onSubmit, onClose }: Props) {
  const isCash = type === 'cash';
  const [name, setName] = useState(account?.name ?? (isCash ? 'Cash' : ''));
  const [lastDigits, setLastDigits] = useState(account?.lastDigits ?? '');
  const [color, setColor] = useState<CardColor>(account?.color ?? (isCash ? 'emerald' : 'navy'));
  const [amount, setAmount] = useState(account ? centsToInput(account.initialBalance) : '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Name is required.');
    if (lastDigits && !/^\d{4}$/.test(lastDigits)) return setError('Last digits must be 4 numbers.');
    const initialBalance = parseAmount(amount);
    if (initialBalance === null) return setError('Enter a valid starting balance (0 or more).');

    const result = onSubmit({ name, lastDigits, color, initialBalance });
    if (result) setError(result);
    else onClose();
  };

  const title = account ? (isCash ? 'Edit cash' : 'Edit card') : isCash ? 'Add cash' : 'New card';

  return (
    <Modal title={title} icon={isCash ? 'bi-cash-stack' : 'bi-credit-card-2-front'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="acc-name">
            Name
          </label>
          <input
            id="acc-name"
            className="input"
            placeholder={isCash ? 'Cash' : 'e.g. BAC Debit, BCR Credit…'}
            value={name}
            maxLength={30}
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {!isCash && (
          <div>
            <label className="label" htmlFor="acc-digits">
              Last 4 digits <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="acc-digits"
              className="input"
              inputMode="numeric"
              placeholder="1234"
              value={lastDigits}
              maxLength={4}
              onChange={(e) => setLastDigits(e.target.value.replace(/\D/g, ''))}
            />
          </div>
        )}

        <div>
          <label className="label" htmlFor="acc-amount">
            Starting balance (₡)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500">₡</span>
            <input
              id="acc-amount"
              className="input pl-7"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {account && (
            <p className="mt-1 text-xs text-slate-500">
              Changing the starting balance recalculates the balance. Not allowed if the balance would go negative.
            </p>
          )}
        </div>

        <div>
          <span className="label">Color</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CARD_COLORS) as CardColor[]).map((c) => (
              <button
                key={c}
                type="button"
                title={CARD_COLORS[c].label}
                onClick={() => setColor(c)}
                className={`h-9 w-9 rounded-full ${CARD_COLORS[c].swatch} ring-offset-2 transition ${
                  color === c ? 'ring-2 ring-navy-500' : 'hover:scale-110'
                }`}
              >
                {color === c && <i className="bi bi-check-lg text-white" />}
              </button>
            ))}
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <i className="bi bi-check-lg" /> {account ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
