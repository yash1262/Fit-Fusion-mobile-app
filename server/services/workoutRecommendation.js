const Workout = require('../models/Workout');

// Generate workout recommendations based on user profile
const getWorkoutRecommendations = async (user) => {
  try {
    const recommendations = [];

    // Get user's recent workouts to avoid repetition
    const recentWorkouts = await Workout.find({
      userId: user.id,
      date: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    });

    const recentTypes = recentWorkouts.map(w => w.type);

    // Base recommendations on fitness goal
    switch (user.fitnessGoal) {
      case 'weight_loss':
        recommendations.push(
          {
            title: 'HIIT Cardio Blast',
            type: 'cardio',
            duration: 30,
            difficulty: user.activityLevel === 'sedentary' ? 'beginner' : 'intermediate',
            exercises: [
              { name: 'Jumping Jacks', sets: 3, reps: 20, caloriesBurned: 50 },
              { name: 'Burpees', sets: 3, reps: 15, caloriesBurned: 75 },
              { name: 'Mountain Climbers', sets: 3, reps: 20, caloriesBurned: 60 },
              { name: 'High Knees', sets: 3, reps: 30, caloriesBurned: 55 },
            ],
          },
          {
            title: 'Steady State Cardio',
            type: 'cardio',
            duration: 45,
            difficulty: 'beginner',
            exercises: [
              { name: 'Brisk Walking', duration: 45, caloriesBurned: 200 },
            ],
          }
        );
        break;

      case 'muscle_gain':
        recommendations.push(
          {
            title: 'Upper Body Strength',
            type: 'strength',
            duration: 60,
            difficulty: 'intermediate',
            exercises: [
              { name: 'Bench Press', sets: 4, reps: 8, weight: 60, caloriesBurned: 100 },
              { name: 'Pull-ups', sets: 4, reps: 10, caloriesBurned: 80 },
              { name: 'Shoulder Press', sets: 3, reps: 10, weight: 40, caloriesBurned: 70 },
              { name: 'Bicep Curls', sets: 3, reps: 12, weight: 15, caloriesBurned: 50 },
            ],
          },
          {
            title: 'Lower Body Power',
            type: 'strength',
            duration: 60,
            difficulty: 'intermediate',
            exercises: [
              { name: 'Squats', sets: 4, reps: 10, weight: 80, caloriesBurned: 120 },
              { name: 'Deadlifts', sets: 4, reps: 8, weight: 100, caloriesBurned: 140 },
              { name: 'Lunges', sets: 3, reps: 12, weight: 20, caloriesBurned: 90 },
              { name: 'Leg Press', sets: 3, reps: 12, weight: 120, caloriesBurned: 100 },
            ],
          }
        );
        break;

      case 'endurance':
        recommendations.push(
          {
            title: 'Long Distance Run',
            type: 'cardio',
            duration: 60,
            difficulty: 'intermediate',
            exercises: [
              { name: 'Running', duration: 60, caloriesBurned: 600 },
            ],
          },
          {
            title: 'Cycling Session',
            type: 'cardio',
            duration: 45,
            difficulty: 'intermediate',
            exercises: [
              { name: 'Cycling', duration: 45, caloriesBurned: 400 },
            ],
          }
        );
        break;

      default:
        recommendations.push(
          {
            title: 'Full Body Workout',
            type: 'strength',
            duration: 45,
            difficulty: 'intermediate',
            exercises: [
              { name: 'Push-ups', sets: 3, reps: 15, caloriesBurned: 60 },
              { name: 'Squats', sets: 3, reps: 15, caloriesBurned: 70 },
              { name: 'Plank', sets: 3, duration: 1, caloriesBurned: 30 },
              { name: 'Lunges', sets: 3, reps: 12, caloriesBurned: 50 },
            ],
          }
        );
    }

    // Add flexibility workout if not done recently
    if (!recentTypes.includes('flexibility')) {
      recommendations.push({
        title: 'Flexibility & Stretching',
        type: 'flexibility',
        duration: 20,
        difficulty: 'beginner',
        exercises: [
          { name: 'Hamstring Stretch', sets: 2, duration: 2, caloriesBurned: 10 },
          { name: 'Quad Stretch', sets: 2, duration: 2, caloriesBurned: 10 },
          { name: 'Shoulder Stretch', sets: 2, duration: 2, caloriesBurned: 5 },
          { name: 'Cat-Cow Stretch', sets: 3, reps: 10, caloriesBurned: 15 },
        ],
      });
    }

    return recommendations;
  } catch (error) {
    console.error('Workout recommendation error:', error);
    return [];
  }
};

module.exports = {
  getWorkoutRecommendations,
};
