import mongoose from 'mongoose';
import Habit from '../models/Habit.js';
import HabitLog from '../models/HabitLog.js';
import { generateCompassionateInsights } from '../utils/insightGenerator.js';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ORDERED_DAYS = [1, 2, 3, 4, 5, 6, 0]; // Monday (1) through Sunday (0)

/**
 * @desc Day-of-week behavioral rhythm comparisons (Action 3 - Differentiating Feature)
 * @route GET /api/analytics/weekly-patterns
 */
export const getWeeklyPatterns = async (req, res, next) => {
  try {
    const { habitId } = req.query;
    const matchStage = {};

    if (habitId && mongoose.Types.ObjectId.isValid(habitId)) {
      matchStage.habitId = new mongoose.Types.ObjectId(habitId);
    } else {
      // Only include logs for non-archived habits
      const activeHabits = await Habit.find({ isArchived: false }).select('_id');
      matchStage.habitId = { $in: activeHabits.map((h) => h._id) };
    }

    // Pipeline 1: Group by dayOfWeek to compute counts and rates
    const weekdayPipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$dayOfWeek',
          totalLogs: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          restCount: {
            $sum: { $cond: [{ $eq: ['$status', 'rest_day'] }, 1, 0] },
          },
          missedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'missed'] }, 1, 0] },
          },
        },
      },
    ];

    // Pipeline 2: Group by dayOfWeek and reasonTag to find recurring rest patterns
    const reasonsPipeline = [
      {
        $match: {
          ...matchStage,
          status: 'rest_day',
          reasonTag: { $exists: true, $ne: 'None' },
        },
      },
      {
        $group: {
          _id: { dayOfWeek: '$dayOfWeek', reasonTag: '$reasonTag' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $group: {
          _id: '$_id.dayOfWeek',
          topReasons: {
            $push: {
              reason: '$_id.reasonTag',
              count: '$count',
            },
          },
        },
      },
    ];

    const [weekdayResults, reasonsResults] = await Promise.all([
      HabitLog.aggregate(weekdayPipeline),
      HabitLog.aggregate(reasonsPipeline),
    ]);

    const weekdayMap = new Map(weekdayResults.map((item) => [item._id, item]));
    const reasonsMap = new Map(reasonsResults.map((item) => [item._id, item.topReasons]));

    let totalAllLogs = 0;

    // Build complete Monday-Sunday ordered rhythm array (Mon -> Sun)
    const patterns = ORDERED_DAYS.map((dayNum) => {
      const stats = weekdayMap.get(dayNum) || {
        totalLogs: 0,
        completedCount: 0,
        restCount: 0,
        missedCount: 0,
      };

      totalAllLogs += stats.totalLogs;
      const reasons = reasonsMap.get(dayNum) || [];

      // Completion rate calculation:
      // In HabitGarden philosophy, completed logs / total recorded logs on that weekday
      const rate =
        stats.totalLogs > 0 ? Math.round((stats.completedCount / stats.totalLogs) * 100) : 0;

      const restRate =
        stats.totalLogs > 0 ? Math.round((stats.restCount / stats.totalLogs) * 100) : 0;

      return {
        dayOfWeek: dayNum,
        dayName: DAY_NAMES[dayNum],
        shortDay: DAY_NAMES[dayNum].slice(0, 3),
        totalLogs: stats.totalLogs,
        completedCount: stats.completedCount,
        restCount: stats.restCount,
        missedCount: stats.missedCount,
        completionRate: rate,
        restRate,
        topReasons: reasons.slice(0, 3),
        primaryReason: reasons[0]?.reason || 'None',
      };
    });

    // Generate dynamic compassionate insights
    const insights = generateCompassionateInsights(patterns, totalAllLogs);

    res.status(200).json({
      success: true,
      habitFilter: habitId || 'all_active_habits',
      totalLogsAnalyzed: totalAllLogs,
      patterns,
      insights,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc High-level monthly growth summary with calm metrics
 * @route GET /api/analytics/summary
 */
export const getGardenSummary = async (req, res, next) => {
  try {
    const activeHabits = await Habit.find({ isArchived: false });
    const habitIds = activeHabits.map((h) => h._id);

    // Total logs count
    const totalCompletions = await HabitLog.countDocuments({
      habitId: { $in: habitIds },
      status: 'completed',
    });

    const totalRestDays = await HabitLog.countDocuments({
      habitId: { $in: habitIds },
      status: 'rest_day',
    });

    const totalLogs = totalCompletions + totalRestDays;

    // Canopy Stage Breakdown
    const canopyDistribution = {
      Seed: 0,
      Sprout: 0,
      Bud: 0,
      Bloom: 0,
      'Lush Tree': 0,
    };
    activeHabits.forEach((h) => {
      if (canopyDistribution[h.plantStage] !== undefined) {
        canopyDistribution[h.plantStage]++;
      }
    });

    // Category distribution
    const categoryStats = await HabitLog.aggregate([
      { $match: { habitId: { $in: habitIds }, status: 'completed' } },
      {
        $lookup: {
          from: 'habits',
          localField: 'habitId',
          foreignField: '_id',
          as: 'habit',
        },
      },
      { $unwind: '$habit' },
      {
        $group: {
          _id: '$habit.category',
          completions: { $sum: 1 },
        },
      },
    ]);

    // Harmony Index (Mindful consistency percentage):
    // Measures intentional check-ins and conscious rest vs abandoned days
    const harmonyIndex =
      totalLogs > 0 ? Math.min(100, Math.round(((totalCompletions + totalRestDays) / Math.max(totalLogs, 1)) * 100)) : 100;

    // Reason Tag frequency across garden
    const topReasonTags = await HabitLog.aggregate([
      {
        $match: {
          habitId: { $in: habitIds },
          status: 'rest_day',
          reasonTag: { $ne: 'None' },
        },
      },
      {
        $group: {
          _id: '$reasonTag',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      summary: {
        activeHabitCount: activeHabits.length,
        totalMindfulMoments: totalCompletions,
        totalRestfulPauses: totalRestDays,
        harmonyIndex,
        canopyDistribution,
        categoryStats: categoryStats.map((c) => ({
          category: c._id,
          completions: c.completions,
        })),
        topReasonTags: topReasonTags.map((r) => ({
          tag: r._id,
          count: r.count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

