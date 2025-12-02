const { getChatResponse } = require('../services/aiService');

// @desc    Send message to chatbot
// @route   POST /api/chatbot/message
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    // Get user context for personalized responses
    const userContext = {
      userId: req.user.id,
      fitnessGoal: req.user.fitnessGoal,
      activityLevel: req.user.activityLevel,
      dietaryPreferences: req.user.dietaryPreferences,
      age: req.user.age,
      gender: req.user.gender,
    };

    // Get AI response
    const response = await getChatResponse(message, conversationHistory, userContext);

    res.status(200).json({
      success: true,
      data: {
        message: response.message,
        suggestions: response.suggestions,
      },
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    next(error);
  }
};

// @desc    Get fitness advice
// @route   POST /api/chatbot/advice
// @access  Private
exports.getFitnessAdvice = async (req, res, next) => {
  try {
    const { topic } = req.body;

    const userContext = {
      userId: req.user.id,
      fitnessGoal: req.user.fitnessGoal,
      activityLevel: req.user.activityLevel,
    };

    const prompt = `Provide fitness advice about ${topic} for someone with ${userContext.fitnessGoal} goal and ${userContext.activityLevel} activity level.`;

    const response = await getChatResponse(prompt, [], userContext);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
