import Habit from '../models/Habit.js';
import HabitLog from '../models/HabitLog.js';
import { calculatePlantStage, getStageProgress } from '../utils/plantEvolution.js';

// Helper to get formatted YYYY-MM-DD string for a Date
const formatDateString = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get current week's Monday and Sunday dates (YYYY-MM-DD)
const getCurrentWeekRange = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
  // Distance to Monday (if Sunday, go back 6 days)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    startOfWeek: formatDateString(monday),
    endOfWeek: formatDateString(sunday),
    today: formatDateString(now),
  };
};

/**
 * @desc Get all active habits with current week progress and plant evolution metrics
 * @route GET /api/habits
 */
export const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ isArchived: false }).sort({ createdAt: -1 });
    const { startOfWeek, endOfWeek, today } = getCurrentWeekRange();

    // Fetch this week's logs for all active habits
    const habitIds = habits.map((h) => h._id);
    const thisWeekLogs = await HabitLog.find({
      habitId: { $in: habitIds },
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    // Fetch all-time completion count for stage verification
    const completionStats = await HabitLog.aggregate([
      { $match: { habitId: { $in: habitIds }, status: 'completed' } },
      { $group: { _id: '$habitId', totalCompleted: { $sum: 1 } } },
    ]);
    const completionMap = new Map(
      completionStats.map((item) => [String(item._id), item.totalCompleted])
    );

    // Fetch total rest days
    const restStats = await HabitLog.aggregate([
      { $match: { habitId: { $in: habitIds }, status: 'rest_day' } },
      { $group: { _id: '$habitId', totalRestDays: { $sum: 1 } } },
    ]);
    const restMap = new Map(restStats.map((item) => [String(item._id), item.totalRestDays]));

    // Build enriched habits array
    const enrichedHabits = await Promise.all(
      habits.map(async (habit) => {
        const hId = String(habit._id);
        const logsForHabit = thisWeekLogs.filter((l) => String(l.habitId) === hId);

        const weekCompleted = logsForHabit.filter((l) => l.status === 'completed').length;
        const weekRest = logsForHabit.filter((l) => l.status === 'rest_day').length;
        const todayLog = logsForHabit.find((l) => l.date === today) || null;

        const totalCompleted = completionMap.get(hId) || 0;
        const totalRestDays = restMap.get(hId) || 0;

        // Verify and update plantStage if changed
        const evaluatedStage = calculatePlantStage(totalCompleted);
        if (habit.plantStage !== evaluatedStage) {
          habit.plantStage = evaluatedStage;
          await habit.save();
        }

        const stageMetrics = getStageProgress(totalCompleted);
        const targetDays = habit.flexibleTarget?.targetDays || 4;
        const progressPercent = Math.min(100, Math.round((weekCompleted / targetDays) * 100));

        return {
          ...habit.toObject(),
          thisWeek: {
            startOfWeek,
            endOfWeek,
            completedCount: weekCompleted,
            restCount: weekRest,
            targetDays,
            progressPercent,
            isTargetMet: weekCompleted >= targetDays,
            todayLog,
            logs: logsForHabit,
          },
          lifetime: {
            totalCompleted,
            totalRestDays,
            stageMetrics,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedHabits.length,
      currentWeek: { startOfWeek, endOfWeek, today },
      data: enrichedHabits,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single habit details by ID
 * @route GET /api/habits/:id
 */
export const getHabitById = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.isArchived) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const { startOfWeek, endOfWeek, today } = getCurrentWeekRange();
    const recentLogs = await HabitLog.find({ habitId: habit._id }).sort({ date: -1 }).limit(30);

    const totalCompleted = await HabitLog.countDocuments({
      habitId: habit._id,
      status: 'completed',
    });
    const totalRestDays = await HabitLog.countDocuments({
      habitId: habit._id,
      status: 'rest_day',
    });

    const evaluatedStage = calculatePlantStage(totalCompleted);
    if (habit.plantStage !== evaluatedStage) {
      habit.plantStage = evaluatedStage;
      await habit.save();
    }

    const stageMetrics = getStageProgress(totalCompleted);

    res.status(200).json({
      success: true,
      data: {
        ...habit.toObject(),
        recentLogs,
        lifetime: {
          totalCompleted,
          totalRestDays,
          stageMetrics,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create a new habit with flexible targets
 * @route POST /api/habits
 */
export const createHabit = async (req, res, next) => {
  try {
    const { title, category, flexibleTarget, color } = req.body;

    const newHabit = await Habit.create({
      title,
      category: category || 'Mindfulness',
      flexibleTarget: {
        targetDays: flexibleTarget?.targetDays ?? 4,
        frequency: 'weekly',
      },
      plantStage: 'Seed',
      color: color || '#2D5A27',
      isArchived: false,
    });

    const stageMetrics = getStageProgress(0);

    res.status(201).json({
      success: true,
      message: 'New habit seed planted in your garden!',
      data: {
        ...newHabit.toObject(),
        thisWeek: {
          completedCount: 0,
          restCount: 0,
          targetDays: newHabit.flexibleTarget.targetDays,
          progressPercent: 0,
          isTargetMet: false,
          todayLog: null,
          logs: [],
        },
        lifetime: {
          totalCompleted: 0,
          totalRestDays: 0,
          stageMetrics,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update habit settings (title, target, color, category)
 * @route PUT /api/habits/:id
 */
export const updateHabit = async (req, res, next) => {
  try {
    const { title, category, flexibleTarget, color } = req.body;
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.isArchived) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    if (title !== undefined) habit.title = title;
    if (category !== undefined) habit.category = category;
    if (color !== undefined) habit.color = color;
    if (flexibleTarget?.targetDays !== undefined) {
      habit.flexibleTarget.targetDays = flexibleTarget.targetDays;
    }

    const updated = await habit.save();

    res.status(200).json({
      success: true,
      message: 'Habit settings gently updated',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Gracefully archive a habit (soft delete)
 * @route DELETE /api/habits/:id
 */
export const archiveHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.isArchived) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    habit.isArchived = true;
    await habit.save();

    res.status(200).json({
      success: true,
      message: 'Habit archived with care. Your past reflections remain preserved.',
    });
  } catch (error) {
    next(error);
  }
};

