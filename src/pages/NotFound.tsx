import EmptyState from '../components/EmptyState';
import { paths } from '../router';

export default function NotFound() {
  return (
    <EmptyState
      icon="bi-question-circle"
      title="Not found"
      text="The wallet or account you are looking for does not exist or was deleted."
      action={
        <a href={paths.wallets()} className="btn-primary">
          <i className="bi bi-arrow-left" /> Back to my wallets
        </a>
      }
    />
  );
}
