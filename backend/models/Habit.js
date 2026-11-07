import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Habit title is required'],
      trim: true,
      minlength: [3, 'Habit title must be at least 3 characters'],
      maxlength: [80, 'Habit title cannot exceed 80 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Mindfulness', 'Physical Health', 'Deep Work', 'Creativity', 'Rest'],
        message: '{VALUE} is not a valid category',
      },
      default: 'Mindfulness',
    },
    flexibleTarget: {
      targetDays: {
        type: Number,
        required: true,
        min: [1, 'Target days must be at least 1'],
        max: [7, 'Target days cannot exceed 7'],
        default: 4,
      },
      frequency: {
        type: String,
        enum: ['weekly'],
        default: 'weekly',
      },
    },
    plantStage: {
      type: String,
      enum: {
        values: ['Seed', 'Sprout', 'Bud', 'Bloom', 'Lush Tree'],
        message: '{VALUE} is not a valid plant stage',
      },
      default: 'Seed',
    },
    color: {
      type: String,
      default: '#2D5A27',
      match: [/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Please provide a valid hex color code'],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for logs association
habitSchema.virtual('logs', {
  ref: 'HabitLog',
  localField: '_id',
  foreignField: 'habitId',
});

const Habit = mongoose.model('Habit', habitSchema);
export default Habit;

