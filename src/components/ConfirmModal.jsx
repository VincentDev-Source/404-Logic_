import React from 'react';
import { AlertTriangle, Trash2, X, HelpCircle } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Konfirmasi Tindakan', 
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'danger' // 'danger' | 'warning' | 'info'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-black rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
              type === 'danger'
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            }`}>
              {type === 'danger' ? <Trash2 className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
            </div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-white">
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Message Content */}
        <div className="p-5 space-y-3 text-xs">
          <p className="text-neutral-700 dark:text-neutral-300 font-semibold leading-relaxed">
            {message}
          </p>

          <p className="text-[11px] text-neutral-400 font-medium">
            Tindakan ini akan diproses langsung dan memperbarui sistem secara real-time.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end space-x-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl font-extrabold text-white shadow-md transition-all flex items-center gap-1.5 ${
              type === 'danger'
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black'
            }`}
          >
            {type === 'danger' && <Trash2 className="w-3.5 h-3.5" />}
            <span>{confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
