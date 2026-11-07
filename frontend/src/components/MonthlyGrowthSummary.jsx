import React, { useEffect, useState } from 'react';
import { getGardenSummary } from '../services/api';
import { PlantIllustration } from './PlantIllustration';
import {
  Heart,
  Moon,
  Sparkles,
  Award,
  Layers,
  PieChart as PieIcon,
  RefreshCw,
  Trees,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const CATEGORY_COLORS = {
  Mindfulness: '#2D5A27',
  'Physical Health': '#608056',
  'Deep Work': '#3B6E8C',
  Creativity: '#D97757',
  Rest: '#83677B',
};

export const MonthlyGrowthSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await getGardenSummary();
      if (res.success) {
        setSummary(res.summary);
      }
    } catch (err) {
      console.error('Failed to load garden summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-stone-500 text-sm">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        Summoning monthly growth summary...
      </div>
    );
  }

  if (!summary) return null;

  const {
    activeHabitCount = 0,
    totalMindfulMoments = 0,
    totalRestfulPauses = 0,
    harmonyIndex = 100,
    canopyDistribution = {},
    categoryStats = [],
    topReasonTags = [],
  } = summary;

  const pieData = categoryStats.map((c) => ({
    name: c.category,
    value: c.completions,
    color: CATEGORY_COLORS[c.category] || '#608056',
  }));

  return (
    <div className="space-y-8">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="garden-card p-5 bg-white border border-oatmeal-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Mindful Moments
            </span>
            <span className="p-2 rounded-xl bg-botanical-100 text-botanical-700">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono text-3xl font-extrabold text-botanical-900">
            {totalMindfulMoments}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Total verified habits watered across your garden
          </p>
        </div>

        {/* Metric 2 */}
        <div className="garden-card p-5 bg-white border border-oatmeal-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Restful Pauses
            </span>
            <span className="p-2 rounded-xl bg-[#EFE8DC] text-stone-700">
              <Moon className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono text-3xl font-extrabold text-stone-800">
            {totalRestfulPauses}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Gentle rest days honored without breaking stride
          </p>
        </div>

        {/* Metric 3 */}
        <div className="garden-card p-5 bg-white border border-oatmeal-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Garden Harmony Index
            </span>
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Heart className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono text-3xl font-extrabold text-botanical-800">
            {harmonyIndex}%
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Balanced ratio of conscious action & restorative dormancy
          </p>
        </div>

        {/* Metric 4 */}
        <div className="garden-card p-5 bg-white border border-oatmeal-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Living Plants
            </span>
            <span className="p-2 rounded-xl bg-botanical-100 text-botanical-700">
              <Trees className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono text-3xl font-extrabold text-stone-900">
            {activeHabitCount}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Active habits flourishing in your canopy
          </p>
        </div>
      </div>

      {/* Canopy Evolution Distribution */}
      <div className="garden-card p-6 bg-white border border-oatmeal-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Botanical Canopy Evolution
            </h3>
            <p className="text-xs text-stone-500">
              Habits evolve through cumulative milestones (Seed &rarr; Sprout &rarr; Bud &rarr; Bloom &rarr; Lush Tree)
            </p>
          </div>
          <span className="text-xs font-semibold text-botanical-700 bg-botanical-50 px-3 py-1 rounded-full border border-botanical-200">
            No Plant Ever Dies Here
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { stage: 'Seed', count: canopyDistribution['Seed'] || 0, desc: '0-2 check-ins' },
            { stage: 'Sprout', count: canopyDistribution['Sprout'] || 0, desc: '3-7 check-ins' },
            { stage: 'Bud', count: canopyDistribution['Bud'] || 0, desc: '8-14 check-ins' },
            { stage: 'Bloom', count: canopyDistribution['Bloom'] || 0, desc: '15-24 check-ins' },
            { stage: 'Lush Tree', count: canopyDistribution['Lush Tree'] || 0, desc: '25+ check-ins' },
          ].map((item) => (
            <div
              key={item.stage}
              className="p-4 rounded-2xl bg-oatmeal-100/70 border border-oatmeal-200 flex flex-col items-center text-center transition-all hover:bg-oatmeal-200/50"
            >
              <PlantIllustration stage={item.stage} size={54} />
              <div className="font-serif font-bold text-sm text-stone-800 mt-2">
                {item.stage}
              </div>
              <div className="font-mono text-xl font-extrabold text-botanical-800 mt-0.5">
                {item.count}
              </div>
              <span className="text-[10px] text-stone-500 mt-1">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories & Top Rest Reasons Dual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Habit Category Distribution */}
        <div className="garden-card p-6 bg-white border border-oatmeal-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PieIcon className="w-4 h-4 text-botanical-700" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Habit Focus by Category
              </h3>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Where your mindful energy has been poured this month
            </p>
          </div>

          {pieData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={45}
                      outerRadius={68}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 space-y-2 w-full text-xs">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-stone-700 font-medium">{entry.name}</span>
                    </div>
                    <span className="font-mono font-bold text-stone-800">
                      {entry.value} check-ins
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-stone-400">
              No category logs recorded yet.
            </div>
          )}
        </div>

        {/* Reasons That Nourished Rest */}
        <div className="garden-card p-6 bg-white border border-oatmeal-300">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-4 h-4 text-stone-600" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Reasons That Nourished Rest
            </h3>
          </div>
          <p className="text-xs text-stone-500 mb-4">
            Honoring your body and mind without guilt or shame
          </p>

          {topReasonTags.length > 0 ? (
            <div className="space-y-3">
              {topReasonTags.map((r) => (
                <div
                  key={r.tag}
                  className="p-3 rounded-xl bg-oatmeal-100 border border-oatmeal-200 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-stone-700">{r.tag}</span>
                  <span className="font-mono font-bold text-stone-800 bg-white px-2 py-0.5 rounded-md border border-oatmeal-300">
                    {r.count} {r.count === 1 ? 'rest day' : 'rest days'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-stone-400">
              No rest logs recorded yet. Remember it is always healthy to rest!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

