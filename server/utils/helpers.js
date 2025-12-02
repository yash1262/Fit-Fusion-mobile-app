 // Calculate BMI
const calculateBMI = (weight, height) => {
    // weight in kg, height in cm
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };
  
  // Calculate BMR (Basal Metabolic Rate)
  const calculateBMR = (weight, height, age, gender) => {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
  };
  
  // Calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = (bmr, activityLevel) => {
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
  
    return Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
  };
  
  // Calculate recommended daily calories based on goal
  const calculateDailyCalories = (tdee, fitnessGoal) => {
    switch (fitnessGoal) {
      case 'weight_loss':
        return Math.round(tdee - 500); // 500 calorie deficit
      case 'muscle_gain':
        return Math.round(tdee + 300); // 300 calorie surplus
      case 'maintenance':
      default:
        return Math.round(tdee);
    }
  };
  
  // Calculate macronutrient split
  const calculateMacros = (calories, fitnessGoal) => {
    let proteinPercent, carbPercent, fatPercent;
  
    switch (fitnessGoal) {
      case 'weight_loss':
        proteinPercent = 0.35;
        carbPercent = 0.35;
        fatPercent = 0.30;
        break;
      case 'muscle_gain':
        proteinPercent = 0.30;
        carbPercent = 0.45;
        fatPercent = 0.25;
        break;
      default:
        proteinPercent = 0.25;
        carbPercent = 0.45;
        fatPercent = 0.30;
    }
  
    return {
      protein: Math.round((calories * proteinPercent) / 4), // 4 cal per gram
      carbs: Math.round((calories * carbPercent) / 4),
      fats: Math.round((calories * fatPercent) / 9), // 9 cal per gram
    };
  };
  
  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };
  
  // Get date range for week
  const getWeekRange = (date = new Date()) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
  
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
  
    return { startOfWeek, endOfWeek };
  };
  
  module.exports = {
    calculateBMI,
    calculateBMR,
    calculateTDEE,
    calculateDailyCalories,
    calculateMacros,
    formatDate,
    getWeekRange,
  };
  