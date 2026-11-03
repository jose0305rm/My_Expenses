import type { ReactNode } from 'react';
import type { Account } from '../types';
import { CARD_COLORS, formatCRC, getBalance } from '../utils';

interface Props {
  account: Account;
  onClick?: () => void;
  actions?: ReactNode;
  large?: boolean;
}

/** Representación visual de una tarjeta o de la cuenta de efectivo. */
export default function AccountCard({ account, onClick, actions, large }: Props) {
  const isCash = account.type === 'cash';
  const balance = getBalance(account);

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => onClick && e.key === 'Enter' && onClick()}
      className={`group relative flex aspect-[1.6/1] w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg ${
        CARD_COLORS[account.color].gradient
      } ${onClick ? 'cursor-pointer transition hover:-translate-y-1 hover:shadow-2xl' : ''} ${large ? 'max-w-md' : ''}`}
    >
      {/* Decoración */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-white/5" />

      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs tracking-wider text-white/70 uppercase">{isCash ? 'Efectivo' : 'Tarjeta'}</p>
          <p className="truncate text-lg font-semibold">{account.name}</p>
        </div>
        <div className="flex items-center gap-1">
          {actions}
          <i className={`bi ${isCash ? 'bi-cash-stack' : 'bi-credit-card-2-front'} ml-1 text-2xl text-white/80`} />
        </div>
      </div>

      {!isCash && (
        <div className="relative flex items-center gap-3 text-white/70">
          <i className="bi bi-sim text-2xl text-amber-200/80" />
          <span className="font-mono tracking-widest">•••• •••• •••• {account.lastDigits ?? '••••'}</span>
        </div>
      )}

      <div className="relative">
        <p className="text-xs text-white/70">Saldo disponible</p>
        <p className={`font-bold tracking-tight ${large ? 'text-3xl' : 'text-2xl'}`}>{formatCRC(balance)}</p>
      </div>
    </div>
  );
}

/** Botón de acción pequeño para usar sobre las tarjetas (no propaga el click). */
export function CardAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => e.stopPropagation()}
      className="icon-btn bg-white/10 text-white/90 hover:bg-white/25"
    >
      <i className={`bi ${icon}`} />
    </button>
  );
}
