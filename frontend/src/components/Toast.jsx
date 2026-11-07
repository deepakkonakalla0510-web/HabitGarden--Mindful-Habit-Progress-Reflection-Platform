import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Moon, Sparkles, AlertCircle, X } from 'lucide-react';

export const Toast = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isRest = toast.type === 'rest';
          const isError = toast.type === 'error';
          const isEvolve = toast.type === 'evolve';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto p-4 rounded-2xl shadow-botanical-lg border flex items-start gap-3 backdrop-blur-md ${
                isError
                  ? 'bg-red-50/95 border-red-200 text-red-900'
                  : isRest
                  ? 'bg-[#F6F4EF]/95 border-[#E2DDD3] text-stone-800'
                  : isEvolve
                  ? 'bg-amber-50/95 border-amber-200 text-amber-950'
                  : 'bg-[#F2F7F0]/95 border-[#D0E2CC] text-botanical-900'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isError ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : isRest ? (
                  <Moon className="w-5 h-5 text-stone-600" />
                ) : isEvolve ? (
                  <Sparkles className="w-5 h-5 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-botanical-600" />
                )}
              </div>

              <div className="flex-1 text-sm">
                <div className="font-semibold text-xs uppercase tracking-wider opacity-75 mb-0.5">
                  {toast.title || (isRest ? 'Dormancy Honored' : isEvolve ? 'Plant Blossomed!' : 'Garden Hydrated')}
                </div>
                <div className="leading-snug text-stone-700 font-medium">
                  {toast.message}
                </div>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="text-stone-400 hover:text-stone-700 p-1 -mr-1 -mt-1 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

