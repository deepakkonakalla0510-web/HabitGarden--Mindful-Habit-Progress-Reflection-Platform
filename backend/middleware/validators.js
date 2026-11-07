import { body, param, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';

/**
 * Middleware to check validation results and return formatted 400 errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validate MongoDB ObjectId param
 */
export const validateObjectId = [
  param('id')
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage('Invalid MongoDB ObjectId format'),
  validate,
];

/**
 * Validation rules for creating a habit
 */
export const createHabitValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Habit title is required')
    .isLength({ min: 3, max: 80 })
    .withMessage('Habit title must be between 3 and 80 characters'),
  body('category')
    .optional()
    .isIn(['Mindfulness', 'Physical Health', 'Deep Work', 'Creativity', 'Rest'])
    .withMessage('Invalid habit category'),
  body('flexibleTarget.targetDays')
    .optional()
    .isInt({ min: 1, max: 7 })
    .withMessage('Target days must be an integer between 1 and 7'),
  body('flexibleTarget.frequency')
    .optional()
    .equals('weekly')
    .withMessage('Frequency must be weekly'),
  body('color')
    .optional()
    .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
    .withMessage('Color must be a valid hex code string (e.g. #2D5A27)'),
  validate,
];

/**
 * Validation rules for updating a habit
 */
export const updateHabitValidation = [
  param('id')
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage('Invalid habit ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage('Habit title must be between 3 and 80 characters'),
  body('category')
    .optional()
    .isIn(['Mindfulness', 'Physical Health', 'Deep Work', 'Creativity', 'Rest'])
    .withMessage('Invalid habit category'),
  body('flexibleTarget.targetDays')
    .optional()
    .isInt({ min: 1, max: 7 })
    .withMessage('Target days must be an integer between 1 and 7'),
  body('color')
    .optional()
    .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
    .withMessage('Color must be a valid hex code string'),
  validate,
];

/**
 * Validation rules for quick checkin / log
 */
export const checkinValidation = [
  param('id')
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage('Invalid habit ID'),
  body('date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
  body('status')
    .optional()
    .isIn(['completed', 'rest_day', 'missed'])
    .withMessage('Status must be completed, rest_day, or missed'),
  validate,
];

/**
 * Validation rules for gentle rest reflection
 */
export const reflectionValidation = [
  param('id')
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage('Invalid habit ID'),
  body('date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
  body('status')
    .optional()
    .isIn(['completed', 'rest_day', 'missed'])
    .withMessage('Status must be completed, rest_day, or missed'),
  body('reasonTag')
    .optional()
    .isIn([
      'Low Energy',
      'Overworked/Busy',
      'Mental Health/Rest',
      'Unplanned Event',
      'Slept In',
      'None',
    ])
    .withMessage('Invalid reason tag'),
  body('reflectionNote')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reflection note cannot exceed 500 characters'),
  validate,
];

