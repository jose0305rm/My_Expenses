import { useEffect, useState } from 'react';

/**
 * Minimal router based on the URL hash (#/...).
 * Works on any static hosting (GitHub Pages, Netlify, Vercel) with no extra setup.
 */
export type Route =
  | { name: 'wallets' }
  | { name: 'wallet'; walletId: string }
  | { name: 'account'; walletId: string; accountId: string };

function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'wallet' && parts[1]) {
    if (parts[2] === 'account' && parts[3]) return { name: 'account', walletId: parts[1], accountId: parts[3] };
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
  wallet: (walletId: string) => `#/wallet/${walletId}`,
  account: (walletId: string, accountId: string) => `#/wallet/${walletId}/account/${accountId}`,
};

export const navigate = (path: string) => {
  window.location.hash = path;
};
