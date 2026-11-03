import { useEffect, useState } from 'react';

/**
 * Router mínimo basado en el hash de la URL (#/...).
 * Funciona en cualquier hosting estático (GitHub Pages, Netlify, Vercel)
 * sin configuración extra.
 */
export type Route =
  | { name: 'wallets' }
  | { name: 'wallet'; walletId: string }
  | { name: 'account'; walletId: string; accountId: string };

function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'billetera' && parts[1]) {
    if (parts[2] === 'cuenta' && parts[3]) return { name: 'account', walletId: parts[1], accountId: parts[3] };
    return { name: 'wallet', walletId: parts[1] };
  }
  return { name: 'wallets' };
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parse(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export const paths = {
  wallets: () => '#/',
  wallet: (walletId: string) => `#/billetera/${walletId}`,
  account: (walletId: string, accountId: string) => `#/billetera/${walletId}/cuenta/${accountId}`,
};

export const navigate = (path: string) => {
  window.location.hash = path;
};
