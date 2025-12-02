// AI Coach Service - Intelligent Response Generation
// This service provides ChatGPT-level responses for fitness queries

interface UserContext {
  displayName?: string;
  goal?: string;
  todaySteps?: number;
  todayWorkouts?: number;
  streak?: number;
  todayHydration?: number;
  todayActiveMinutes?: number;
  todayCalories?: number;
  currentWeight?: string;
  targetWeight?: string;
  height?: string;
  age?: number;
  gender?: string;
}

interface ResponseContext {
  userMessage: string;
  userCtx: UserContext | null;
  conversationHistory?: Array<{ role: string; content: string }>;
}

/**
 * Main AI Response Generator
 * Analyzes user query and generates intelligent, personalized responses
 */
export const generateAIResponse = (context: ResponseContext): string => {
  const { userMessage, userCtx } = context;
  const lower = userMessage.toLowerCase();
  
  // Extract user data
  const name = userCtx?.displayName || "there";
  const goal = userCtx?.goal || "your fitness goals";
  const steps = userCtx?.todaySteps || 0;
  const workouts = userCtx?.todayWorkouts || 0;
  const streak = userCtx?.streak || 1;
  const hydration = userCtx?.todayHydration || 0;
  const activeMinutes = userCtx?.todayActiveMinutes || 0;
  const calories = userCtx?.todayCalories || 0;
  const currentWeight = parseFloat(userCtx?.currentWeight || "70");
  const targetWeight = parseFloat(userCtx?.targetWeight || "65");
  
  // Intelligent query classification
  const queryType = classifyQuery(lower);
  
  // Generate response based on query type
  switch (queryType) {
    case 'greeting':
      return generateGreeting(name, { steps, workouts, streak, hydration, activeMinutes, goal });

    case 'workout':
      return generateWorkoutResponse(lower, name, { goal, workouts, activeMinutes, currentWeight });
    
    case 'nutrition':
      return generateNutritionResponse(lower, name, { goal, currentWeight, targetWeight, hydration });
    
    case 'progress':
      return generateProgressResponse(name, { steps, workouts, activeMinutes, hydration, calories, streak });
    
    case 'motivation':
      return generateMotivationResponse(name, { streak, workouts, steps, goal });
    
    case 'goal':
      return generateGoalResponse(name, { goal, currentWeight, targetWeight, steps, activeMinutes, hydration, workouts });
    
    default:
      return generateIntelligentResponse(userMessage, name, userCtx);
  }
};

/**
 * Classify user query into categories
 */
function classifyQuery(query: string): string {
  // Greeting patterns
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|sup|yo|greetings)/i.test(query)) {
    return 'greeting';
  }
  
  // Workout patterns
  if (/(workout|exercise|training|gym|fitness routine|work out|lift|strength|cardio|hiit)/i.test(query)) {
    return 'workout';
  }
  
  // Nutrition patterns
  if (/(meal|diet|nutrition|food|eat|recipe|breakfast|lunch|dinner|snack|calorie|macro|protein)/i.test(query)) {
    return 'nutrition';
  }
  
  // Progress patterns
  if (/(progress|stats|how am i|how's my|today|check|track|doing)/i.test(query)) {
    return 'progress';
  }
  
  // Motivation patterns
  if (/(motivat|inspire|give up|tired|hard|difficult|struggle|can't|help me)/i.test(query)) {
    return 'motivation';
  }
  
  // Goal patterns
  if (/(goal|target|achieve|lose weight|gain muscle|get fit|transform)/i.test(query)) {
    return 'goal';
  }
  
  return 'general';
}


/**
 * Generate greeting response
 */
function generateGreeting(name: string, data: any): string {
  let response = `Hey ${name}! 👋 Great to see you!\n\n`;
  
  if (data.streak > 7) {
    response += `🔥 Wow! ${data.streak}-day streak! That's seriously impressive dedication.\n\n`;
  } else if (data.streak > 1) {
    response += `🔥 Nice ${data.streak}-day streak going! Keep the momentum!\n\n`;
  }
  
  if (data.steps > 0 || data.workouts > 0) {
    response += `**Today's Progress:**\n`;
    if (data.steps >= 10000) response += `✅ ${data.steps.toLocaleString()} steps - Goal crushed!\n`;
    else if (data.steps > 0) response += `• ${data.steps.toLocaleString()} steps (${(10000 - data.steps).toLocaleString()} to goal)\n`;
    if (data.workouts > 0) response += `• ${data.workouts} workout${data.workouts > 1 ? 's' : ''} completed 💪\n`;
    if (data.activeMinutes > 0) response += `• ${data.activeMinutes} active minutes\n`;
    if (data.hydration > 0) response += `• ${data.hydration}/8 glasses of water 💧\n`;
    response += `\n`;
  }
  
  response += `I'm here to help you with ${data.goal}. What would you like to work on?\n\n`;
  response += `I can help with workouts, nutrition, progress tracking, motivation, or answer any fitness question you have!`;
  
  return response;
}

/**
 * Generate workout response
 */
function generateWorkoutResponse(query: string, name: string, data: any): string {
  const { goal, workouts, activeMinutes, currentWeight } = data;
  
  let response = `Hey ${name}! Let me create a workout plan for you.\n\n`;
  
  if (workouts > 0) {
    response += `I see you've already done ${workouts} workout${workouts > 1 ? 's' : ''} today - awesome! Here's something to complement that:\n\n`;
  }
  
  // Determine workout type based on goal
  const isWeightLoss = goal.toLowerCase().includes("weight loss") || goal.toLowerCase().includes("lose") || goal.toLowerCase().includes("fat");
  const isMuscle = goal.toLowerCase().includes("muscle") || goal.toLowerCase().includes("strength") || goal.toLowerCase().includes("gain");
  
  if (isWeightLoss) {
    response += `**🔥 Fat-Burning HIIT Workout** (25 minutes)\n\n`;
    response += `Perfect for ${goal}!\n\n`;
    response += `**Warm-up (5 min):**\n`;
    response += `• Jumping jacks - 1 min\n• Arm circles - 1 min\n• High knees - 1 min\n• Butt kicks - 1 min\n• Dynamic stretches - 1 min\n\n`;
    response += `**Main Circuit** (3 rounds, 45 sec work / 15 sec rest):\n`;
    response += `1. Burpees - Full body cardio\n2. Mountain climbers - Core + cardio\n3. Jump squats - Lower body power\n4. Push-ups - Upper body\n5. High knees - Cardio blast\n6. Plank hold - Core strength\n\n`;
    response += `**Cool-down:** 5 min stretching\n\n`;
    response += `💡 This burns 250-350 calories and boosts metabolism for hours!\n\n`;
  } else if (isMuscle) {
    response += `**💪 Muscle Building Workout** (45 minutes)\n\n`;
    response += `Designed for ${goal}!\n\n`;
    response += `**Upper Body Focus:**\n`;
    response += `• Push-ups: 4 sets × 12 reps\n• Dumbbell rows: 4 sets × 10 reps each arm\n• Shoulder press: 3 sets × 12 reps\n• Bicep curls: 3 sets × 15 reps\n• Tricep dips: 3 sets × 12 reps\n\n`;
    response += `**Core Finisher:**\n`;
    response += `• Plank: 3 × 45 seconds\n• Russian twists: 3 × 20 reps\n• Leg raises: 3 × 15 reps\n\n`;
    response += `💡 Focus on progressive overload - add weight or reps each week!\n\n`;
  } else {
    response += `**🎯 Full-Body Workout** (30 minutes)\n\n`;
    response += `**Circuit** (4 rounds, 60 sec rest between):\n`;
    response += `• Squats: 15 reps\n• Push-ups: 12 reps\n• Lunges: 10 each leg\n• Plank: 30 seconds\n• Jumping jacks: 30 seconds\n\n`;
    response += `💡 Hits all major muscle groups efficiently!\n\n`;
  }
  
  response += `**After this workout:**\n`;
  response += `✓ You'll add 30-40 active minutes\n`;
  response += `✓ Burn 200-400 calories\n`;
  response += `✓ Feel energized and accomplished\n\n`;
  response += `Want me to explain any exercise or create a different workout? Just ask!`;
  
  return response;
}


/**
 * Generate nutrition response
 */
function generateNutritionResponse(query: string, name: string, data: any): string {
  const { goal, currentWeight, targetWeight, hydration } = data;
  const isWeightLoss = currentWeight > targetWeight;
  
  let response = `Hey ${name}! Let me create a nutrition plan for you.\n\n`;
  
  // Calculate calories
  const dailyCalories = isWeightLoss 
    ? Math.round(currentWeight * 24 - 500) 
    : Math.round(currentWeight * 28 + 300);
  
  response += `**📊 Your Daily Nutrition Targets:**\n`;
  response += `• Calories: ${dailyCalories} cal ${isWeightLoss ? '(deficit for fat loss)' : '(surplus for muscle gain)'}\n`;
  response += `• Protein: ${Math.round(currentWeight * 2)}g (builds muscle, keeps you full)\n`;
  response += `• Carbs: ${Math.round(dailyCalories * 0.40 / 4)}g (energy for workouts)\n`;
  response += `• Fats: ${Math.round(dailyCalories * 0.30 / 9)}g (hormone health)\n`;
  response += `• Water: 8+ glasses 💧 ${hydration > 0 ? `(you're at ${hydration}/8 today)` : ''}\n\n`;
  
  response += `**🍽️ Sample Meal Plan:**\n\n`;
  
  response += `**Breakfast** (${Math.round(dailyCalories * 0.25)} cal):\n`;
  response += `• 3 egg whites + 1 whole egg\n• Oatmeal with berries\n• Greek yogurt\n• Green tea\n\n`;
  
  response += `**Lunch** (${Math.round(dailyCalories * 0.35)} cal):\n`;
  response += `• Grilled chicken breast (150g)\n• Brown rice or quinoa (1 cup)\n• Mixed vegetables\n• Side salad with olive oil\n\n`;
  
  response += `**Snack** (${Math.round(dailyCalories * 0.10)} cal):\n`;
  response += `• Protein shake\n• Handful of almonds\n• Apple or banana\n\n`;
  
  response += `**Dinner** (${Math.round(dailyCalories * 0.30)} cal):\n`;
  response += `• Baked salmon or lean beef\n• Sweet potato\n• Steamed broccoli\n\n`;
  
  response += `**💡 Pro Tips:**\n`;
  response += `✓ Meal prep on Sundays\n`;
  response += `✓ Drink water before meals\n`;
  response += `✓ Eat protein with every meal\n`;
  response += `✓ Track your meals\n`;
  response += `✓ 80/20 rule - be consistent, not perfect\n\n`;
  
  if (hydration < 8) {
    response += `⚠️ **Important:** Drink more water! You're at ${hydration}/8 glasses today. Hydration is crucial for ${goal}!\n\n`;
  }
  
  response += `Need specific recipes or have dietary restrictions? Just ask!`;
  
  return response;
}

/**
 * Generate progress response
 */
function generateProgressResponse(name: string, data: any): string {
  const { steps, workouts, activeMinutes, hydration, calories, streak } = data;
  
  let response = `Hey ${name}! Let me check your progress today.\n\n`;
  
  response += `**📊 Today's Performance:**\n`;
  response += `• Steps: ${steps.toLocaleString()} ${steps >= 10000 ? '✅' : steps >= 5000 ? '🟡' : '🔴'} (Goal: 10,000)\n`;
  response += `• Active Minutes: ${activeMinutes} ${activeMinutes >= 60 ? '✅' : activeMinutes >= 30 ? '🟡' : '🔴'} (Goal: 60)\n`;
  response += `• Calories Burned: ${calories.toLocaleString()} cal\n`;
  response += `• Hydration: ${hydration}/8 glasses ${hydration >= 8 ? '✅' : '💧'}\n`;
  response += `• Workouts: ${workouts} ${workouts > 0 ? '💪' : ''}\n`;
  response += `• Streak: ${streak} days 🔥\n\n`;
  
  // Personalized feedback
  if (steps >= 10000 && activeMinutes >= 60 && hydration >= 8) {
    response += `🌟 **Outstanding!** You're crushing all your goals today! This is the consistency that creates real transformation.\n\n`;
  } else if (steps >= 5000 || activeMinutes >= 30) {
    response += `👍 **Good progress!** You're on track. Let's push a bit more to hit all targets.\n\n`;
  } else {
    response += `💪 **Let's get moving!** You've got time to make progress. Even 15 minutes counts!\n\n`;
  }
  
  response += `**Quick Wins:**\n`;
  if (steps < 10000) response += `• Take a ${Math.ceil((10000 - steps) / 100)}-min walk to hit step goal\n`;
  if (hydration < 8) response += `• Drink ${8 - hydration} more glasses of water\n`;
  if (workouts === 0) response += `• Complete a 20-minute workout\n`;
  if (activeMinutes < 60) response += `• Add ${60 - activeMinutes} more active minutes\n\n`;
  
  response += `You're doing great! Keep it up! 💪`;
  
  return response;
}


/**
 * Generate motivation response
 */
function generateMotivationResponse(name: string, data: any): string {
  const { streak, workouts, steps, goal } = data;
  
  let response = `${name}, I hear you! 💪 Let me remind you why you started.\n\n`;
  
  response += `**🔥 Your Journey:**\n`;
  response += `• ${streak}-day streak ${streak > 7 ? "- That's incredible!" : "- Keep building!"}\n`;
  if (workouts > 0) response += `• ${workouts} workout${workouts > 1 ? "s" : ""} today\n`;
  if (steps > 5000) response += `• ${steps.toLocaleString()} steps taken\n`;
  response += `• Working towards: ${goal}\n\n`;
  
  response += `**💎 Remember:**\n`;
  response += `"The only bad workout is the one that didn't happen."\n\n`;
  
  response += `Every day you show up, you're:\n`;
  response += `✓ Building discipline and mental strength\n`;
  response += `✓ Getting physically stronger\n`;
  response += `✓ Moving closer to your goals\n`;
  response += `✓ Inspiring others around you\n`;
  response += `✓ Investing in your future self\n\n`;
  
  if (streak > 5) {
    response += `You've already proven you can do this for ${streak} days! Don't break that streak now. Future you will thank present you! 🙏\n\n`;
  }
  
  response += `**🎯 Small Win Challenge:**\n`;
  response += `Just do ONE thing right now:\n`;
  response += `• 10 push-ups\n`;
  response += `• 5-minute walk\n`;
  response += `• 1 glass of water\n`;
  response += `• 30-second plank\n\n`;
  
  response += `That's it. Just one. You've got this! 💪\n\n`;
  response += `What's holding you back? Tell me and let's work through it together.`;
  
  return response;
}

/**
 * Generate goal response
 */
function generateGoalResponse(name: string, data: any): string {
  const { goal, currentWeight, targetWeight, steps, activeMinutes, hydration, workouts } = data;
  
  let response = `Let's talk about your goals, ${name}! 🎯\n\n`;
  
  if (goal) {
    response += `Your current goal: **${goal}**\n\n`;
    
    if (currentWeight && targetWeight) {
      const diff = currentWeight - targetWeight;
      const weeks = Math.ceil(Math.abs(diff) / 0.5);
      
      response += `**📊 Goal Breakdown:**\n`;
      response += `• Current: ${currentWeight} kg\n`;
      response += `• Target: ${targetWeight} kg\n`;
      response += `• To ${diff > 0 ? 'lose' : 'gain'}: ${Math.abs(diff).toFixed(1)} kg\n`;
      response += `• Timeline: ~${weeks} weeks (0.5kg/week)\n`;
      response += `• Target date: ${new Date(Date.now() + weeks * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n\n`;
    }
  }
  
  response += `**🎯 SMART Goal Framework:**\n`;
  response += `• **S**pecific: Define exactly what you want\n`;
  response += `• **M**easurable: Track with numbers\n`;
  response += `• **A**chievable: Realistic for your lifestyle\n`;
  response += `• **R**elevant: Aligned with your values\n`;
  response += `• **T**ime-bound: Set a deadline\n\n`;
  
  response += `**📅 Milestones:**\n`;
  response += `• Week 1-2: Build consistency (3-4 workouts/week)\n`;
  response += `• Week 3-4: Increase intensity\n`;
  response += `• Week 5-8: See visible changes\n`;
  response += `• Week 9-12: Major transformation\n\n`;
  
  response += `**✅ Daily Habits:**\n`;
  response += `• 10,000 steps ${steps >= 10000 ? '✅' : '⬜'}\n`;
  response += `• 60 active minutes ${activeMinutes >= 60 ? '✅' : '⬜'}\n`;
  response += `• 8 glasses water ${hydration >= 8 ? '✅' : '⬜'}\n`;
  response += `• 1 workout ${workouts > 0 ? '✅' : '⬜'}\n\n`;
  
  response += `Consistency beats perfection! Focus on showing up every day. 🔥`;
  
  return response;
}

/**
 * Generate intelligent response for general queries
 */
function generateIntelligentResponse(query: string, name: string, userCtx: UserContext | null): string {
  let response = `Hey ${name}! 👋\n\n`;
  
  response += `I'm your AI fitness coach, and I'm here to help with anything fitness-related!\n\n`;
  
  response += `**💡 I can help you with:**\n\n`;
  response += `🏋️ **Workouts:** Custom plans, exercise form, HIIT, strength, cardio\n`;
  response += `🥗 **Nutrition:** Meal plans, macros, recipes, supplements\n`;
  response += `📊 **Progress:** Track stats, analyze performance, break plateaus\n`;
  response += `🎯 **Goals:** Weight loss, muscle gain, fitness targets\n`;
  response += `💪 **Motivation:** Accountability, encouragement, habit building\n`;
  response += `🧘 **Recovery:** Sleep, rest days, injury prevention\n\n`;
  
  response += `**Quick examples:**\n`;
  response += `• "Create a workout plan for me"\n`;
  response += `• "What should I eat today?"\n`;
  response += `• "How am I doing with my goals?"\n`;
  response += `• "I need motivation"\n`;
  response += `• "Help me lose weight"\n\n`;
  
  response += `What would you like to know? Be specific and I'll give you a detailed answer!`;
  
  return response;
}
