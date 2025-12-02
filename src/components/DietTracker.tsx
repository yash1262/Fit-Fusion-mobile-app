import React, { useState } from 'react';
import FitFusionLogo from "./FitFusionLogo";
import { Link } from 'react-router-dom';

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  serving: string;
  quantity: number;
}

interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Food[];
  timestamp: Date;
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

const DietTracker: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showAddFood, setShowAddFood] = useState(false);

  const nutritionGoals: NutritionGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25,
  };

  const foodDatabase: Food[] = [
    { id: '1', name: 'Grilled Chicken Breast', calories: 231, protein: 43.5, carbs: 0, fat: 5, fiber: 0, serving: '100g', quantity: 1 },
    { id: '2', name: 'Brown Rice', calories: 123, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, serving: '100g', quantity: 1 },
    { id: '3', name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, serving: '100g', quantity: 1 },
    { id: '4', name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, serving: '100g', quantity: 1 },
    { id: '5', name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, serving: '1 medium', quantity: 1 },
    { id: '6', name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, serving: '100g', quantity: 1 },
    { id: '7', name: 'Salmon Fillet', calories: 208, protein: 25, carbs: 0, fat: 12, fiber: 0, serving: '100g', quantity: 1 },
    { id: '8', name: 'Quinoa', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, fiber: 2.8, serving: '100g', quantity: 1 },
  ];

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFoodToMeal = (food: Food) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      type: selectedMealType,
      foods: [{ ...food, quantity: 1 }],
      timestamp: new Date(),
    };

    setMeals(prev => [...prev, newMeal]);
    setShowAddFood(false);
    setSearchQuery('');
  };

  const getTotalNutrition = () => {
    return meals.reduce(
      (total, meal) => {
        meal.foods.forEach(food => {
          total.calories += food.calories * food.quantity;
          total.protein += food.protein * food.quantity;
          total.carbs += food.carbs * food.quantity;
          total.fat += food.fat * food.quantity;
          total.fiber += food.fiber * food.quantity;
        });
        return total;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  const getMealNutrition = (meal: Meal) => {
    return meal.foods.reduce(
      (total, food) => {
        total.calories += food.calories * food.quantity;
        total.protein += food.protein * food.quantity;
        total.carbs += food.carbs * food.quantity;
        total.fat += food.fat * food.quantity;
        total.fiber += food.fiber * food.quantity;
        return total;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const totalNutrition = getTotalNutrition();

  const getMealsByType = (type: string) => {
    return meals.filter(meal => meal.type === type);
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      case 'snack':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  const getMealTitle = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="diet-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-wrapper">
            <Link to="/landing" className="brand-logo">
              <FitFusionLogo width={40} height={40} />
              <span className="brand-text">Fit Fusion</span>
            </Link>
            
            <ul className="nav-menu">
              <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
              <li><Link to="/workout" className="nav-link">Workouts</Link></li>
              <li><Link to="/diet" className="nav-link active">Nutrition</Link></li>
              <li><Link to="/progress" className="nav-link">Progress</Link></li>
              <li><Link to="/contact" className="nav-link">Support</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="diet-container">
        <div className="container">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">Nutrition Tracker</h1>
              <p className="page-description">
                Track your daily nutrition intake and stay on top of your macro goals.
              </p>
            </div>
            <button
              onClick={() => setShowAddFood(true)}
              className="btn btn-primary btn-add-food"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add Food
            </button>
          </div>

          {/* Nutrition Overview */}
          <div className="nutrition-overview">
            <h2 className="section-title">Today's Nutrition</h2>
            <div className="nutrition-cards">
              <div className="nutrition-card calories">
                <div className="nutrition-header">
                  <div className="nutrition-icon">🔥</div>
                  <div className="nutrition-info">
                    <h3 className="nutrition-value">{Math.round(totalNutrition.calories)}</h3>
                    <p className="nutrition-label">Calories</p>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getProgressPercentage(totalNutrition.calories, nutritionGoals.calories)}%` }}
                  ></div>
                </div>
                <p className="nutrition-target">
                  {nutritionGoals.calories - Math.round(totalNutrition.calories)} remaining of {nutritionGoals.calories}
                </p>
              </div>

              <div className="nutrition-card protein">
                <div className="nutrition-header">
                  <div className="nutrition-icon">💪</div>
                  <div className="nutrition-info">
                    <h3 className="nutrition-value">{Math.round(totalNutrition.protein)}g</h3>
                    <p className="nutrition-label">Protein</p>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getProgressPercentage(totalNutrition.protein, nutritionGoals.protein)}%` }}
                  ></div>
                </div>
                <p className="nutrition-target">Goal: {nutritionGoals.protein}g</p>
              </div>

              <div className="nutrition-card carbs">
                <div className="nutrition-header">
                  <div className="nutrition-icon">🌾</div>
                  <div className="nutrition-info">
                    <h3 className="nutrition-value">{Math.round(totalNutrition.carbs)}g</h3>
                    <p className="nutrition-label">Carbs</p>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getProgressPercentage(totalNutrition.carbs, nutritionGoals.carbs)}%` }}
                  ></div>
                </div>
                <p className="nutrition-target">Goal: {nutritionGoals.carbs}g</p>
              </div>

              <div className="nutrition-card fat">
                <div className="nutrition-header">
                  <div className="nutrition-icon">🥑</div>
                  <div className="nutrition-info">
                    <h3 className="nutrition-value">{Math.round(totalNutrition.fat)}g</h3>
                    <p className="nutrition-label">Fat</p>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getProgressPercentage(totalNutrition.fat, nutritionGoals.fat)}%` }}
                  ></div>
                </div>
                <p className="nutrition-target">Goal: {nutritionGoals.fat}g</p>
              </div>
            </div>
          </div>

          {/* Meals Section */}
          <div className="meals-section">
            <h2 className="section-title">Today's Meals</h2>
            <div className="meals-grid">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                const mealData = getMealsByType(mealType);
                const mealNutrition = mealData.reduce((total, meal) => {
                  const nutrition = getMealNutrition(meal);
                  total.calories += nutrition.calories;
                  total.protein += nutrition.protein;
                  total.carbs += nutrition.carbs;
                  total.fat += nutrition.fat;
                  return total;
                }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

                return (
                  <div key={mealType} className="meal-card">
                    <div className="meal-header">
                      <div className="meal-info">
                        <span className="meal-icon">{getMealIcon(mealType)}</span>
                        <h3 className="meal-title">{getMealTitle(mealType)}</h3>
                      </div>
                      <div className="meal-calories">
                        {Math.round(mealNutrition.calories)} cal
                      </div>
                    </div>

                    <div className="meal-content">
                      {mealData.length > 0 ? (
                        <div className="food-items">
                          {mealData.map((meal) =>
                            meal.foods.map((food) => (
                              <div key={`${meal.id}-${food.id}`} className="food-item">
                                <div className="food-info">
                                  <span className="food-name">{food.name}</span>
                                  <span className="food-serving">
                                    {food.quantity} × {food.serving}
                                  </span>
                                </div>
                                <div className="food-calories">
                                  {Math.round(food.calories * food.quantity)} cal
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        <div className="empty-meal">
                          <p className="empty-text">No foods logged yet</p>
                          <button
                            onClick={() => {
                              setSelectedMealType(mealType as any);
                              setShowAddFood(true);
                            }}
                            className="btn btn-outline btn-small"
                          >
                            Add Food
                          </button>
                        </div>
                      )}
                    </div>

                    {mealData.length > 0 && (
                      <div className="meal-macros">
                        <div className="macro-item">
                          <span className="macro-label">P:</span>
                          <span className="macro-value">{Math.round(mealNutrition.protein)}g</span>
                        </div>
                        <div className="macro-item">
                          <span className="macro-label">C:</span>
                          <span className="macro-value">{Math.round(mealNutrition.carbs)}g</span>
                        </div>
                        <div className="macro-item">
                          <span className="macro-label">F:</span>
                          <span className="macro-value">{Math.round(mealNutrition.fat)}g</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Food Modal */}
          {showAddFood && (
            <div className="modal-overlay" onClick={() => setShowAddFood(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 className="modal-title">Add Food</h3>
                  <button
                    onClick={() => setShowAddFood(false)}
                    className="modal-close"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>

                <div className="modal-body">
                  <div className="meal-type-selector">
                    <label className="selector-label">Add to:</label>
                    <div className="meal-type-options">
                      {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedMealType(type as any)}
                          className={`meal-type-btn ${selectedMealType === type ? 'active' : ''}`}
                        >
                          {getMealIcon(type)} {getMealTitle(type)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="search-section">
                    <div className="search-input-wrapper">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="search-icon">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Search for foods..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                    </div>
                  </div>

                  <div className="food-list">
                    {filteredFoods.map((food) => (
                      <div key={food.id} className="food-search-item">
                        <div className="food-search-info">
                          <h4 className="food-search-name">{food.name}</h4>
                          <p className="food-search-details">
                            {food.calories} cal, {food.protein}g protein per {food.serving}
                          </p>
                        </div>
                        <button
                          onClick={() => addFoodToMeal(food)}
                          className="btn btn-primary btn-small"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .diet-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* Navigation (consistent with other components) */
        .navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: #1a1a1a;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #708d50, #5a7340);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 0;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          text-decoration: none;
          color: #4a4a4a;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .nav-link.active {
          color: #708d50;
          background: rgba(112, 141, 80, 0.1);
        }

        /* Main Container */
        .diet-container {
          padding: 2rem 0;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .page-description {
          font-size: 1.125rem;
          color: #6a6a6a;
        }

        .btn-add-food {
          padding: 0.875rem 1.75rem;
          font-size: 1rem;
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          box-shadow: 0 8px 20px rgba(112, 141, 80, 0.3);
        }

        .btn-primary:hover {
          box-shadow: 0 12px 30px rgba(112, 141, 80, 0.4);
        }

        .btn-outline {
          background: transparent;
          color: #708d50;
          border: 2px solid #708d50;
        }

        .btn-outline:hover {
          background: rgba(112, 141, 80, 0.05);
        }

        .btn-small {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        /* Nutrition Overview */
        .nutrition-overview {
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .nutrition-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .nutrition-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .nutrition-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .nutrition-card.calories {
          border-top: 4px solid #ef4444;
        }

        .nutrition-card.protein {
          border-top: 4px solid #10b981;
        }

        .nutrition-card.carbs {
          border-top: 4px solid #f59e0b;
        }

        .nutrition-card.fat {
          border-top: 4px solid #8b5cf6;
        }

        .nutrition-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .nutrition-icon {
          font-size: 2rem;
        }

        .nutrition-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .nutrition-label {
          font-size: 0.95rem;
          color: #6a6a6a;
          font-weight: 500;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #708d50, #5a7340);
          border-radius: 3px;
          transition: width 1s ease;
        }

        .nutrition-target {
          font-size: 0.875rem;
          color: #6a6a6a;
        }

        /* Meals Section */
        .meals-section {
          margin-bottom: 2rem;
        }

        .meals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .meal-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .meal-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .meal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .meal-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .meal-icon {
          font-size: 1.5rem;
        }

        .meal-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .meal-calories {
          font-size: 1rem;
          font-weight: 600;
          color: #708d50;
        }

        .meal-content {
          padding: 1.5rem;
          min-height: 120px;
        }

        .food-items {
          display: grid;
          gap: 0.75rem;
        }

        .food-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 12px;
        }

        .food-name {
          font-weight: 500;
          color: #1a1a1a;
          display: block;
          margin-bottom: 0.25rem;
        }

        .food-serving {
          font-size: 0.875rem;
          color: #6a6a6a;
        }

        .food-calories {
          font-weight: 600;
          color: #708d50;
        }

        .empty-meal {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100px;
          gap: 1rem;
        }

        .empty-text {
          color: #9ca3af;
          font-size: 0.95rem;
        }

        .meal-macros {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .macro-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
        }

        .macro-label {
          color: #6a6a6a;
          font-weight: 500;
        }

        .macro-value {
          color: #1a1a1a;
          font-weight: 600;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 2rem;
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          width: 100%;
          max-width: 600px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .modal-close:hover {
          background: #f3f4f6;
        }

        .modal-body {
          padding: 2rem;
          max-height: 60vh;
          overflow-y: auto;
        }

        .meal-type-selector {
          margin-bottom: 2rem;
        }

        .selector-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }

        .meal-type-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.75rem;
        }

        .meal-type-btn {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .meal-type-btn:hover {
          border-color: #cbd5e1;
        }

        .meal-type-btn.active {
          border-color: #708d50;
          background: rgba(112, 141, 80, 0.1);
          color: #708d50;
        }

        .search-section {
          margin-bottom: 1.5rem;
        }

        .search-input-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .search-input:focus {
          border-color: #708d50;
          box-shadow: 0 0 0 3px rgba(112, 141, 80, 0.1);
        }

        .food-list {
          display: grid;
          gap: 0.75rem;
          max-height: 300px;
          overflow-y: auto;
        }

        .food-search-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .food-search-item:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .food-search-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .food-search-details {
          font-size: 0.875rem;
          color: #6a6a6a;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .diet-container {
            padding: 1.5rem 0;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .nutrition-cards {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .meals-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .meal-type-options {
            grid-template-columns: repeat(2, 1fr);
          }

          .modal-overlay {
            padding: 1rem;
          }

          .modal-header,
          .modal-body {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DietTracker;
