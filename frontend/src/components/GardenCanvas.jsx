import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HabitCard } from './HabitCard';
import { PlantIllustration } from './PlantIllustration';
import {
  Sun,
  CloudSun,
  CloudRain,
  Filter,
  Search,
  Sparkles,
  Sprout,
  Wind,
  LayoutGrid,
  Trees,
  Droplets,
  Moon,
} from 'lucide-react';

const CATEGORIES = ['All', 'Mindfulness', 'Physical Health', 'Deep Work', 'Creativity', 'Rest'];

export const GardenCanvas = ({
  habits,
  todayStr,
  currentWeekRange,
  onWater,
  onOpenReflection,
  onEdit,
  onArchive,
  onOpenCreateModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'terrarium'
  const [weather, setWeather] = useState('sunlight'); // 'sunlight', 'breeze', 'rain'

  // Filter habits
  const filteredHabits = habits.filter((habit) => {
    const matchesCategory =
      selectedCategory === 'All' || habit.category === selectedCategory;
    const matchesSearch = habit.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  // Count habits by stage
  const stageCounts = habits.reduce((acc, h) => {
    acc[h.plantStage] = (acc[h.plantStage] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Garden Canopy Ambient Header & Overview Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-botanical-800 via-botanical-900 to-botanical-dark text-oatmeal-100 shadow-botanical-lg overflow-hidden border border-botanical-700">
        {/* Background botanical leaves subtle SVG watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <svg width="340" height="340" viewBox="0 0 200 200" fill="currentColor">
            <path d="M100 0C100 55 55 100 0 100C55 100 100 145 100 200C100 145 145 100 200 100C145 100 100 55 100 0Z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-botanical-700/60 border border-botanical-600/50 text-xs font-medium text-botanical-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Living Botanical Canopy</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-oatmeal-50">
              Welcome to your flourishing garden.
            </h1>
            <p className="mt-2 text-sm sm:text-base text-botanical-100/90 leading-relaxed">
              Every habit is a living plant that grows with gentle, cumulative care. There are no
              harsh streak resets here—when life calls for rest, your plants simply enter peaceful
              dormancy.
            </p>
          </div>

          {/* Canopy Stage Micro-Distribution Bar */}
          <div className="bg-botanical-800/80 backdrop-blur-md rounded-2xl p-4 border border-botanical-700/80 flex flex-col gap-2 shrink-0 sm:min-w-[280px]">
            <div className="flex items-center justify-between text-xs text-botanical-200 font-medium">
              <span>Canopy Stages</span>
              <span className="font-mono">{habits.length} Living Plants</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              {['Seed', 'Sprout', 'Bud', 'Bloom', 'Lush Tree'].map((stage) => {
                const count = stageCounts[stage] || 0;
                return (
                  <div key={stage} className="flex flex-col items-center">
                    <span className="text-[11px] font-mono font-bold text-oatmeal-100">
                      {count}
                    </span>
                    <span className="text-[10px] text-botanical-300/80 truncate">{stage}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-botanical-700 text-oatmeal-50 shadow-sm'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-oatmeal-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle & Search */}
        <div className="flex items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-oatmeal-300 shadow-sm">
            <button
              onClick={() => setViewMode('cards')}
              title="Canopy Cards View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'cards'
                  ? 'bg-botanical-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('terrarium')}
              title="Botanical Terrarium View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'terrarium'
                  ? 'bg-botanical-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Trees className="w-3.5 h-3.5" />
              <span>Terrarium</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search garden..."
              className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm rounded-xl bg-white border border-oatmeal-300 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-botanical-500/40"
            />
          </div>
        </div>
      </div>

      {/* Terrarium Weather Bar (Only in Terrarium Mode) */}
      {viewMode === 'terrarium' && (
        <div className="flex items-center justify-between p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-oatmeal-300 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-stone-800">Garden Sanctuary Microclimate:</span>
            <span>Click any plant to water or reflect</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setWeather('sunlight')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs font-medium transition-all ${
                weather === 'sunlight' ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-oatmeal-100'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Warm Sun</span>
            </button>
            <button
              onClick={() => setWeather('rain')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs font-medium transition-all ${
                weather === 'rain' ? 'bg-blue-100 text-blue-900 font-bold' : 'hover:bg-oatmeal-100'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5 text-blue-500" />
              <span>Forest Dew</span>
            </button>
            <button
              onClick={() => setWeather('breeze')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs font-medium transition-all ${
                weather === 'breeze' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'hover:bg-oatmeal-100'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-emerald-600" />
              <span>Canopy Breeze</span>
            </button>
          </div>
        </div>
      )}

      {/* Habits View (Cards or Terrarium) */}
      {filteredHabits.length > 0 ? (
        viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                todayStr={todayStr}
                currentWeekRange={currentWeekRange}
                onWater={onWater}
                onOpenReflection={onOpenReflection}
                onEdit={onEdit}
                onArchive={onArchive}
              />
            ))}
          </div>
        ) : (
          /* Botanical Terrarium Canvas */
          <div
            className={`relative rounded-3xl p-8 border border-oatmeal-300 shadow-botanical-lg overflow-hidden transition-all duration-700 min-h-[460px] ${
              weather === 'rain'
                ? 'bg-gradient-to-b from-slate-100 via-[#E4ECE7] to-[#D5DFD8]'
                : weather === 'breeze'
                ? 'bg-gradient-to-b from-[#FAF7F0] via-[#EEF5EA] to-[#DFECE0]'
                : 'bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E8] to-[#F2E8D5]'
            }`}
          >
            {/* Ambient Sunlight Glow */}
            {weather === 'sunlight' && (
              <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
            )}

            {/* Plants Terrarium Grid */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {filteredHabits.map((habit) => {
                const isWateredToday = habit.thisWeek?.todayLog?.status === 'completed';
                const isRestToday = habit.thisWeek?.todayLog?.status === 'rest_day';

                return (
                  <motion.div
                    key={habit._id}
                    whileHover={{ scale: 1.04, y: -4 }}
                    className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-stone-200/80 shadow-sm flex flex-col items-center text-center justify-between group transition-all"
                  >
                    {/* Plant Illustration */}
                    <div className="my-2 cursor-pointer" onClick={() => onWater(habit._id, todayStr)}>
                      <PlantIllustration
                        stage={habit.plantStage}
                        color={habit.color || '#2D5A27'}
                        size={84}
                        isResting={isRestToday}
                      />
                    </div>

                    <div className="w-full">
                      <div className="font-serif font-bold text-sm text-stone-900 truncate">
                        {habit.title}
                      </div>
                      <div className="text-[11px] text-stone-500 font-medium">
                        {habit.plantStage} • {habit.thisWeek?.completedCount || 0}/{habit.flexibleTarget?.targetDays || 4} this wk
                      </div>

                      {/* Quick Interactive Actions */}
                      <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-center gap-1.5 w-full">
                        <button
                          onClick={() => onWater(habit._id, todayStr)}
                          title="Water Habit"
                          className={`p-2 rounded-xl text-xs flex items-center justify-center transition-all ${
                            isWateredToday
                              ? 'bg-botanical-100 text-botanical-800 border border-botanical-300'
                              : 'bg-botanical-700 text-white hover:bg-botanical-800 shadow-sm'
                          }`}
                        >
                          <Droplets className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenReflection(habit, todayStr, habit.thisWeek?.todayLog?.status)}
                          title="Log Gentle Reflection / Rest"
                          className={`p-2 rounded-xl text-xs flex items-center justify-center transition-all border ${
                            isRestToday
                              ? 'bg-[#EADECE] text-stone-800 border-[#D2C3B0]'
                              : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-300'
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="garden-card p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-3xl bg-botanical-100 flex items-center justify-center text-botanical-700 mb-4">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-800 mb-2">
            {searchQuery ? 'No habits match your search' : 'Your garden is waiting for its first seed'}
          </h3>
          <p className="text-sm text-stone-500 mb-6 leading-relaxed">
            {searchQuery
              ? 'Try adjusting your search terms or category filter to view habits.'
              : 'Plant a habit with flexible multi-day targets. Choose your pace, honor your rest, and watch your canopy bloom.'}
          </p>

          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-botanical-700 hover:bg-botanical-800 text-oatmeal-50 text-sm font-semibold shadow-botanical transition-all"
          >
            + Plant Your First Seed
          </button>
        </div>
      )}
    </div>
  );
};

