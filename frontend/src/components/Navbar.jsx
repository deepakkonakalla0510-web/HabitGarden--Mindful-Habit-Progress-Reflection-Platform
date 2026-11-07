import React from 'react';
import { Sprout, BarChart3, Plus, Sparkles, Calendar, BookOpen, Layers } from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  onSeedData,
  isSeeding,
  habitCount = 0,
}) => {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-oatmeal-100/90 backdrop-blur-md border-b border-oatmeal-300 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Student Attribution Bar */}
        <div className="py-1.5 border-b border-oatmeal-200/70 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-botanical-600 animate-pulse"></span>
              Non-Shaming Mindful System
            </span>
            <span className="hidden sm:inline text-stone-400">•</span>
            <span className="hidden sm:inline text-stone-600">Zero streak penalties</span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-stone-500">Architect:</span>
            <span className="font-semibold text-stone-800 bg-oatmeal-200/90 px-2.5 py-0.5 rounded text-[11px] border border-oatmeal-300">
              DEEPAK KONAKALLA
            </span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-botanical-700 flex items-center justify-center text-oatmeal-100 shadow-sm shadow-botanical-700/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-botanical-900 tracking-tight">
                  HabitGarden
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-terracotta-100 text-terracotta-700 rounded-md">
                  Mindful
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Nurture progress through natural rhythm, not punishment
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-oatmeal-200/70 p-1 rounded-xl border border-oatmeal-300/80">
            <button
              onClick={() => setActiveTab('garden')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'garden'
                  ? 'bg-white text-botanical-800 shadow-sm shadow-stone-200/50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <Layers className="w-4 h-4 text-botanical-600" />
              <span>Garden Canopy</span>
              {habitCount > 0 && (
                <span className="hidden sm:inline-flex px-1.5 py-0.2 text-[10px] bg-botanical-100 text-botanical-700 rounded-full font-mono font-bold">
                  {habitCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('rhythm')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'rhythm'
                  ? 'bg-white text-botanical-800 shadow-sm shadow-stone-200/50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-terracotta-500" />
              <span>Weekly Rhythm</span>
            </button>

            <button
              onClick={() => setActiveTab('growth')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'growth'
                  ? 'bg-white text-botanical-800 shadow-sm shadow-stone-200/50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-moss-dark" />
              <span>Garden Insights</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Demo Seeder */}
            <button
              onClick={onSeedData}
              disabled={isSeeding}
              title="Preload 5 realistic habits and 28 days of mindful reflections"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 bg-white/70 hover:bg-white border border-oatmeal-300 transition-all shadow-sm disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-500 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Nurturing...' : 'Seed Demo Data'}</span>
            </button>

            {/* Date Display */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/60 border border-oatmeal-300 text-xs font-medium text-stone-600">
              <Calendar className="w-3.5 h-3.5 text-botanical-600" />
              <span>{todayFormatted}</span>
            </div>

            {/* Plant Habit CTA */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-botanical-700 hover:bg-botanical-800 text-oatmeal-50 text-xs sm:text-sm font-semibold shadow-botanical hover:shadow-botanical-lg transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Plant Habit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

