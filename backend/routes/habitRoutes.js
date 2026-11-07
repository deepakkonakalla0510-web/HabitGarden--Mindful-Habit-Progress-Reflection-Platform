import express from 'express';
import {
  getHabits,
  getHabitById,
  createHabit,
  updateHabit,
  archiveHabit,
} from '../controllers/habitController.js';
import {
  checkinHabit,
  logReflection,
  toggleCheckin,
  getHabitLogs,
} from '../controllers/logController.js';
import {
  validateObjectId,
  createHabitValidation,
  updateHabitValidation,
  checkinValidation,
  reflectionValidation,
} from '../middleware/validators.js';

const router = express.Router();

// Habit CRUD routes
router.route('/')
  .get(getHabits)
  .post(createHabitValidation, createHabit);

router.route('/:id')
  .get(validateObjectId, getHabitById)
  .put(updateHabitValidation, updateHabit)
  .delete(validateObjectId, archiveHabit);

// Log / Action routes
router.post('/:id/checkin', checkinValidation, checkinHabit);
router.post('/:id/log', checkinValidation, checkinHabit);
router.post('/:id/reflect', reflectionValidation, logReflection);
router.post('/:id/toggle', validateObjectId, toggleCheckin);
router.get('/:id/logs', validateObjectId, getHabitLogs);

export default router;

