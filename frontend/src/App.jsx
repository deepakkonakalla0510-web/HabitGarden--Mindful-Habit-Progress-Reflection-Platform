import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { GardenCanvas } from './components/GardenCanvas';
import { WeeklyRhythmChart } from './components/WeeklyRhythmChart';
import { MonthlyGrowthSummary } from './components/MonthlyGrowthSummary';
import { ReflectionModal } from './components/ReflectionModal';
import { CreateHabitModal } from './components/CreateHabitModal';
import { EditHabitModal } from './components/EditHabitModal';
import { Toast } from './components/Toast';
import {
  getHabits,
  createHabit,
  updateHabit,
  archiveHabit,
  checkinHabit,
  logReflection,
  seedDemoGarden,
} from './services/api';
import { sound } from './utils/audio';
import { Sprout, Heart, Shield, RefreshCw } from 'lucide-react';

export function App() {
  const [habits, setHabits] = useState([]);
  const [currentWeekRange, setCurrentWeekRange] = useState(null);
  const [activeTab, setActiveTab] = useState('garden');
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [reflectionContext, setReflectionContext] = useState({
    habit: null,
    date: '',
    existingStatus: null,
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Get Today's local YYYY-MM-DD
  const todayStr = React.useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  // Fetch Habits & Weekly Progress
  const loadHabits = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await getHabits();
      if (res.success) {
        setHabits(res.data || []);
        setCurrentWeekRange(res.currentWeek || null);
      }
    } catch (err) {
      console.error('Failed to load habits:', err);
      addToast({
        type: 'error',
        title: 'Database Notice',
        message: err.message || 'Connecting to database. Please check MONGODB_URI in Render environment variables.',
      });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  // Action 1: Water Habit (Check-in as Completed with Optimistic UI)
  const handleWaterHabit = async (habitId, date = todayStr) => {
    // Play gentle organic water droplet audio simulation
    sound.playWaterDrop();

    // 1. Snapshot previous state for rollback
    const previousHabits = [...habits];

    // 2. Optimistic UI update
    setHabits((prev) =>
      prev.map((h) => {
        if (h._id !== habitId) return h;
        const currentCompleted = h.thisWeek?.completedCount || 0;
        const targetDays = h.flexibleTarget?.targetDays || 4;
        const newCompleted = currentCompleted + 1;

        return {
          ...h,
          thisWeek: {
            ...h.thisWeek,
            completedCount: newCompleted,
            progressPercent: Math.min(100, Math.round((newCompleted / targetDays) * 100)),
            isTargetMet: newCompleted >= targetDays,
            todayLog: { status: 'completed', date },
          },
        };
      })
    );

    // 3. API Call
    try {
      const res = await checkinHabit(habitId, date, 'completed');
      if (res.success) {
        if (res.stageChanged) {
          // Play bloom chord & celebrate stage blooming with botanical confetti!
          sound.playBloomChord();
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#2D5A27', '#608056', '#D97757', '#FAF7F2'],
          });
          addToast({
            type: 'evolve',
            title: 'Canopy Evolution!',
            message: res.message,
          });
        } else {
          addToast({
            type: 'water',
            title: 'Garden Hydrated',
            message: res.message || 'Mindful check-in recorded with care.',
          });
        }
        // Sync fresh backend calculations
        loadHabits(true);
      }
    } catch (err) {
      // 4. UI Fallback: Roll back optimistic update if network fails
      console.error('Water checkin failed, rolling back:', err);
      setHabits(previousHabits);
      addToast({
        type: 'error',
        title: 'Notice',
        message: 'Could not save progress. Reconnecting to garden...',
      });
    }
  };

  // Action 2: Log Gentle Reflection (Rest Day)
  const handleOpenReflectionModal = (habit, date, existingStatus) => {
    setReflectionContext({
      habit,
      date: date || todayStr,
      existingStatus,
    });
    setIsReflectionOpen(true);
  };

  const handleSubmitReflection = async ({ habitId, date, reasonTag, reflectionNote, status }) => {
    try {
      sound.playRestChime();
      const res = await logReflection(habitId, {
        date,
        reasonTag,
        reflectionNote,
        status,
      });

      if (res.success) {
        addToast({
          type: 'rest',
          title: 'Dormancy Recorded',
          message: 'Rest recorded. Progress preserved.',
        });
        loadHabits(true);
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error',
        message: err.message || 'Could not log reflection.',
      });
    }
  };

  // Action 4: Create Habit with Flexible Targets
  const handleCreateHabit = async (habitData) => {
    const res = await createHabit(habitData);
    if (res.success) {
      addToast({
        type: 'water',
        title: 'Seedling Planted',
        message: `"${res.data?.title}" has taken root in your garden.`,
      });
      loadHabits(true);
    }
  };

  // Edit Habit Target & Settings
  const handleOpenEdit = (habit) => {
    setEditingHabit(habit);
    setIsEditOpen(true);
  };

  const handleUpdateHabit = async (id, updatedData) => {
    const res = await updateHabit(id, updatedData);
    if (res.success) {
      addToast({
        type: 'water',
        title: 'Settings Updated',
        message: 'Habit rhythm gently updated.',
      });
      loadHabits(true);
    }
  };

  // Gracefully Archive Habit
  const handleArchiveHabit = async (id) => {
    if (window.confirm('Gracefully archive this habit? Your past reflection logs will remain safely preserved.')) {
      try {
        const res = await archiveHabit(id);
        if (res.success) {
          addToast({
            type: 'rest',
            title: 'Habit Archived',
            message: res.message || 'Habit resting peacefully.',
          });
          loadHabits(true);
        }
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Error',
          message: err.message || 'Could not archive habit.',
        });
      }
    }
  };

  // Preload Demo Data Seed
  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const res = await seedDemoGarden();
      if (res.success) {
        addToast({
          type: 'evolve',
          title: 'Garden Flourished',
          message: '5 diverse habits and 28 days of mindful reflections loaded!',
        });
        await loadHabits(false);
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Seed Error',
        message: err.message || 'Failed to seed sample garden.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-oatmeal-100 flex flex-col font-sans selection:bg-botanical-200">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Main Navbar & Student Attribution */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onSeedData={handleSeedData}
        isSeeding={isSeeding}
        habitCount={habits.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-stone-500">
            <RefreshCw className="w-8 h-8 text-botanical-600 animate-spin" />
            <p className="font-serif text-lg text-stone-700">Tending to your garden...</p>
            <span className="text-xs text-stone-400">Loading mindful habits & canopy rhythm</span>
          </div>
        ) : (
          <>
            {activeTab === 'garden' && (
              <GardenCanvas
                habits={habits}
                todayStr={todayStr}
                currentWeekRange={currentWeekRange}
                onWater={handleWaterHabit}
                onOpenReflection={handleOpenReflectionModal}
                onEdit={handleOpenEdit}
                onArchive={handleArchiveHabit}
                onOpenCreateModal={() => setIsCreateOpen(true)}
              />
            )}

            {activeTab === 'rhythm' && <WeeklyRhythmChart habits={habits} />}

            {activeTab === 'growth' && <MonthlyGrowthSummary />}
          </>
        )}
      </main>

      {/* Footer & Ethos Statement */}
      <footer className="mt-auto bg-oatmeal-200/80 border-t border-oatmeal-300 py-8 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-botanical-700 flex items-center justify-center text-white">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-stone-800 text-sm">HabitGarden</span>
              <p className="text-[11px] text-stone-500">
                Mindful Habit Progress & Reflection Platform • Built with Non-Shaming UX
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-stone-500">Developed by:</span>
            <span className="font-semibold text-stone-800 bg-white px-2.5 py-1 rounded-md border border-oatmeal-300">
              DEEPAK KONAKALLA
            </span>
          </div>

          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-botanical-600" />
            <span>Zero punitive resets. Missed days become restful dormancy.</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateHabitModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateHabit={handleCreateHabit}
      />

      <EditHabitModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        habit={editingHabit}
        onUpdateHabit={handleUpdateHabit}
      />

      <ReflectionModal
        isOpen={isReflectionOpen}
        onClose={() => setIsReflectionOpen(false)}
        habit={reflectionContext.habit}
        targetDate={reflectionContext.date}
        existingStatus={reflectionContext.existingStatus}
        onSubmitReflection={handleSubmitReflection}
      />
    </div>
  );
}

export default App;

