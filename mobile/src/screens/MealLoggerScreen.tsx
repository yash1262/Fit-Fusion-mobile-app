import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../components/ScreenHeader';
import { IconLogo } from '../components/IconLogo';

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

const MealLoggerScreen = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showAddFood, setShowAddFood] = useState(false);

  const nutritionGoals = {
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
    { id: '9', name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, serving: '2 large', quantity: 1 },
    { id: '10', name: 'Oatmeal', calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, serving: '100g', quantity: 1 },
    { id: '11', name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, serving: '100g', quantity: 1 },
    { id: '12', name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, serving: '1/2 fruit', quantity: 1 },
    { id: '13', name: 'Protein Shake', calories: 120, protein: 24, carbs: 3, fat: 1, fiber: 0, serving: '1 scoop', quantity: 1 },
    { id: '14', name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, serving: '1 medium', quantity: 1 },
    { id: '15', name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, serving: '100g', quantity: 1 },
  ];

  const filteredFoods = foodDatabase.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFoodToMeal = (food: Food) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      type: selectedMealType,
      foods: [{ ...food, quantity: 1 }],
      timestamp: new Date(),
    };

    setMeals((prev) => [...prev, newMeal]);
    setShowAddFood(false);
    setSearchQuery('');
    Alert.alert('Success', `${food.name} added to ${selectedMealType}!`);
  };

  const removeMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  const getTotalNutrition = () => {
    return meals.reduce(
      (total, meal) => {
        meal.foods.forEach((food) => {
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

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'sunrise';
      case 'lunch':
        return 'sun';
      case 'dinner':
        return 'moon';
      case 'snack':
        return 'cookie';
      default:
        return 'food';
    }
  };

  const totalNutrition = getTotalNutrition();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff' }}>
        <IconLogo type="food" size={32} color="#708d50" />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#1a1a1a' }}>Meal Logger</Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Track your daily nutrition</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Daily Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Nutrition</Text>

          <View style={styles.macroGrid}>
            <View style={styles.macroCard}>
              <Icon name="fire" size={32} color="#ff6b6b" />
              <Text style={styles.macroValue}>{Math.round(totalNutrition.calories)}</Text>
              <Text style={styles.macroLabel}>Calories</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressPercentage(totalNutrition.calories, nutritionGoals.calories)}%`,
                      backgroundColor: '#ff6b6b',
                    },
                  ]}
                />
              </View>
              <Text style={styles.macroGoal}>Goal: {nutritionGoals.calories}</Text>
            </View>

            <View style={styles.macroCard}>
              <Icon name="food-drumstick" size={32} color="#708d50" />
              <Text style={styles.macroValue}>{Math.round(totalNutrition.protein)}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressPercentage(totalNutrition.protein, nutritionGoals.protein)}%`,
                      backgroundColor: '#708d50',
                    },
                  ]}
                />
              </View>
              <Text style={styles.macroGoal}>Goal: {nutritionGoals.protein}g</Text>
            </View>

            <View style={styles.macroCard}>
              <Icon name="bread-slice" size={32} color="#f39c12" />
              <Text style={styles.macroValue}>{Math.round(totalNutrition.carbs)}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressPercentage(totalNutrition.carbs, nutritionGoals.carbs)}%`,
                      backgroundColor: '#f39c12',
                    },
                  ]}
                />
              </View>
              <Text style={styles.macroGoal}>Goal: {nutritionGoals.carbs}g</Text>
            </View>

            <View style={styles.macroCard}>
              <Icon name="water" size={32} color="#3498db" />
              <Text style={styles.macroValue}>{Math.round(totalNutrition.fat)}g</Text>
              <Text style={styles.macroLabel}>Fats</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressPercentage(totalNutrition.fat, nutritionGoals.fat)}%`,
                      backgroundColor: '#3498db',
                    },
                  ]}
                />
              </View>
              <Text style={styles.macroGoal}>Goal: {nutritionGoals.fat}g</Text>
            </View>
          </View>
        </View>

        {/* Add Food Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddFood(true)}>
          <LinearGradient colors={['#708d50', '#5a7340']} style={styles.addButtonGradient}>
            <Icon name="plus-circle" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Food</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Meals List */}
        {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
          const mealsByType = meals.filter((m) => m.type === mealType);
          if (mealsByType.length === 0) return null;

          return (
            <View key={mealType} style={styles.mealSection}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <IconLogo type={getMealIcon(mealType) as any} size={24} color="#708d50" />
                <Text style={styles.mealSectionTitle}>
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </Text>
              </View>

              {mealsByType.map((meal) => {
                const nutrition = getMealNutrition(meal);
                return (
                  <View key={meal.id} style={styles.mealCard}>
                    <View style={styles.mealHeader}>
                      <View style={styles.mealInfo}>
                        {meal.foods.map((food, idx) => (
                          <Text key={idx} style={styles.foodName}>
                            • {food.name} ({food.serving})
                          </Text>
                        ))}
                      </View>
                      <TouchableOpacity onPress={() => removeMeal(meal.id)}>
                        <Icon name="delete" size={24} color="#ff6b6b" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.mealNutrition}>
                      <View style={styles.nutritionItem}>
                        <Icon name="fire" size={16} color="#ff6b6b" />
                        <Text style={styles.nutritionText}>{Math.round(nutrition.calories)} cal</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Icon name="food-drumstick" size={16} color="#708d50" />
                        <Text style={styles.nutritionText}>{Math.round(nutrition.protein)}g P</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Icon name="bread-slice" size={16} color="#f39c12" />
                        <Text style={styles.nutritionText}>{Math.round(nutrition.carbs)}g C</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Icon name="water" size={16} color="#3498db" />
                        <Text style={styles.nutritionText}>{Math.round(nutrition.fat)}g F</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}

        {meals.length === 0 && (
          <View style={styles.emptyState}>
            <IconLogo type="food" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No meals logged yet</Text>
            <Text style={styles.emptyText}>Tap "Add Food" to start tracking your nutrition</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Food Modal */}
      <Modal visible={showAddFood} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Food</Text>
              <TouchableOpacity onPress={() => setShowAddFood(false)}>
                <Icon name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Meal Type Selector */}
            <View style={styles.mealTypeSelector}>
              {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.mealTypeButton,
                    selectedMealType === type && styles.mealTypeButtonActive,
                  ]}
                  onPress={() => setSelectedMealType(type as any)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <IconLogo 
                      type={getMealIcon(type) as any} 
                      size={16} 
                      color={selectedMealType === type ? '#fff' : '#666'} 
                    />
                    <Text
                      style={[
                        styles.mealTypeButtonText,
                        selectedMealType === type && styles.mealTypeButtonTextActive,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search foods..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Food List */}
            <ScrollView style={styles.foodList}>
              {filteredFoods.map((food) => (
                <TouchableOpacity
                  key={food.id}
                  style={styles.foodItem}
                  onPress={() => addFoodToMeal(food)}
                >
                  <View style={styles.foodItemInfo}>
                    <Text style={styles.foodItemName}>{food.name}</Text>
                    <Text style={styles.foodItemServing}>{food.serving}</Text>
                  </View>
                  <View style={styles.foodItemNutrition}>
                    <Text style={styles.foodItemCalories}>{food.calories} cal</Text>
                    <Text style={styles.foodItemMacros}>
                      P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  macroCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginTop: 8,
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  macroGoal: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  addButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  mealSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  mealSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  mealCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  mealNutrition: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nutritionText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  mealTypeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  mealTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  mealTypeButtonActive: {
    backgroundColor: '#708d50',
  },
  mealTypeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  mealTypeButtonTextActive: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  foodList: {
    flex: 1,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 8,
  },
  foodItemInfo: {
    flex: 1,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  foodItemServing: {
    fontSize: 12,
    color: '#666',
  },
  foodItemNutrition: {
    alignItems: 'flex-end',
  },
  foodItemCalories: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff6b6b',
    marginBottom: 4,
  },
  foodItemMacros: {
    fontSize: 10,
    color: '#666',
  },
});

export default MealLoggerScreen;
