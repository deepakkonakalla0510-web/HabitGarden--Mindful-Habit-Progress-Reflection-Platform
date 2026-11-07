import React from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Sparkles,
  HeartHandshake,
  Compass,
  ShieldCheck,
  Sprout,
  Lightbulb,
} from 'lucide-react';

const ICON_MAP = {
  Sun,
  Moon,
  Sparkles,
  HeartHandshake,
  Compass,
  ShieldCheck,
  Sprout,
};

export const CompassionateInsights = ({ insights = [] }) => {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
          <Lightbulb className="w-4 h-4 text-amber-700" />
        </div>
        <h3 className="font-serif text-xl font-bold text-stone-900">
          Compassionate Rhythm Insights
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => {
          const IconComponent = ICON_MAP[insight.icon] || Sparkles;
          const isAdjustment = insight.type === 'gentle-adjustment';
          const isStrength = insight.type === 'strength';

          return (
            <motion.div
              key={insight.id || idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`p-5 rounded-3xl border flex flex-col justify-between shadow-sm transition-all ${
                isAdjustment
                  ? 'bg-[#FAF6EE] border-[#E8DEC8]'
                  : isStrength
                  ? 'bg-[#F2F7F0] border-[#D3E4CF]'
                  : 'bg-white border-oatmeal-300'
              }`}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isAdjustment
                        ? 'bg-[#EADEBE] text-amber-900'
                        : isStrength
                        ? 'bg-botanical-200 text-botanical-800'
                        : 'bg-oatmeal-200 text-stone-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </span>
                  <h4 className="font-serif font-bold text-stone-900 text-base leading-snug">
                    {insight.title}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {insight.message}
                </p>
              </div>

              {insight.actionableTip && (
                <div className="mt-4 pt-3 border-t border-black/5 flex items-start gap-2 text-xs text-stone-600 bg-black/[0.02] p-2.5 rounded-xl">
                  <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px] shrink-0">
                    Gentle Suggestion:
                  </span>
                  <span className="leading-snug">{insight.actionableTip}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

