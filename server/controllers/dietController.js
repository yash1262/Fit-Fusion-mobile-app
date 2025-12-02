const Meal = require('../models/Meal');
const { getNutritionInfo } = require('../services/nutritionAPI');

// @desc    Get all meals for user
// @route   GET /api/diet/meals
// @access  Private
exports.getMeals = async (req, res, next) => {
  try {
    const { startDate, endDate, mealType } = req.query;
    
    let query = { userId: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (mealType) {
      query.mealType = mealType;
    }

    const meals = await Meal.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single meal
// @route   GET /api/diet/meals/:id
// @access  Private
exports.getMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found',
      });
    }

    if (meal.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log meal
// @route   POST /api/diet/meals
// @access  Private
exports.logMeal = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;

    const meal = await Meal.create(req.body);

    res.status(201).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update meal
// @route   PUT /api/diet/meals/:id
// @access  Private
exports.updateMeal = async (req, res, next) => {
  try {
    let meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found',
      });
    }

    if (meal.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete meal
// @route   DELETE /api/diet/meals/:id
// @access  Private
exports.deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found',
      });
    }

    if (meal.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await meal.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nutrition info for food
// @route   POST /api/diet/nutrition
// @access  Private
exports.getNutritionData = async (req, res, next) => {
  try {
    const { foodName, quantity } = req.body;

    if (!foodName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide food name',
      });
    }

    const nutritionData = await getNutritionInfo(foodName, quantity);

    res.status(200).json({
      success: true,
      data: nutritionData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get daily nutrition summary
// @route   GET /api/diet/summary
// @access  Private
exports.getDailySummary = async (req, res, next) => {
  try {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();
    
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    const meals = await Meal.find({
      userId: req.user.id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const summary = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      mealCount: meals.length,
      meals: meals,
    };

    meals.forEach(meal => {
      summary.totalCalories += meal.totalCalories;
      summary.totalProtein += meal.totalProtein;
      summary.totalCarbs += meal.totalCarbs;
      summary.totalFats += meal.totalFats;
    });

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
