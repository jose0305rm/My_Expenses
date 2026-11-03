import { useEffect, type ReactNode } from 'react';

interface Props {
  title: string;
  icon?: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ title, icon, onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl" role="dialog" aria-modal="true">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
            {icon && <i className={`bi ${icon}`} />}
            {title}
          </h2>
          <button onClick={onClose} className="icon-btn text-slate-500 hover:bg-slate-100" aria-label="Cerrar">
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
