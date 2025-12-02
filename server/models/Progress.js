const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  weight: Number, // kg
  bodyFat: Number, // percentage
  muscleMass: Number, // kg
  bmi: Number,
  chest: Number, // cm
  waist: Number,
  hips: Number,
  biceps: Number,
  thighs: Number,
});

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  measurements: measurementSchema,
  photos: [{
    url: String,
    type: {
      type: String,
      enum: ['front', 'side', 'back'],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  }],
  weeklyStats: {
    totalWorkouts: {
      type: Number,
      default: 0,
    },
    totalCaloriesBurned: {
      type: Number,
      default: 0,
    },
    totalCaloriesConsumed: {
      type: Number,
      default: 0,
    },
    averageDailyCalories: {
      type: Number,
      default: 0,
    },
  },
  achievements: [{
    title: String,
    description: String,
    earnedDate: {
      type: Date,
      default: Date.now,
    },
    icon: String,
  }],
  notes: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Progress', progressSchema);
