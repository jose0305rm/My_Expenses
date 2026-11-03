import { useState } from 'react';
import { useStore } from '../store';
import type { Wallet } from '../types';
import { formatCRC, getWalletTotal } from '../utils';
import { navigate, paths } from '../router';
import WalletForm from '../components/WalletForm';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';

type ModalState = { kind: 'create' } | { kind: 'edit'; wallet: Wallet } | { kind: 'delete'; wallet: Wallet } | null;

export default function WalletsPage() {
  const { wallets, addWallet, renameWallet, deleteWallet } = useStore();
  const [modal, setModal] = useState<ModalState>(null);
  const close = () => setModal(null);

  const grandTotal = wallets.reduce((s, w) => s + getWalletTotal(w), 0);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Mis billeteras</h2>
          <p className="text-sm text-slate-500">
            Saldo total: <span className="font-semibold text-navy-800">{formatCRC(grandTotal)}</span>
          </p>
        </div>
        <button className="btn-primary" onClick={() => setModal({ kind: 'create' })}>
          <i className="bi bi-plus-lg" /> Nueva billetera
        </button>
      </div>

      {wallets.length === 0 ? (
        <EmptyState
          icon="bi-wallet2"
          title="Aún no tienes billeteras"
          text="Crea una billetera (por ejemplo «Usuario 1») para empezar a registrar tus tarjetas, efectivo y gastos."
          action={
            <button className="btn-primary" onClick={() => setModal({ kind: 'create' })}>
              <i className="bi bi-plus-lg" /> Crear billetera
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wallets.map((w) => {
            const cards = w.accounts.filter((a) => a.type === 'card').length;
            const hasCash = w.accounts.some((a) => a.type === 'cash');
            return (
              <div
                key={w.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(paths.wallet(w.id))}
                onKeyDown={(e) => e.key === 'Enter' && navigate(paths.wallet(w.id))}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 text-xl text-white">
                    <i className="bi bi-wallet2" />
                  </span>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                    <button
                      className="icon-btn text-slate-500 hover:bg-navy-50 hover:text-navy-700"
                      title="Editar"
                      onClick={() => setModal({ kind: 'edit', wallet: w })}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                    <button
                      className="icon-btn text-slate-500 hover:bg-red-50 hover:text-red-600"
                      title="Eliminar"
                      onClick={() => setModal({ kind: 'delete', wallet: w })}
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                </div>
                <h3 className="mt-4 truncate text-lg font-semibold text-navy-900">{w.name}</h3>
                <p className="text-2xl font-bold text-navy-800">{formatCRC(getWalletTotal(w))}</p>
                <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-500">
                  <span>
                    <i className="bi bi-credit-card mr-1" />
                    {cards} {cards === 1 ? 'tarjeta' : 'tarjetas'}
                  </span>
                  <span>
                    <i className="bi bi-cash-stack mr-1" />
                    {hasCash ? 'Con efectivo' : 'Sin efectivo'}
                  </span>
                  <i className="bi bi-chevron-right ml-auto text-navy-400 transition group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal?.kind === 'create' && <WalletForm onSubmit={addWallet} onClose={close} />}
      {modal?.kind === 'edit' && (
        <WalletForm
          initialName={modal.wallet.name}
          onSubmit={(name) => renameWallet(modal.wallet.id, name)}
          onClose={close}
        />
      )}
      {modal?.kind === 'delete' && (
        <ConfirmDialog
          title="Eliminar billetera"
          message={
            <>
              ¿Seguro que deseas eliminar <strong>{modal.wallet.name}</strong>? Se borrarán también todas sus tarjetas,
              efectivo e historial. Esta acción no se puede deshacer.
            </>
          }
          onConfirm={() => deleteWallet(modal.wallet.id)}
          onClose={close}
        />
      )}
    </>
  );
}
