import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { IconLogo } from '../components/IconLogo';
import { getWeather } from '../services/weatherService';
import { getWeatherBasedMealSuggestions } from '../services/mealSuggestionService';
import ScreenHeader from '../components/ScreenHeader';

const DietScreen = () => {
  const [mealSuggestions, setMealSuggestions] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | 'all'>('all');

  useEffect(() => {
    loadMealSuggestions();
  }, []);

  useEffect(() => {
    if (weather) {
      filterMealsByType(selectedMealType);
    }
  }, [selectedMealType, weather]);

  const loadMealSuggestions = async () => {
    try {
      const weatherData = await getWeather();
      setWeather(weatherData);
      const suggestions = getWeatherBasedMealSuggestions(weatherData);
      setMealSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading meal suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMealsByType = (type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'all') => {
    if (!weather) return;
    
    if (type === 'all') {
      const suggestions = getWeatherBasedMealSuggestions(weather);
      setMealSuggestions(suggestions);
    } else {
      const suggestions = getWeatherBasedMealSuggestions(weather, type);
      setMealSuggestions(suggestions);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff' }}>
        <IconLogo type="food" size={32} color="#708d50" />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#1a1a1a' }}>Nutrition</Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Meal suggestions based on today's weather</Text>
        </View>
      </View>

      {weather && (
        <View style={styles.weatherBanner}>
          <Text style={styles.weatherIcon}>{weather.icon}</Text>
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherTemp}>{weather.temperature}°C</Text>
            <Text style={styles.weatherDesc}>{weather.description}</Text>
          </View>
        </View>
      )}

      {/* Meal Type Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterButton, selectedMealType === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedMealType('all')}
          >
            <Text style={[styles.filterButtonText, selectedMealType === 'all' && styles.filterButtonTextActive]}>
              All Meals
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, selectedMealType === 'breakfast' && styles.filterButtonActive]}
            onPress={() => setSelectedMealType('breakfast')}
          >
            <IconLogo type="sunrise" size={20} color={selectedMealType === 'breakfast' ? '#fff' : '#666'} />
            <Text style={[styles.filterButtonText, selectedMealType === 'breakfast' && styles.filterButtonTextActive]}>
              Breakfast
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, selectedMealType === 'lunch' && styles.filterButtonActive]}
            onPress={() => setSelectedMealType('lunch')}
          >
            <IconLogo type="sun" size={20} color={selectedMealType === 'lunch' ? '#fff' : '#666'} />
            <Text style={[styles.filterButtonText, selectedMealType === 'lunch' && styles.filterButtonTextActive]}>
              Lunch
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, selectedMealType === 'dinner' && styles.filterButtonActive]}
            onPress={() => setSelectedMealType('dinner')}
          >
            <IconLogo type="moon" size={20} color={selectedMealType === 'dinner' ? '#fff' : '#666'} />
            <Text style={[styles.filterButtonText, selectedMealType === 'dinner' && styles.filterButtonTextActive]}>
              Dinner
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, selectedMealType === 'snack' && styles.filterButtonActive]}
            onPress={() => setSelectedMealType('snack')}
          >
            <IconLogo type="cookie" size={20} color={selectedMealType === 'snack' ? '#fff' : '#666'} />
            <Text style={[styles.filterButtonText, selectedMealType === 'snack' && styles.filterButtonTextActive]}>
              Snacks
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {mealSuggestions.map((meal, index) => (
          <View key={index} style={styles.mealCard}>
            {meal.imageUrl && (
              <Image 
                source={{ uri: meal.imageUrl }} 
                style={styles.mealImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.mealContent}>
              <View style={styles.mealHeader}>
                <View style={styles.mealTitleContainer}>
                  <View style={styles.mealTitleRow}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <View style={styles.mealTypeBadge}>
                      <Text style={styles.mealTypeBadgeText}>
                        {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.mealDescription}>{meal.description}</Text>
                </View>
              </View>

            <View style={styles.macros}>
              <View style={styles.macroItem}>
                <Icon name="fire" size={16} color="#ff6b6b" />
                <Text style={styles.macroText}>{meal.calories} cal</Text>
              </View>
              <View style={styles.macroItem}>
                <Icon name="food-drumstick" size={16} color="#708d50" />
                <Text style={styles.macroText}>{meal.protein}g protein</Text>
              </View>
              <View style={styles.macroItem}>
                <Icon name="bread-slice" size={16} color="#f39c12" />
                <Text style={styles.macroText}>{meal.carbs}g carbs</Text>
              </View>
              <View style={styles.macroItem}>
                <Icon name="water" size={16} color="#3498db" />
                <Text style={styles.macroText}>{meal.fats}g fats</Text>
              </View>
            </View>

            <View style={styles.ingredients}>
              <Text style={styles.ingredientsTitle}>Ingredients:</Text>
              <Text style={styles.ingredientsList}>
                {meal.ingredients.join(', ')}
              </Text>
            </View>

              <View style={styles.benefits}>
                <Icon name="check-circle" size={16} color="#4caf50" />
                <Text style={styles.benefitsText}>{meal.benefits}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
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
  weatherBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#708d50',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    gap: 12,
  },
  weatherIcon: {
    fontSize: 40,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  weatherDesc: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  mealContent: {
    padding: 16,
  },
  mealHeader: {
    marginBottom: 12,
  },
  mealEmoji: {
    fontSize: 40,
  },
  mealTitleContainer: {
    flex: 1,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  mealTypeBadge: {
    backgroundColor: '#708d5020',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealTypeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#708d50',
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
  },
  macros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  macroText: {
    fontSize: 12,
    color: '#666',
  },
  ingredients: {
    marginBottom: 12,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  ingredientsList: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  benefits: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#4caf5015',
    padding: 12,
    borderRadius: 8,
  },
  benefitsText: {
    flex: 1,
    fontSize: 12,
    color: '#4caf50',
    lineHeight: 18,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#708d50',
    borderColor: '#708d50',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  filterEmoji: {
    fontSize: 16,
  },
});

export default DietScreen;
