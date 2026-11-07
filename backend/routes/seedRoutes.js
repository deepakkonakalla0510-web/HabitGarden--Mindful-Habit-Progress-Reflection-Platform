import express from 'express';
import Habit from '../models/Habit.js';
import HabitLog from '../models/HabitLog.js';
import { calculatePlantStage } from '../utils/plantEvolution.js';

const router = express.Router();

const SAMPLE_HABITS = [
  {
    title: 'Morning Mindfulness & Breathwork',
    category: 'Mindfulness',
    flexibleTarget: { targetDays: 5, frequency: 'weekly' },
    color: '#2D5A27',
  },
  {
    title: 'Gentle Park Walk & Movement',
    category: 'Physical Health',
    flexibleTarget: { targetDays: 4, frequency: 'weekly' },
    color: '#608056',
  },
  {
    title: 'Deep Architecture & Systems Reading',
    category: 'Deep Work',
    flexibleTarget: { targetDays: 4, frequency: 'weekly' },
    color: '#3B6E8C',
  },
  {
    title: 'Botanical Sketching & Journaling',
    category: 'Creativity',
    flexibleTarget: { targetDays: 3, frequency: 'weekly' },
    color: '#D97757',
  },
  {
    title: 'Digital Sunset & Screen-Free Rest',
    category: 'Rest',
    flexibleTarget: { targetDays: 6, frequency: 'weekly' },
    color: '#83677B',
  },
];

const REASONS = [
  'Low Energy',
  'Overworked/Busy',
  'Mental Health/Rest',
  'Unplanned Event',
  'Slept In',
];

const REFLECTIONS = [
  'Felt tired after a demanding sprint review. Honoring rest today without guilt.',
  'Work meetings overflowed into personal time. Looking forward to tomorrow.',
  'Felt mentally saturated. Stepped back to let thoughts settle like quiet water.',
  'Late night family emergency. Rested well knowing the garden remains safe.',
  'Energy was at 30%. Chose a warm tea and restorative nap instead.',
  'Listened to my body today. Progress is about long-term sustainability.',
];

/**
 * @desc Reset and seed realistic mindful habit logs across the past 28 days
 * @route POST /api/seed
 */
router.post('/', async (req, res, next) => {
  try {
    // Clear existing
    await Habit.deleteMany({});
    await HabitLog.deleteMany({});

    const createdHabits = [];
    const today = new Date();

    for (let i = 0; i < SAMPLE_HABITS.length; i++) {
      const template = SAMPLE_HABITS[i];
      const habit = await Habit.create({
        ...template,
        plantStage: 'Seed',
      });

      let completedCount = 0;

      // Seed logs across past 28 days
      for (let dayOffset = 27; dayOffset >= 0; dayOffset--) {
        const logDate = new Date(today);
        logDate.setDate(today.getDate() - dayOffset);

        const year = logDate.getFullYear();
        const month = String(logDate.getMonth() + 1).padStart(2, '0');
        const day = String(logDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const dayOfWeek = logDate.getDay(); // 0 is Sun, 1 is Mon...

        // Realistic pattern simulation:
        // Mid-week (Tue-Thu) higher completion, Mon has fatigue, Weekends vary
        let shouldComplete = false;
        let isRestDay = false;

        const rand = Math.random();
        if (dayOfWeek === 1) {
          // Monday: 40% completion, 45% rest (Monday fatigue pattern)
          shouldComplete = rand < 0.4;
          isRestDay = !shouldComplete && rand < 0.85;
        } else if (dayOfWeek >= 2 && dayOfWeek <= 4) {
          // Tue-Thu: 75% completion
          shouldComplete = rand < 0.75;
          isRestDay = !shouldComplete && rand < 0.9;
        } else if (dayOfWeek === 5) {
          // Friday: 65% completion
          shouldComplete = rand < 0.65;
          isRestDay = !shouldComplete && rand < 0.9;
        } else {
          // Weekend: 60% completion
          shouldComplete = rand < 0.6;
          isRestDay = !shouldComplete && rand < 0.8;
        }

        if (shouldComplete) {
          completedCount++;
          await HabitLog.create({
            habitId: habit._id,
            date: dateStr,
            status: 'completed',
            dayOfWeek,
            reasonTag: 'None',
            reflectionNote: '',
          });
        } else if (isRestDay) {
          const reasonTag = REASONS[Math.floor(Math.random() * REASONS.length)];
          const reflectionNote = REFLECTIONS[Math.floor(Math.random() * REFLECTIONS.length)];
          await HabitLog.create({
            habitId: habit._id,
            date: dateStr,
            status: 'rest_day',
            dayOfWeek,
            reasonTag,
            reflectionNote,
          });
        }
      }

      // Update plant stage based on completedCount
      habit.plantStage = calculatePlantStage(completedCount);
      await habit.save();
      createdHabits.push(habit);
    }

    res.status(201).json({
      success: true,
      message: 'HabitGarden nurtured with 5 diverse habits and 28 days of mindful history!',
      seededHabitsCount: createdHabits.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

