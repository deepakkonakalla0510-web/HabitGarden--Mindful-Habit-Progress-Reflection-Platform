import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import { CompassionateInsights } from './CompassionateInsights';
import { getWeeklyPatterns } from '../services/api';
import { Calendar, Compass, RefreshCw, BarChart2, Radio, Sparkles } from 'lucide-react';

export const WeeklyRhythmChart = ({ habits = [] }) => {
  const [selectedHabitId, setSelectedHabitId] = useState('');
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'radar'
  const [patternData, setPatternData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatterns = async () => {
    setLoading(true);
    try {
      const res = await getWeeklyPatterns(selectedHabitId);
      if (res.success) {
        setPatternData(res.patterns || []);
        setInsights(res.insights || []);
      }
    } catch (err) {
      console.error('Failed to load weekly rhythm data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatterns();
  }, [selectedHabitId]);

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-botanical-lg border border-oatmeal-300 text-xs text-stone-800 space-y-1.5 min-w-[180px]">
          <div className="font-serif font-bold text-sm text-botanical-900 border-b border-oatmeal-200 pb-1">
            {data.dayName}
          </div>
          <div className="flex justify-between items-center text-botanical-700 font-medium">
            <span>Mindful Completion:</span>
            <span className="font-mono font-bold">{data.completionRate}%</span>
          </div>
          <div className="flex justify-between items-center text-stone-500">
            <span>Dormancy / Rest:</span>
            <span className="font-mono font-bold">{data.restRate}%</span>
          </div>
          <div className="flex justify-between items-center text-stone-400 text-[11px]">
            <span>Total Logs Recorded:</span>
            <span className="font-mono">{data.totalLogs}</span>
          </div>
          {data.primaryReason && data.primaryReason !== 'None' && (
            <div className="pt-1 mt-1 border-t border-oatmeal-200 text-stone-600">
              <span className="font-semibold text-stone-700">Top Rest Reason: </span>
              <span className="text-terracotta-600 font-medium">{data.primaryReason}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header and Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-oatmeal-300 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-botanical-100 text-botanical-700">
              <Compass className="w-4 h-4" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Day-of-Week Behavioral Rhythm
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Identify your natural energy flow across Monday through Sunday. Discover when your
            habits bloom effortlessly and when your body naturally seeks rest.
          </p>
        </div>

        {/* Habit Selector & View Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Select Habit Dropdown */}
          <select
            value={selectedHabitId}
            onChange={(e) => setSelectedHabitId(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-oatmeal-100 border border-oatmeal-300 text-stone-700 focus:outline-none focus:ring-2 focus:ring-botanical-500/40"
          >
            <option value="">All Living Habits (Garden-Wide)</option>
            {habits.map((h) => (
              <option key={h._id} value={h._id}>
                {h.title}
              </option>
            ))}
          </select>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-oatmeal-200/80 p-1 rounded-xl border border-oatmeal-300">
            <button
              onClick={() => setChartType('bar')}
              title="Bar Chart View"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                chartType === 'bar'
                  ? 'bg-white text-botanical-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Bar Flow</span>
            </button>
            <button
              onClick={() => setChartType('radar')}
              title="Radar Canopy View"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                chartType === 'radar'
                  ? 'bg-white text-botanical-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Radar Canopy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="garden-card p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Completion & Rest Probability by Weekday
            </h3>
            <p className="text-xs text-stone-500">
              Monday through Sunday breakdown based on verified check-in logs
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-botanical-600" />
              <span className="text-stone-600 font-medium">Completed (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#D1C9BC]" />
              <span className="text-stone-600 font-medium">Conscious Rest (%)</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-72 flex items-center justify-center text-stone-400 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            Reading garden rhythms...
          </div>
        ) : patternData.length > 0 ? (
          <div className="h-80 w-full">
            {chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patternData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                  <XAxis
                    dataKey="shortDay"
                    tickLine={false}
                    axisLine={{ stroke: '#EFE8DC' }}
                    tick={{ fill: '#78716C', fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={{ stroke: '#EFE8DC' }}
                    tick={{ fill: '#78716C', fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="completionRate"
                    name="Completed"
                    fill="#2D5A27"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                  />
                  <Bar
                    dataKey="restRate"
                    name="Rest Day"
                    fill="#D1C9BC"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="75%" data={patternData}>
                  <PolarGrid stroke="#EFE8DC" />
                  <PolarAngleAxis
                    dataKey="shortDay"
                    tick={{ fill: '#44403C', fontSize: 12, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#EFE8DC" />
                  <Radar
                    name="Completed (%)"
                    dataKey="completionRate"
                    stroke="#2D5A27"
                    fill="#2D5A27"
                    fillOpacity={0.45}
                  />
                  <Radar
                    name="Rest (%)"
                    dataKey="restRate"
                    stroke="#8C7D6B"
                    fill="#D1C9BC"
                    fillOpacity={0.35}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-stone-400 text-sm">
            No rhythm logs recorded yet. Water a habit or log a gentle rest day to begin.
          </div>
        )}
      </div>

      {/* Day by Day Qualitative Reason Tags Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {patternData.map((d) => (
          <div
            key={d.dayOfWeek}
            className="p-3.5 rounded-2xl bg-white border border-oatmeal-300 text-center flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                {d.dayName}
              </div>
              <div className="font-mono text-2xl font-bold text-botanical-800">
                {d.completionRate}%
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-oatmeal-200 text-[11px]">
              <span className="text-stone-400 block mb-0.5">Primary rhythm:</span>
              <span
                className={`font-semibold ${
                  d.primaryReason && d.primaryReason !== 'None'
                    ? 'text-terracotta-600'
                    : 'text-stone-600'
                }`}
              >
                {d.primaryReason || 'Smooth flow'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Compassionate Insights Component */}
      <CompassionateInsights insights={insights} />
    </div>
  );
};

