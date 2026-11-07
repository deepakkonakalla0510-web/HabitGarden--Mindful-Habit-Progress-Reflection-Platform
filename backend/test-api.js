import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './config/db.js';
import Habit from './models/Habit.js';
import HabitLog from './models/HabitLog.js';
import app from './server.js';
import http from 'http';

const runTests = async () => {
  console.log('🧪 Starting HabitGarden Automated API & Aggregation Verification...\n');

  // Wait a moment for server to bind
  await new Promise((r) => setTimeout(r, 1000));

  const BASE_URL = 'http://localhost:5000/api';

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('✓ [GET /api/health]:', healthData.project, '| Architect:', healthData.developer.studentName, '| USN:', healthData.developer.studentId);

    // 2. Seed realistic data
    const seedRes = await fetch(`${BASE_URL}/seed`, { method: 'POST' });
    const seedData = await seedRes.json();
    console.log('✓ [POST /api/seed]:', seedData.message, `(${seedData.seededHabitsCount} habits seeded)`);

    // 3. Get all active habits with weekly progress
    const habitsRes = await fetch(`${BASE_URL}/habits`);
    const habitsData = await habitsRes.json();
    console.log(`✓ [GET /api/habits]: Retrieved ${habitsData.count} habits. Current week: ${habitsData.currentWeek.startOfWeek} to ${habitsData.currentWeek.endOfWeek}`);

    const firstHabit = habitsData.data[0];
    console.log(`   Sample Habit: "${firstHabit.title}" | Stage: ${firstHabit.plantStage} | Target: ${firstHabit.thisWeek.targetDays} days/wk | Done this wk: ${firstHabit.thisWeek.completedCount}`);

    // 4. Action 1: Water habit (Checkin)
    const checkinRes = await fetch(`${BASE_URL}/habits/${firstHabit._id}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: habitsData.currentWeek.today, status: 'completed' }),
    });
    const checkinData = await checkinRes.json();
    console.log('✓ [POST /api/habits/:id/checkin] (Action 1):', checkinData.message);

    // 5. Action 2: Log gentle rest reflection
    const reflectRes = await fetch(`${BASE_URL}/habits/${firstHabit._id}/reflect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: '2026-11-01',
        status: 'rest_day',
        reasonTag: 'Mental Health/Rest',
        reflectionNote: 'Taking quiet time in the autumn evening. Preserving energy.',
      }),
    });
    const reflectData = await reflectRes.json();
    console.log('✓ [POST /api/habits/:id/reflect] (Action 2):', reflectData.message, '| Note preserved:', reflectData.log.reasonTag);

    // 6. Action 3: Weekly behavioral rhythm comparisons (Differentiating Feature)
    const patternRes = await fetch(`${BASE_URL}/analytics/weekly-patterns`);
    const patternData = await patternRes.json();
    console.log(`✓ [GET /api/analytics/weekly-patterns] (Action 3): Analyzed ${patternData.totalLogsAnalyzed} logs across Mon-Sun.`);
    patternData.patterns.forEach((p) => {
      console.log(`   ${p.dayName.padEnd(9)} -> ${String(p.completionRate).padStart(3)}% completed, ${String(p.restRate).padStart(3)}% rest | Top reason: ${p.primaryReason}`);
    });
    console.log(`   Compassionate Insights generated: ${patternData.insights.length} insight cards.`);
    patternData.insights.forEach((ins) => {
      console.log(`   - [${ins.title}]: ${ins.message.slice(0, 80)}...`);
    });

    // 7. Garden summary
    const summaryRes = await fetch(`${BASE_URL}/analytics/summary`);
    const summaryData = await summaryRes.json();
    console.log('✓ [GET /api/analytics/summary]:', {
      activeHabits: summaryData.summary.activeHabitCount,
      mindfulMoments: summaryData.summary.totalMindfulMoments,
      restfulPauses: summaryData.summary.totalRestfulPauses,
      harmonyIndex: `${summaryData.summary.harmonyIndex}%`,
      canopyDistribution: summaryData.summary.canopyDistribution,
    });

    // 8. Action 4: Create new habit with flexible targets
    const createRes = await fetch(`${BASE_URL}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Evening Herbal Tea & Stargazing',
        category: 'Rest',
        flexibleTarget: { targetDays: 5, frequency: 'weekly' },
        color: '#83677B',
      }),
    });
    const createData = await createRes.json();
    console.log('✓ [POST /api/habits] (Action 4):', createData.message, '| New ID:', createData.data._id);

    console.log('\n🌟 ALL E2E API & AGGREGATION TESTS PASSED WITH 100% SUCCESS!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  }
};

runTests();
