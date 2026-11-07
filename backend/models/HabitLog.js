import mongoose from 'mongoose';

const habitLogSchema = new mongoose.Schema(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: [true, 'Habit reference is required'],
      index: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Date string is required in YYYY-MM-DD format'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'],
      index: true,
    },
    status: {
      type: String,
      required: [true, 'Log status is required'],
      enum: {
        values: ['completed', 'rest_day', 'missed'],
        message: '{VALUE} is not a valid log status',
      },
      default: 'completed',
    },
    reflectionNote: {
      type: String,
      maxlength: [500, 'Reflection note cannot exceed 500 characters'],
      trim: true,
      default: '',
    },
    reasonTag: {
      type: String,
      enum: {
        values: [
          'Low Energy',
          'Overworked/Busy',
          'Mental Health/Rest',
          'Unplanned Event',
          'Slept In',
          'None',
        ],
        message: '{VALUE} is not a recognized reason tag',
      },
      default: 'None',
    },
    dayOfWeek: {
      type: Number, // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      required: true,
      min: 0,
      max: 6,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one log entry per habit per date
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

// Pre-save hook: auto-compute dayOfWeek if not supplied or date changed
habitLogSchema.pre('validate', function (next) {
  if (this.date && (this.dayOfWeek === undefined || this.dayOfWeek === null)) {
    // Parse YYYY-MM-DD as UTC to avoid timezone shift
    const [year, month, day] = this.date.split('-').map(Number);
    const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    this.dayOfWeek = d.getUTCDay();
  }
  next();
});

const HabitLog = mongoose.model('HabitLog', habitLogSchema);
export default HabitLog;

