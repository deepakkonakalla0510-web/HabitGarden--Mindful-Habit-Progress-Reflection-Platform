import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, HeartHandshake, X, Sparkles, Coffee, Briefcase, ZapOff, Clock, ShieldAlert, Check } from 'lucide-react';

const REASON_TAGS = [
  { label: 'Low Energy', icon: ZapOff, description: 'Physical tiredness, needing restorative sleep' },
  { label: 'Overworked/Busy', icon: Briefcase, description: 'Work or study schedules overflowed' },
  { label: 'Mental Health/Rest', icon: Moon, description: 'Needed emotional space and mental quiet' },
  { label: 'Unplanned Event', icon: ShieldAlert, description: 'Life surprises took priority today' },
  { label: 'Slept In', icon: Clock, description: 'Honored extra morning sleep without guilt' },
  { label: 'None', icon: Coffee, description: 'Just taking a gentle pause' },
];

export const ReflectionModal = ({
  isOpen,
  onClose,
  habit,
  targetDate,
  existingStatus,
  onSubmitReflection,
}) => {
  const [selectedTag, setSelectedTag] = useState('Mental Health/Rest');
  const [reflectionNote, setReflectionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedTag('Mental Health/Rest');
      setReflectionNote('');
    }
  }, [isOpen, habit, targetDate]);

  if (!isOpen || !habit) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitReflection({
        habitId: habit._id,
        date: targetDate,
        reasonTag: selectedTag,
        reflectionNote,
        status: 'rest_day',
      });
      onClose();
    } catch (err) {
      console.error('Reflection submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl border border-oatmeal-300 p-6 sm:p-8 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-200/50 transition-colors"
            aria-label="Close reflection modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Calming Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#E8E2D5] flex items-center justify-center text-stone-700 shadow-sm">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                Mindful Dormancy Log
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Every garden rests.
              </h2>
            </div>
          </div>

          <p className="text-sm text-stone-600 mb-5 leading-relaxed">
            What was the rhythm on <span className="font-semibold text-stone-800">{targetDate}</span> for{' '}
            <span className="font-semibold text-botanical-800">"{habit.title}"</span>? Plants enter
            dormancy to gather strength for the next season. Your progress remains completely safe.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Reason Tag Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
                Gentle Reason Tag
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {REASON_TAGS.map((tag) => {
                  const Icon = tag.icon;
                  const isSelected = selectedTag === tag.label;
                  return (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => setSelectedTag(tag.label)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                        isSelected
                          ? 'bg-[#E3DC CE] text-stone-900 border-stone-500 shadow-sm font-semibold'
                          : 'bg-white hover:bg-oatmeal-100 text-stone-600 border-oatmeal-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                      <span className="truncate">{tag.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reflection Note */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Personal Reflection Note (Optional)
                </label>
                <span className="text-[11px] text-stone-400 font-mono">
                  {reflectionNote.length}/500
                </span>
              </div>
              <textarea
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="e.g., Felt a little drained after exams. Decided to take a warm bath and read a book instead of forcing a session..."
                className="w-full rounded-2xl bg-white border border-oatmeal-300 p-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none transition-all"
              />
            </div>

            {/* Guilt-Free Assurance Banner */}
            <div className="p-3.5 rounded-2xl bg-botanical-50/80 border border-botanical-200/80 flex items-start gap-3 text-xs text-botanical-900">
              <Sparkles className="w-4 h-4 text-botanical-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Recording a rest day marks this slot as intentional dormancy. Your weekly flexible
                completion score is preserved, and your plant will never wither.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-stone-50 text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <HeartHandshake className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Recording...' : 'Record Rest with Care'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

