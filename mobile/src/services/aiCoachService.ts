// AI Coach Service for Mobile
// Provides intelligent fitness coaching responses

interface UserContext {
  displayName?: string;
  goal?: string;
  todaySteps?: number;
  todayCalories?: number;
  todayActiveMinutes?: number;
  todayHydration?: number;
  todayWorkouts?: number;
}

interface AIRequest {
  userMessage: string;
  userCtx?: UserContext | null;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export const generateAIResponse = (request: AIRequest): string => {
  const { userMessage, userCtx } = request;
  const msg = userMessage.toLowerCase();

  const userName = userCtx?.displayName || 'there';

  // Workout-related queries
  if (msg.includes('workout') || msg.includes('exercise') || msg.includes('train')) {
    if (msg.includes('beginner') || msg.includes('start')) {
      return `Hey ${userName}! 💪 Great question! For beginners, I recommend starting with:\n\n🏃 3-4 days per week\n⏱️ 20-30 minutes per session\n\n**Week 1-2: Foundation**\n- Bodyweight squats: 3 sets of 10\n- Push-ups (or knee push-ups): 3 sets of 8\n- Plank: 3 sets of 20-30 seconds\n- Walking or light jogging: 15 minutes\n\n**Week 3-4: Progress**\n- Increase reps by 2-3\n- Add lunges: 3 sets of 10 per leg\n- Increase cardio to 20 minutes\n\nRemember: Form over speed! Listen to your body and rest when needed. You've got this! 🎯`;
    }
    
    if (msg.includes('hiit') || msg.includes('cardio')) {
      return `${userName}, HIIT is amazing for burning calories! 🔥\n\n**20-Minute HIIT Workout:**\n\n1. Warm-up (3 min): Light jog in place\n2. Circuit (repeat 3x):\n   - Burpees: 30 sec\n   - Rest: 15 sec\n   - Mountain climbers: 30 sec\n   - Rest: 15 sec\n   - Jump squats: 30 sec\n   - Rest: 15 sec\n   - High knees: 30 sec\n   - Rest: 1 min between circuits\n3. Cool down (3 min): Stretching\n\n💡 Tip: Start with 20 sec work / 20 sec rest if you're new to HIIT!\n\nBased on your current activity (${userCtx?.todayActiveMinutes || 0} active minutes today), this would be a great addition!`;
    }

    return `${userName}, I'd love to help with your workout! 💪\n\nCould you tell me more about:\n- Your fitness level (beginner/intermediate/advanced)\n- Your main goal (strength/weight loss/endurance)\n- Available equipment\n- Time you have available\n\nThis will help me create the perfect plan for you!`;
  }

  // Nutrition queries
  if (msg.includes('meal') || msg.includes('diet') || msg.includes('nutrition') || msg.includes('eat')) {
    if (msg.includes('weight loss') || msg.includes('lose weight')) {
      return `Great question, ${userName}! 🥗 For healthy weight loss:\n\n**Meal Structure:**\n\n🍳 **Breakfast (7-9 AM)**\n- Oatmeal with berries & almonds\n- Greek yogurt with honey\n- Scrambled eggs with veggies\n\n🥙 **Lunch (12-2 PM)**\n- Grilled chicken salad\n- Quinoa bowl with vegetables\n- Lean protein + complex carbs\n\n🍽️ **Dinner (6-8 PM)**\n- Baked salmon with broccoli\n- Turkey breast with sweet potato\n- Stir-fry with lean protein\n\n💡 **Key Tips:**\n- Drink ${8 - (userCtx?.todayHydration || 0)} more glasses of water today\n- Eat every 3-4 hours\n- Portion control is key\n- Avoid processed foods\n\nCalorie target: 1,500-1,800 for women, 1,800-2,200 for men (adjust based on activity)`;
    }

    if (msg.includes('protein') || msg.includes('muscle')) {
      return `${userName}, protein is crucial for muscle growth! 💪\n\n**Daily Protein Target:** 1.6-2.2g per kg of body weight\n\n**Best Protein Sources:**\n🥩 Lean meats: Chicken, turkey, lean beef\n🐟 Fish: Salmon, tuna, cod\n🥚 Eggs: Whole eggs are perfect\n🥛 Dairy: Greek yogurt, cottage cheese\n🌱 Plant-based: Lentils, chickpeas, tofu\n\n**Timing:**\n- Within 30 min post-workout\n- Spread throughout the day\n- Before bed (casein protein)\n\nYou've burned ${userCtx?.todayCalories || 0} calories today - make sure to fuel properly!`;
    }

    return `${userName}, I can help with nutrition! 🥗\n\nWhat's your main goal?\n- Weight loss\n- Muscle gain\n- General health\n- Meal planning\n\nLet me know and I'll create a personalized plan!`;
  }

  // Progress and goals
  if (msg.includes('goal') || msg.includes('progress') || msg.includes('track')) {
    return `${userName}, let's talk about your progress! 📊\n\n**Today's Stats:**\n- Steps: ${userCtx?.todaySteps?.toLocaleString() || 0} / 10,000\n- Active Minutes: ${userCtx?.todayActiveMinutes || 0} / 60\n- Calories: ${userCtx?.todayCalories || 0}\n- Hydration: ${userCtx?.todayHydration || 0} / 8 glasses\n- Workouts: ${userCtx?.todayWorkouts || 0}\n\n**SMART Goal Framework:**\n✓ Specific: Define exactly what you want\n✓ Measurable: Track with numbers\n✓ Achievable: Start realistic\n✓ Relevant: Align with your lifestyle\n✓ Time-bound: Set a deadline\n\n**Example Goals:**\n- Lose 0.5-1 kg per week\n- Add 5kg to bench press in 4 weeks\n- Run 5K in under 30 minutes\n- Hit 10,000 steps daily for 30 days\n\nWhat specific goal would you like to set?`;
  }

  // Motivation
  if (msg.includes('motivat') || msg.includes('tired') || msg.includes('lazy') || msg.includes('give up')) {
    return `${userName}, I hear you! 💪 Everyone has tough days.\n\n**Remember:**\n- You've already completed ${userCtx?.todayWorkouts || 0} workout(s) today!\n- You've taken ${userCtx?.todaySteps?.toLocaleString() || 0} steps\n- Every small step counts\n\n**Quick Motivation Boost:**\n1. Think about WHY you started\n2. Visualize your goal achieved\n3. Just do 10 minutes (you'll likely continue)\n4. Remember: You never regret a workout\n\n"The only bad workout is the one that didn't happen."\n\nYou've got this! Start small, stay consistent. I believe in you! 🔥`;
  }

  // General greeting
  if (msg.includes('hello') || msg.includes('hi ') || msg === 'hi' || msg.includes('hey')) {
    return `Hey ${userName}! 👋 Great to see you!\n\n**Today's Progress:**\n- ${userCtx?.todaySteps?.toLocaleString() || 0} steps\n- ${userCtx?.todayActiveMinutes || 0} active minutes\n- ${userCtx?.todayWorkouts || 0} workouts completed\n\nI'm here to help with:\n💪 Workout plans\n🥗 Nutrition advice\n🎯 Goal setting\n📊 Progress tracking\n🧠 Motivation\n\nWhat would you like to work on today?`;
  }

  // Default response
  return `Hey ${userName}! 🤖 I'm your AI Fitness Coach!\n\nI can help you with:\n\n💪 **Workouts**\n- Custom workout plans\n- Exercise form tips\n- HIIT, strength, cardio routines\n\n🥗 **Nutrition**\n- Meal planning\n- Macro calculations\n- Healthy recipes\n\n🎯 **Goals**\n- Setting SMART goals\n- Tracking progress\n- Staying motivated\n\n📊 **Your Stats Today:**\n- Steps: ${userCtx?.todaySteps?.toLocaleString() || 0}\n- Active Minutes: ${userCtx?.todayActiveMinutes || 0}\n- Workouts: ${userCtx?.todayWorkouts || 0}\n\nWhat would you like to know? Ask me anything!`;
};
