const Progress = require('../models/Progress');
const Workout = require('../models/Workout');
const Meal = require('../models/Meal');

// @desc    Get all progress entries
// @route   GET /api/progress
// @access  Private
exports.getProgress = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { userId: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const progress = await Progress.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single progress entry
// @route   GET /api/progress/:id
// @access  Private
exports.getProgressEntry = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress entry not found',
      });
    }

    if (progress.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create progress entry
// @route   POST /api/progress
// @access  Private
exports.createProgress = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;

    // Calculate BMI if weight and height available
    if (req.body.measurements?.weight && req.user.height) {
      const heightInMeters = req.user.height / 100;
      req.body.measurements.bmi = (
        req.body.measurements.weight / (heightInMeters * heightInMeters)
      ).toFixed(2);
    }

    const progress = await Progress.create(req.body);

    res.status(201).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress entry
// @route   PUT /api/progress/:id
// @access  Private
exports.updateProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress entry not found',
      });
    }

    if (progress.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    progress = await Progress.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete progress entry
// @route   DELETE /api/progress/:id
// @access  Private
exports.deleteProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress entry not found',
      });
    }

    if (progress.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await progress.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly stats
// @route   GET /api/progress/weekly-stats
// @access  Private
exports.getWeeklyStats = async (req, res, next) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get workouts for the week
    const workouts = await Workout.find({
      userId: req.user.id,
      date: { $gte: weekAgo, $lte: now },
    });

    // Get meals for the week
    const meals = await Meal.find({
      userId: req.user.id,
      date: { $gte: weekAgo, $lte: now },
    });

    const stats = {
      totalWorkouts: workouts.length,
      totalCaloriesBurned: workouts.reduce((sum, w) => sum + (w.totalCalories || 0), 0),
      totalCaloriesConsumed: meals.reduce((sum, m) => sum + m.totalCalories, 0),
      averageDailyCalories: meals.length > 0 
        ? Math.round(meals.reduce((sum, m) => sum + m.totalCalories, 0) / 7)
        : 0,
      workoutsByType: {},
    };

    // Count workouts by type
    workouts.forEach(workout => {
      stats.workoutsByType[workout.type] = (stats.workoutsByType[workout.type] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
