import { useState, type FormEvent } from 'react';
import Modal from './Modal';
import { ErrorAlert } from './ConfirmDialog';

interface Props {
  initialName?: string;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export default function WalletForm({ initialName = '', onSubmit, onClose }: Props) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const editing = Boolean(initialName);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('El nombre es obligatorio.');
    onSubmit(name);
    onClose();
  };

  return (
    <Modal title={editing ? 'Editar billetera' : 'Nueva billetera'} icon="bi-wallet2" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="label" htmlFor="wallet-name">
          Nombre
        </label>
        <input
          id="wallet-name"
          className="input"
          placeholder="Ej: Usuario 1, Personal, Hogar…"
          value={name}
          maxLength={40}
          autoFocus
          onChange={(e) => setName(e.target.value)}
        />
        {error && <ErrorAlert message={error} />}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            <i className="bi bi-check-lg" /> {editing ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
