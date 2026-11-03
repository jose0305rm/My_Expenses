import type { ReactNode } from 'react';
import { paths } from '../router';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href={paths.wallets()} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
              <i className="bi bi-wallet2" />
            </span>
            <div>
              <h1 className="text-lg leading-tight font-bold">Control de Gastos</h1>
              <p className="text-xs text-navy-200">Colones costarricenses (₡)</p>
            </div>
          </a>
          <span
            className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-navy-100 sm:flex"
            title="La información se guarda únicamente en este navegador"
          >
            <i className="bi bi-shield-lock" /> Datos privados en tu navegador
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <i className="bi bi-lock-fill mr-1" />
        Tus datos se guardan solo en este dispositivo (localStorage). Nadie más puede verlos.
      </footer>
    </div>
  );
}
