const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece'],
    default: 'g',
  },
  calories: Number,
  protein: Number, // in grams
  carbs: Number,
  fats: Number,
  fiber: Number,
});

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true,
  },
  foods: [foodItemSchema],
  date: {
    type: Date,
    default: Date.now,
  },
  totalCalories: {
    type: Number,
    default: 0,
  },
  totalProtein: {
    type: Number,
    default: 0,
  },
  totalCarbs: {
    type: Number,
    default: 0,
  },
  totalFats: {
    type: Number,
    default: 0,
  },
  notes: String,
  imageUrl: String,
}, {
  timestamps: true,
});

// Calculate totals before saving
mealSchema.pre('save', function(next) {
  if (this.foods && this.foods.length > 0) {
    this.totalCalories = this.foods.reduce((sum, food) => sum + (food.calories || 0), 0);
    this.totalProtein = this.foods.reduce((sum, food) => sum + (food.protein || 0), 0);
    this.totalCarbs = this.foods.reduce((sum, food) => sum + (food.carbs || 0), 0);
    this.totalFats = this.foods.reduce((sum, food) => sum + (food.fats || 0), 0);
  }
  next();
});

module.exports = mongoose.model('Meal', mealSchema);
