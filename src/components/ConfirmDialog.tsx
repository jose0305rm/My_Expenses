import { useState, type ReactNode } from 'react';
import Modal from './Modal';

interface Props {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  /** Returns an error message to display, or null if everything went fine. */
  onConfirm: () => string | null | void;
  onClose: () => void;
}

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onClose }: Props) {
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    const result = onConfirm();
    if (typeof result === 'string') setError(result);
    else onClose();
  };

  return (
    <Modal title={title} icon="bi-exclamation-triangle text-red-600" onClose={onClose}>
      <div className="text-slate-600">{message}</div>
      {error && <ErrorAlert message={error} />}
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-danger" onClick={handleConfirm}>
          <i className="bi bi-trash3" /> {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      <i className="bi bi-exclamation-circle-fill mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
