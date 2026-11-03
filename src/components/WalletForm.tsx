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
    if (!name.trim()) return setError('Name is required.');
    onSubmit(name);
    onClose();
  };

  return (
    <Modal title={editing ? 'Edit wallet' : 'New wallet'} icon="bi-wallet2" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label className="label" htmlFor="wallet-name">
          Name
        </label>
        <input
          id="wallet-name"
          className="input"
          placeholder="e.g. User 1, Personal, Home…"
          value={name}
          maxLength={40}
          autoFocus
          onChange={(e) => setName(e.target.value)}
        />
        {error && <ErrorAlert message={error} />}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <i className="bi bi-check-lg" /> {editing ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
