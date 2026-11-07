import express from 'express';
import {
  getWeeklyPatterns,
  getGardenSummary,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/weekly-patterns', getWeeklyPatterns);
router.get('/summary', getGardenSummary);

export default router;

