import { useState, type FormEvent } from 'react';
import Modal from './Modal';
import { ErrorAlert } from './ConfirmDialog';
import type { Account, AccountType, CardColor } from '../types';
import type { AccountInput } from '../store';
import { CARD_COLORS, centsToInput, parseAmount } from '../utils';

interface Props {
  type: AccountType;
  account?: Account;
  /** Devuelve un mensaje de error o null si se guardó correctamente. */
  onSubmit: (data: AccountInput) => string | null;
  onClose: () => void;
}

export default function AccountForm({ type, account, onSubmit, onClose }: Props) {
  const isCash = type === 'cash';
  const [name, setName] = useState(account?.name ?? (isCash ? 'Efectivo' : ''));
  const [lastDigits, setLastDigits] = useState(account?.lastDigits ?? '');
  const [color, setColor] = useState<CardColor>(account?.color ?? (isCash ? 'emerald' : 'navy'));
  const [amount, setAmount] = useState(account ? centsToInput(account.initialBalance) : '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('El nombre es obligatorio.');
    if (lastDigits && !/^\d{4}$/.test(lastDigits)) return setError('Los últimos dígitos deben ser 4 números.');
    const initialBalance = parseAmount(amount);
    if (initialBalance === null) return setError('Ingresa un monto inicial válido (0 o mayor).');

    const result = onSubmit({ name, lastDigits, color, initialBalance });
    if (result) setError(result);
    else onClose();
  };

  const title = account ? (isCash ? 'Editar efectivo' : 'Editar tarjeta') : isCash ? 'Agregar efectivo' : 'Nueva tarjeta';

  return (
    <Modal title={title} icon={isCash ? 'bi-cash-stack' : 'bi-credit-card-2-front'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="acc-name">
            Nombre
          </label>
          <input
            id="acc-name"
            className="input"
            placeholder={isCash ? 'Efectivo' : 'Ej: BAC Débito, BCR Crédito…'}
            value={name}
            maxLength={30}
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {!isCash && (
          <div>
            <label className="label" htmlFor="acc-digits">
              Últimos 4 dígitos <span className="font-normal text-slate-400">(opcional)</span>
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
            Monto inicial (₡)
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
              Cambiar el monto inicial recalcula el saldo. No se permite si el saldo quedaría negativo.
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
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            <i className="bi bi-check-lg" /> {account ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
