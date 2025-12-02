const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getChatResponse } = require('./services/aiService');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Coach server is running' });
});

// Chatbot endpoint
app.post('/api/chatbot/message', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    // Mock user context (you can enhance this later)
    const userContext = {
      fitnessGoal: 'general fitness',
      activityLevel: 'moderate',
      dietaryPreferences: [],
    };

    // Get AI response
    const response = await getChatResponse(message, conversationHistory || [], userContext);

    res.status(200).json({
      success: true,
      data: {
        message: response.message,
        suggestions: response.suggestions,
      },
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your request',
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 AI Coach server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chatbot/message`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});
