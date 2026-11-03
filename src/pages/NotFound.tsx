import EmptyState from '../components/EmptyState';
import { paths } from '../router';

export default function NotFound() {
  return (
    <EmptyState
      icon="bi-question-circle"
      title="No encontrado"
      text="La billetera o cuenta que buscas no existe o fue eliminada."
      action={
        <a href={paths.wallets()} className="btn-primary">
          <i className="bi bi-arrow-left" /> Volver a mis billeteras
        </a>
      }
    />
  );
}
