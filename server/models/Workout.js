const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
  },
  duration: {
    type: Number, // in minutes
  },
  weight: {
    type: Number, // in kg
  },
  caloriesBurned: {
    type: Number,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  notes: String,
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a workout title'],
  },
  type: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'sports', 'other'],
    required: true,
  },
  exercises: [exerciseSchema],
  date: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number, // total duration in minutes
  },
  totalCalories: {
    type: Number,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  notes: String,
}, {
  timestamps: true,
});

// Calculate total calories before saving
workoutSchema.pre('save', function(next) {
  if (this.exercises && this.exercises.length > 0) {
    this.totalCalories = this.exercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
  }
  next();
});

module.exports = mongoose.model('Workout', workoutSchema);
