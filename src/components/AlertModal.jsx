import React from 'react';
import { AlertCircle, CheckCircle2, X, Info } from 'lucide-react';

export default function AlertModal({ 
  isOpen, 
  onClose, 
  title = 'Pemberitahuan', 
  message = '',
  type = 'warning' // 'warning' | 'error' | 'success' | 'info'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-black rounded-2xl sm:rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-auto max-h-[calc(100dvh-1.5rem)]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
              type === 'error'
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : type === 'success'
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            }`}>
              {type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
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

        {/* Modal Content */}
        <div className="p-5 space-y-3 text-xs">
          <p className="text-neutral-700 dark:text-neutral-300 font-semibold leading-relaxed">
            {message}
          </p>
        </div>

        {/* Modal Action */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-extrabold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md transition-all"
          >
            Mengerti
          </button>
        </div>

      </div>
    </div>
  );
}
