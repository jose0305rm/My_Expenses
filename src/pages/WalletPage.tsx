import { useState } from 'react';
import { useStore } from '../store';
import type { Account, AccountType } from '../types';
import { formatCRC, getWalletTotal } from '../utils';
import { navigate, paths } from '../router';
import AccountCard, { CardAction } from '../components/AccountCard';
import AccountForm from '../components/AccountForm';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import NotFound from './NotFound';

type ModalState =
  | { kind: 'create'; type: AccountType }
  | { kind: 'edit'; account: Account }
  | { kind: 'delete'; account: Account }
  | null;

export default function WalletPage({ walletId }: { walletId: string }) {
  const { wallets, addAccount, updateAccount, deleteAccount } = useStore();
  const [modal, setModal] = useState<ModalState>(null);
  const close = () => setModal(null);

  const wallet = wallets.find((w) => w.id === walletId);
  if (!wallet) return <NotFound />;

  const cash = wallet.accounts.find((a) => a.type === 'cash');
  const cards = wallet.accounts.filter((a) => a.type === 'card');

  const actionsFor = (account: Account) => (
    <>
      <CardAction icon="bi-pencil" label="Editar" onClick={() => setModal({ kind: 'edit', account })} />
      <CardAction icon="bi-trash3" label="Eliminar" onClick={() => setModal({ kind: 'delete', account })} />
    </>
  );

  return (
    <>
      <a href={paths.wallets()} className="mb-4 inline-flex items-center gap-1 text-sm text-navy-600 hover:text-navy-800">
        <i className="bi bi-arrow-left" /> Mis billeteras
      </a>

      <div className="mb-8 rounded-2xl bg-navy-900 p-6 text-white shadow-lg">
        <p className="text-sm text-navy-200">
          <i className="bi bi-wallet2 mr-1" /> Billetera
        </p>
        <h2 className="text-2xl font-bold">{wallet.name}</h2>
        <p className="mt-3 text-sm text-navy-200">Saldo total</p>
        <p className="text-3xl font-bold">{formatCRC(getWalletTotal(wallet))}</p>
      </div>

      {/* Efectivo */}
      <section className="mb-10">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-navy-900">
          <i className="bi bi-cash-stack" /> Efectivo
        </h3>
        {cash ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AccountCard
              account={cash}
              onClick={() => navigate(paths.account(wallet.id, cash.id))}
              actions={actionsFor(cash)}
            />
          </div>
        ) : (
          <button
            onClick={() => setModal({ kind: 'create', type: 'cash' })}
            className="flex aspect-[1.6/1] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-500 transition hover:border-navy-400 hover:text-navy-700 sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)]"
          >
            <i className="bi bi-plus-circle text-3xl" />
            <span className="font-medium">Agregar efectivo</span>
            <span className="text-xs">Solo se permite una cuenta de efectivo por billetera</span>
          </button>
        )}
      </section>

      {/* Tarjetas */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
            <i className="bi bi-credit-card-2-front" /> Tarjetas
          </h3>
          {cards.length > 0 && (
            <button className="btn-primary" onClick={() => setModal({ kind: 'create', type: 'card' })}>
              <i className="bi bi-plus-lg" /> Nueva tarjeta
            </button>
          )}
        </div>

        {cards.length === 0 ? (
          <EmptyState
            icon="bi-credit-card"
            title="Sin tarjetas"
            text="Agrega tus tarjetas con su monto inicial para controlar los gastos de cada una."
            action={
              <button className="btn-primary" onClick={() => setModal({ kind: 'create', type: 'card' })}>
                <i className="bi bi-plus-lg" /> Agregar tarjeta
              </button>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <AccountCard
                key={c.id}
                account={c}
                onClick={() => navigate(paths.account(wallet.id, c.id))}
                actions={actionsFor(c)}
              />
            ))}
          </div>
        )}
      </section>

      {modal?.kind === 'create' && (
        <AccountForm
          type={modal.type}
          onSubmit={(data) => addAccount(wallet.id, modal.type, data)}
          onClose={close}
        />
      )}
      {modal?.kind === 'edit' && (
        <AccountForm
          type={modal.account.type}
          account={modal.account}
          onSubmit={(data) => updateAccount(wallet.id, modal.account.id, data)}
          onClose={close}
        />
      )}
      {modal?.kind === 'delete' && (
        <ConfirmDialog
          title={modal.account.type === 'cash' ? 'Eliminar efectivo' : 'Eliminar tarjeta'}
          message={
            <>
              ¿Seguro que deseas eliminar <strong>{modal.account.name}</strong> y todo su historial? Esta acción no se
              puede deshacer.
            </>
          }
          onConfirm={() => deleteAccount(wallet.id, modal.account.id)}
          onClose={close}
        />
      )}
    </>
  );
}
