import Habit from '../models/Habit.js';
import HabitLog from '../models/HabitLog.js';
import { calculatePlantStage, getStageProgress } from '../utils/plantEvolution.js';

// Helper to compute dayOfWeek (0-6) from YYYY-MM-DD in UTC
const computeDayOfWeek = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return d.getUTCDay();
};

/**
 * @desc Water a habit / Check-in as completed (Action 1)
 * @route POST /api/habits/:id/checkin
 */
export const checkinHabit = async (req, res, next) => {
  try {
    const habitId = req.params.id;
    const { date, status = 'completed' } = req.body;

    const habit = await Habit.findById(habitId);
    if (!habit || habit.isArchived) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const dayOfWeek = computeDayOfWeek(date);

    // Upsert log for habitId + date
    const log = await HabitLog.findOneAndUpdate(
      { habitId, date },
      {
        status,
        dayOfWeek,
        reasonTag: status === 'completed' ? 'None' : (req.body.reasonTag || 'None'),
        reflectionNote: req.body.reflectionNote || '',
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // Recalculate total completed count
    const totalCompleted = await HabitLog.countDocuments({
      habitId,
      status: 'completed',
    });

    // Update habit plant stage if evolved
    const newStage = calculatePlantStage(totalCompleted);
    const stageChanged = habit.plantStage !== newStage;
    if (stageChanged) {
      habit.plantStage = newStage;
      await habit.save();
    }

    const stageMetrics = getStageProgress(totalCompleted);

    res.status(200).json({
      success: true,
      message: stageChanged
        ? `Watered! Your ${habit.title} has blossomed into a ${newStage}!`
        : `Watered! Your ${habit.title} drank deeply and thrives.`,
      stageChanged,
      newStage,
      log,
      stageMetrics,
      totalCompleted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Log gentle reflection / rest day (Action 2)
 * @route POST /api/habits/:id/reflect
 */
export const logReflection = async (req, res, next) => {
  try {
    const habitId = req.params.id;
    const {
      date,
      status = 'rest_day',
      reasonTag = 'Mental Health/Rest',
      reflectionNote = '',
    } = req.body;

    const habit = await Habit.findById(habitId);
    if (!habit || habit.isArchived) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const dayOfWeek = computeDayOfWeek(date);

    const log = await HabitLog.findOneAndUpdate(
      { habitId, date },
      {
        status,
        reasonTag,
        reflectionNote: reflectionNote.trim(),
        dayOfWeek,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // Recalculate total completed count to preserve stage metrics
    const totalCompleted = await HabitLog.countDocuments({
      habitId,
      status: 'completed',
    });
    const totalRestDays = await HabitLog.countDocuments({
      habitId,
      status: 'rest_day',
    });

    const stageMetrics = getStageProgress(totalCompleted);

    res.status(201).json({
      success: true,
      message: 'Rest recorded. Progress preserved.',
      encouragement:
        'Every garden rests through winter and night. Resting when you need it maintains true consistency.',
      log,
      totalCompleted,
      totalRestDays,
      stageMetrics,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Generic toggle/remove checkin for a date
 * @route POST /api/habits/:id/toggle
 */
export const toggleCheckin = async (req, res, next) => {
  try {
    const habitId = req.params.id;
    const { date } = req.body;

    const existing = await HabitLog.findOne({ habitId, date });

    if (existing && existing.status === 'completed') {
      // If completed, remove or set to null
      await HabitLog.findByIdAndDelete(existing._id);

      const totalCompleted = await HabitLog.countDocuments({
        habitId,
        status: 'completed',
      });
      const newStage = calculatePlantStage(totalCompleted);
      const habit = await Habit.findById(habitId);
      if (habit.plantStage !== newStage) {
        habit.plantStage = newStage;
        await habit.save();
      }

      const stageMetrics = getStageProgress(totalCompleted);

      return res.status(200).json({
        success: true,
        action: 'removed',
        message: 'Check-in removed gently.',
        totalCompleted,
        stageMetrics,
      });
    }

    // Otherwise, mark as completed
    const dayOfWeek = computeDayOfWeek(date);
    const log = await HabitLog.findOneAndUpdate(
      { habitId, date },
      {
        status: 'completed',
        dayOfWeek,
        reasonTag: 'None',
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    const totalCompleted = await HabitLog.countDocuments({
      habitId,
      status: 'completed',
    });
    const newStage = calculatePlantStage(totalCompleted);
    const habit = await Habit.findById(habitId);
    if (habit.plantStage !== newStage) {
      habit.plantStage = newStage;
      await habit.save();
    }

    const stageMetrics = getStageProgress(totalCompleted);

    res.status(200).json({
      success: true,
      action: 'completed',
      message: 'Watered! Growth gently nurtured.',
      log,
      totalCompleted,
      stageMetrics,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get log history for a habit with optional date filter
 * @route GET /api/habits/:id/logs
 */
export const getHabitLogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, limit = 60 } = req.query;

    const query = { habitId: id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const logs = await HabitLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

