import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Check,
  Moon,
  Sparkles,
  MoreVertical,
  Edit2,
  Archive,
  CalendarDays,
  Flame,
  Info,
} from 'lucide-react';
import { PlantIllustration } from './PlantIllustration';

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const HabitCard = ({
  habit,
  todayStr,
  currentWeekRange,
  onWater,
  onOpenReflection,
  onEdit,
  onArchive,
}) => {
  const [isWateringAnim, setIsWateringAnim] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Extract weekly progress
  const targetDays = habit.flexibleTarget?.targetDays || 4;
  const completedThisWeek = habit.thisWeek?.completedCount || 0;
  const restThisWeek = habit.thisWeek?.restCount || 0;
  const progressPercent = Math.min(100, Math.round((completedThisWeek / targetDays) * 100));
  const isTargetMet = completedThisWeek >= targetDays;

  // Today's log status
  const todayLog = habit.thisWeek?.todayLog;
  const isCompletedToday = todayLog?.status === 'completed';
  const isRestToday = todayLog?.status === 'rest_day';

  // Plant stage & evolution details
  const plantStage = habit.plantStage || 'Seed';
  const stageMetrics = habit.lifetime?.stageMetrics;
  const habitColor = habit.color || '#2D5A27';

  // Build the 7-day strip (Monday to Sunday)
  const weekDays = React.useMemo(() => {
    if (!currentWeekRange?.startOfWeek) return [];
    const [y, m, d] = currentWeekRange.startOfWeek.split('-').map(Number);
    const monday = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setUTCDate(monday.getUTCDate() + i);
      const dateStr = current.toISOString().slice(0, 10);
      const log = habit.thisWeek?.logs?.find((l) => l.date === dateStr);

      days.push({
        dayName: DAYS_SHORT[i],
        dateStr,
        isToday: dateStr === todayStr,
        status: log?.status || null,
        reasonTag: log?.reasonTag || null,
        note: log?.reflectionNote || '',
      });
    }
    return days;
  }, [currentWeekRange, habit.thisWeek?.logs, todayStr]);

  const handleWaterClick = async () => {
    setIsWateringAnim(true);
    await onWater(habit._id, todayStr);
    setTimeout(() => setIsWateringAnim(false), 900);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="garden-card relative p-6 bg-white flex flex-col justify-between overflow-hidden group"
    >
      {/* Top Accent Strip with habit color */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 opacity-80"
        style={{ backgroundColor: habitColor }}
      />

      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{
                backgroundColor: `${habitColor}15`,
                color: habitColor,
              }}
            >
              {habit.category}
            </span>

            {/* Plant Stage Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-botanical-100 text-botanical-800 text-xs font-medium">
              <Sparkles className="w-3 h-3 text-botanical-600" />
              <span>{plantStage}</span>
            </span>
          </div>

          {/* Quick Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Habit options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-7 w-40 bg-white rounded-xl shadow-botanical-lg border border-oatmeal-300 py-1.5 z-20"
                onClick={() => setShowMenu(false)}
              >
                <button
                  onClick={() => onEdit(habit)}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-stone-700 hover:bg-oatmeal-100 flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5 text-stone-500" />
                  Edit Target
                </button>
                <button
                  onClick={() => onArchive(habit._id)}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-stone-700 hover:bg-oatmeal-100 flex items-center gap-2"
                >
                  <Archive className="w-3.5 h-3.5 text-stone-500" />
                  Graceful Archive
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title & Plant Illustration */}
        <div className="flex items-center justify-between gap-4 my-2">
          <div className="flex-1">
            <h3 className="font-serif text-xl font-bold text-stone-900 leading-snug">
              {habit.title}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Goal: {targetDays} days / week • {habit.lifetime?.totalCompleted || 0} mindful moments
            </p>
          </div>

          <div className="relative shrink-0">
            <PlantIllustration
              stage={plantStage}
              color={habitColor}
              size={68}
              animateWater={isWateringAnim}
              isResting={isRestToday}
            />
          </div>
        </div>

        {/* Flexible Target Progress Bar */}
        <div className="mt-4 bg-oatmeal-100 rounded-xl p-3 border border-oatmeal-200">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-stone-700">Weekly Target Progress</span>
            <span className="font-mono font-bold text-stone-800">
              {completedThisWeek} / {targetDays} days
            </span>
          </div>

          <div className="w-full h-2.5 bg-oatmeal-300 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: isTargetMet ? '#4A7C43' : habitColor,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Gentle progress status text */}
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-500">
            {isTargetMet ? (
              <span className="text-botanical-700 font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-botanical-600" />
                Target fulfilled! Any extra watering is joyful bonus.
              </span>
            ) : (
              <span>
                {targetDays - completedThisWeek} more gentle check-ins to reach your week's intention
              </span>
            )}

            {restThisWeek > 0 && (
              <span className="text-stone-500 font-medium flex items-center gap-0.5">
                <Moon className="w-3 h-3 text-stone-400" />
                {restThisWeek} rest
              </span>
            )}
          </div>
        </div>

        {/* 7-Day Rhythm Mini-Strip (Mon-Sun) */}
        <div className="mt-4 pt-3 border-t border-oatmeal-200">
          <div className="text-[11px] font-medium text-stone-500 mb-2 flex items-center justify-between">
            <span>This Week's Canopy Rhythm</span>
            <span className="text-[10px] text-stone-400">Click a day to reflect</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDays.map((d) => {
              const isComp = d.status === 'completed';
              const isRest = d.status === 'rest_day';

              return (
                <button
                  key={d.dateStr}
                  type="button"
                  onClick={() => onOpenReflection(habit, d.dateStr, d.status)}
                  title={`${d.dayName} (${d.dateStr}): ${
                    isComp ? 'Completed' : isRest ? `Rest day (${d.reasonTag || 'Rest'})` : 'Dormant / Unrecorded'
                  }`}
                  className={`flex flex-col items-center py-1.5 px-0.5 rounded-lg transition-all ${
                    d.isToday ? 'bg-botanical-50 ring-1 ring-botanical-400' : 'hover:bg-oatmeal-100'
                  }`}
                >
                  <span className="text-[10px] text-stone-500 font-medium">{d.dayName}</span>

                  <div
                    className={`w-6 h-6 rounded-full mt-1 flex items-center justify-center transition-transform active:scale-90 ${
                      isComp
                        ? 'bg-botanical-700 text-white shadow-sm'
                        : isRest
                        ? 'bg-[#E5DFD5] text-stone-600 border border-[#D5CDC0]'
                        : 'border border-dashed border-stone-300 text-stone-400'
                    }`}
                  >
                    {isComp ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : isRest ? (
                      <Moon className="w-3 h-3 text-stone-600 fill-stone-600" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="mt-5 pt-3 border-t border-oatmeal-200 flex items-center gap-2">
        {/* Action 1: Water Habit Button */}
        <button
          onClick={handleWaterClick}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-[0.98] ${
            isCompletedToday
              ? 'bg-botanical-100 text-botanical-800 hover:bg-botanical-200/80 border border-botanical-300'
              : 'bg-botanical-700 text-white hover:bg-botanical-800 shadow-botanical'
          }`}
        >
          {isCompletedToday ? (
            <>
              <Check className="w-4 h-4 text-botanical-700" />
              <span>Watered Today</span>
            </>
          ) : (
            <>
              <Droplets className="w-4 h-4 text-botanical-200" />
              <span>Water Habit</span>
            </>
          )}
        </button>

        {/* Action 2: Log Rest / Gentle Reflection */}
        <button
          onClick={() => onOpenReflection(habit, todayStr, todayLog?.status)}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
            isRestToday
              ? 'bg-[#F2ECE1] text-stone-800 border-[#DDD4C5]'
              : 'bg-white hover:bg-oatmeal-100 text-stone-700 border-oatmeal-300'
          }`}
          title="Log mindful rest day with reason tag and custom reflection notes"
        >
          <Moon className="w-3.5 h-3.5 text-stone-500" />
          <span>{isRestToday ? 'Rest Logged' : 'Log Rest'}</span>
        </button>
      </div>
    </motion.div>
  );
};

