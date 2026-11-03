import Layout from './components/Layout';
import { useRoute } from './router';
import WalletsPage from './pages/WalletsPage';
import WalletPage from './pages/WalletPage';
import AccountPage from './pages/AccountPage';

export default function App() {
  const route = useRoute();

  return (
    <Layout>
      {route.name === 'wallets' && <WalletsPage />}
      {route.name === 'wallet' && <WalletPage walletId={route.walletId} />}
      {route.name === 'account' && <AccountPage walletId={route.walletId} accountId={route.accountId} />}
    </Layout>
  );
}
