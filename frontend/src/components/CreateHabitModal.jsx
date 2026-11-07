import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sprout, Sparkles, Check } from 'lucide-react';
import { PlantIllustration } from './PlantIllustration';

const CATEGORIES = ['Mindfulness', 'Physical Health', 'Deep Work', 'Creativity', 'Rest'];

const COLOR_OPTIONS = [
  { name: 'Deep Forest', hex: '#2D5A27' },
  { name: 'Sage Leaf', hex: '#608056' },
  { name: 'Mountain Stream', hex: '#3B6E8C' },
  { name: 'Terracotta Earth', hex: '#D97757' },
  { name: 'Twilight Lavender', hex: '#83677B' },
  { name: 'Warm Ochre', hex: '#C67A32' },
];

export const CreateHabitModal = ({ isOpen, onClose, onCreateHabit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mindfulness');
  const [targetDays, setTargetDays] = useState(4);
  const [color, setColor] = useState('#2D5A27');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim().length < 3) {
      setError('Please provide a habit title with at least 3 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onCreateHabit({
        title: title.trim(),
        category,
        flexibleTarget: {
          targetDays: Number(targetDays),
          frequency: 'weekly',
        },
        color,
      });
      setTitle('');
      setCategory('Mindfulness');
      setTargetDays(4);
      onClose();
    } catch (err) {
      setError(err.message || 'Could not plant habit. Please try again.');
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

        {/* Modal Window */}
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
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-botanical-700 flex items-center justify-center text-oatmeal-100 shadow-sm">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-botanical-700">
                Action 4: New Botanical Seed
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Plant a Mindful Habit
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 mb-5 leading-relaxed">
            Choose a multi-day weekly target that feels spacious and sustainable. No rigid daily
            chains—your habit thrives on flexible rhythm.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Habit Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Habit Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Morning Mindful Walk, Deep Architecture Reading..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-oatmeal-300 text-stone-800 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-botanical-500/40"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                      category === cat
                        ? 'bg-botanical-700 text-white border-botanical-700 shadow-sm'
                        : 'bg-white hover:bg-oatmeal-100 text-stone-700 border-oatmeal-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Flexible Multi-Day Weekly Target */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Flexible Weekly Target
                </label>
                <span className="font-mono text-sm font-bold text-botanical-800 bg-botanical-100 px-2 py-0.5 rounded-md">
                  {targetDays} days / week
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className="w-full h-2 bg-oatmeal-300 rounded-lg appearance-none cursor-pointer accent-botanical-700"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>1 gentle day</span>
                <span>4 balanced days</span>
                <span>7 daily focus</span>
              </div>
            </div>

            {/* Color Accent Picker */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Botanical Color Accent
              </label>
              <div className="flex items-center gap-3">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                      color === c.hex ? 'scale-110 ring-2 ring-stone-800 ring-offset-2' : ''
                    }`}
                    title={c.name}
                  >
                    {color === c.hex && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Seed Preview Banner */}
            <div className="p-3.5 rounded-2xl bg-white border border-oatmeal-200 flex items-center gap-3">
              <PlantIllustration stage="Seed" color={color} size={44} />
              <div className="text-xs text-stone-600">
                <span className="font-semibold text-stone-800 block">Initial Stage: Seed</span>
                Will bloom into Sprout after 3 completions, Bud at 8, Bloom at 15, and a Lush Tree at 25.
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-botanical-700 hover:bg-botanical-800 text-white text-xs sm:text-sm font-semibold shadow-botanical transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Sprout className="w-4 h-4" />
                <span>{isSubmitting ? 'Planting Seed...' : 'Plant in Garden'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

