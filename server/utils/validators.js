// Email validation
const isValidEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };
  
  // Password validation (min 6 chars, at least one number and letter)
  const isValidPassword = (password) => {
    return password && password.length >= 6;
  };
  
  // Validate user registration data
  const validateRegistration = (data) => {
    const errors = [];
  
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
  
    if (!isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }
  
    if (!isValidPassword(data.password)) {
      errors.push('Password must be at least 6 characters');
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  // Validate workout data
  const validateWorkout = (data) => {
    const errors = [];
  
    if (!data.title || data.title.trim().length < 2) {
      errors.push('Workout title is required');
    }
  
    if (!data.type) {
      errors.push('Workout type is required');
    }
  
    if (!data.exercises || data.exercises.length === 0) {
      errors.push('At least one exercise is required');
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  // Validate meal data
  const validateMeal = (data) => {
    const errors = [];
  
    if (!data.mealType) {
      errors.push('Meal type is required');
    }
  
    if (!data.foods || data.foods.length === 0) {
      errors.push('At least one food item is required');
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  module.exports = {
    isValidEmail,
    isValidPassword,
    validateRegistration,
    validateWorkout,
    validateMeal,
  };
  