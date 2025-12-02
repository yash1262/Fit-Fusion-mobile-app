import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { IconLogo } from '../components/IconLogo';
import { HeartLogo } from '../components/HeartLogo';
import {
  getTodayActivity,
  updateActivity,
  incrementActivity,
  subscribeToActivityUpdates,
} from '../services/activityTrackingService';
import { getStepTrackingStatus } from '../services/stepTrackingService';

interface ActivityData {
  steps: number;
  calories: number;
  activeMinutes: number;
  hydration: number;
  workoutsCompleted: number;
  sleep: number;
  stress: number;
  mood: number;
}

const DashboardScreen = ({ navigation }: any) => {
  const [todayData, setTodayData] = useState<ActivityData>({
    steps: 0,
    calories: 0,
    activeMinutes: 0,
    hydration: 0,
    workoutsCompleted: 0,
    sleep: 7,
    stress: 5,
    mood: 7,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [stepTrackingEnabled, setStepTrackingEnabled] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToActivityUpdates((activity) => {
      setTodayData({
        steps: activity.steps,
        calories: activity.calories,
        activeMinutes: activity.activeMinutes,
        hydration: activity.hydration,
        workoutsCompleted: activity.workoutsCompleted,
        sleep: activity.sleep,
        stress: activity.stress,
        mood: activity.mood,
      });
    });

    return () => unsubscribe();
  }, []);

  // Check step tracking status
  useEffect(() => {
    checkStepTracking();
  }, []);

  const loadData = async () => {
    const activity = await getTodayActivity();
    setTodayData({
      steps: activity.steps,
      calories: activity.calories,
      activeMinutes: activity.activeMinutes,
      hydration: activity.hydration,
      workoutsCompleted: activity.workoutsCompleted,
      sleep: activity.sleep,
      stress: activity.stress,
      mood: activity.mood,
    });
  };

  const checkStepTracking = async () => {
    const status = await getStepTrackingStatus();
    setStepTrackingEnabled(status.isTracking);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    await checkStepTracking();
    setRefreshing(false);
  };

  const addWater = async () => {
    const newHydration = Math.min(todayData.hydration + 1, 12);
    await updateActivity({ hydration: newHydration });
  };

  const removeWater = async () => {
    const newHydration = Math.max(todayData.hydration - 1, 0);
    await updateActivity({ hydration: newHydration });
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.greeting}>{getGreeting()}!</Text>
            <HeartLogo size={32} color="#708d50" />
          </View>
          <Text style={styles.subtitle}>Ready to crush your fitness goals?</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.profileButton}
        >
          <Icon name="account-circle" size={40} color="#708d50" />
        </TouchableOpacity>
      </View>

      {/* Step Tracking Status */}
      {stepTrackingEnabled && (
        <View style={styles.trackingBanner}>
          <Icon name="walk" size={24} color="#fff" />
          <Text style={styles.trackingText}>
            Real-time step tracking active
          </Text>
          <IconLogo type="target" size={20} color="#fff" />
        </View>
      )}

      {/* Notification Banner */}
      <TouchableOpacity
        style={styles.notificationBanner}
        onPress={() => navigation.navigate('NotificationSettings')}
      >
        <LinearGradient
          colors={['#ff6b6b', '#ee5a6f']}
          style={styles.bannerGradient}
        >
          <IconLogo type="notification" size={32} color="#fff" />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Morning Health Reminders</Text>
            <Text style={styles.bannerText}>
              Get daily water reminders and meal suggestions
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        {/* Steps */}
        <View style={[styles.metricCard, styles.primaryCard]}>
          <View style={styles.metricHeader}>
            <Icon name="walk" size={32} color="#708d50" />
            <View style={styles.metricInfo}>
              <Text style={styles.metricValue}>
                {todayData.steps.toLocaleString()}
              </Text>
              <Text style={styles.metricLabel}>Steps Today</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${getProgressPercentage(todayData.steps, 10000)}%`,
                  backgroundColor: '#708d50',
                },
              ]}
            />
          </View>
          <Text style={styles.metricSubtitle}>
            {todayData.steps >= 10000
              ? '🎉 Daily goal achieved!'
              : `${(10000 - todayData.steps).toLocaleString()} steps to goal`}
          </Text>
        </View>

        {/* Calories */}
        <View style={[styles.metricCard, styles.secondaryCard]}>
          <View style={styles.metricHeader}>
            <Icon name="fire" size={32} color="#ff6b6b" />
            <View style={styles.metricInfo}>
              <Text style={styles.metricValue}>
                {todayData.calories.toLocaleString()}
              </Text>
              <Text style={styles.metricLabel}>Calories Burned</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${getProgressPercentage(todayData.calories, 2500)}%`,
                  backgroundColor: '#ff6b6b',
                },
              ]}
            />
          </View>
        </View>

        {/* Active Minutes */}
        <View style={[styles.metricCard, styles.accentCard]}>
          <View style={styles.metricHeader}>
            <Icon name="clock-outline" size={32} color="#4caf50" />
            <View style={styles.metricInfo}>
              <Text style={styles.metricValue}>{todayData.activeMinutes}</Text>
              <Text style={styles.metricLabel}>Active Minutes</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${getProgressPercentage(todayData.activeMinutes, 60)}%`,
                  backgroundColor: '#4caf50',
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Activity Rings */}
      <View style={styles.activityRingsCard}>
        <Text style={styles.activityRingsTitle}>Activity Rings</Text>
        <View style={styles.ringsContainer}>
          {/* Steps Ring */}
          <View style={styles.ringWrapper}>
            <View style={styles.ringContainer}>
              <View style={styles.ringBackground}>
                <View
                  style={[
                    styles.ringProgress,
                    {
                      borderColor: '#FF006E',
                      borderWidth: 8,
                      transform: [
                        {
                          rotate: `${(getProgressPercentage(todayData.steps, 10000) * 3.6).toFixed(0)}deg`,
                        },
                      ],
                    },
                  ]}
                />
              </View>
              <View style={styles.ringCenter}>
                <Icon name="walk" size={24} color="#FF006E" />
                <Text style={styles.ringValue}>{todayData.steps}</Text>
                <Text style={styles.ringLabel}>Steps</Text>
              </View>
            </View>
            <View style={styles.ringInfo}>
              <Text style={styles.ringPercentage}>
                {Math.round(getProgressPercentage(todayData.steps, 10000))}%
              </Text>
              <Text style={styles.ringGoal}>Goal: 10,000</Text>
            </View>
          </View>

          {/* Calories Ring */}
          <View style={styles.ringWrapper}>
            <View style={styles.ringContainer}>
              <View style={styles.ringBackground}>
                <View
                  style={[
                    styles.ringProgress,
                    {
                      borderColor: '#FFBE0B',
                      borderWidth: 8,
                      transform: [
                        {
                          rotate: `${(getProgressPercentage(todayData.calories, 2500) * 3.6).toFixed(0)}deg`,
                        },
                      ],
                    },
                  ]}
                />
              </View>
              <View style={styles.ringCenter}>
                <Icon name="fire" size={24} color="#FFBE0B" />
                <Text style={styles.ringValue}>{todayData.calories}</Text>
                <Text style={styles.ringLabel}>Calories</Text>
              </View>
            </View>
            <View style={styles.ringInfo}>
              <Text style={styles.ringPercentage}>
                {Math.round(getProgressPercentage(todayData.calories, 2500))}%
              </Text>
              <Text style={styles.ringGoal}>Goal: 2,500</Text>
            </View>
          </View>

          {/* Active Minutes Ring */}
          <View style={styles.ringWrapper}>
            <View style={styles.ringContainer}>
              <View style={styles.ringBackground}>
                <View
                  style={[
                    styles.ringProgress,
                    {
                      borderColor: '#8338EC',
                      borderWidth: 8,
                      transform: [
                        {
                          rotate: `${(getProgressPercentage(todayData.activeMinutes, 60) * 3.6).toFixed(0)}deg`,
                        },
                      ],
                    },
                  ]}
                />
              </View>
              <View style={styles.ringCenter}>
                <Icon name="clock-outline" size={24} color="#8338EC" />
                <Text style={styles.ringValue}>{todayData.activeMinutes}</Text>
                <Text style={styles.ringLabel}>Minutes</Text>
              </View>
            </View>
            <View style={styles.ringInfo}>
              <Text style={styles.ringPercentage}>
                {Math.round(getProgressPercentage(todayData.activeMinutes, 60))}%
              </Text>
              <Text style={styles.ringGoal}>Goal: 60</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Hydration Tracker */}
      <View style={styles.hydrationCard}>
        <View style={styles.hydrationHeader}>
          <Icon name="water" size={32} color="#2196f3" />
          <Text style={styles.hydrationTitle}>
            Water Intake: {todayData.hydration}/8 glasses
          </Text>
        </View>
        <View style={styles.hydrationControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.minusButton]}
            onPress={removeWater}
            disabled={todayData.hydration === 0}
          >
            <Icon name="minus" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.waterGlasses}>
            {[...Array(8)].map((_, i) => (
              <Icon
                key={i}
                name={i < todayData.hydration ? 'cup-water' : 'cup-outline'}
                size={28}
                color={i < todayData.hydration ? '#2196f3' : '#ccc'}
              />
            ))}
          </View>
          <TouchableOpacity
            style={[styles.controlButton, styles.plusButton]}
            onPress={addWater}
            disabled={todayData.hydration >= 12}
          >
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('SmartWorkout')}
          >
            <LinearGradient
              colors={['#708d50', '#5a7340']}
              style={styles.actionGradient}
            >
              <IconLogo type="robot" size={32} color="#fff" />
              <Text style={styles.actionTitle}>AI Workout</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Workout')}
          >
            <LinearGradient
              colors={['#ff6b6b', '#ee5a6f']}
              style={styles.actionGradient}
            >
              <IconLogo type="workout" size={32} color="#fff" />
              <Text style={styles.actionTitle}>Start Workout</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('MealLogger')}
          >
            <LinearGradient
              colors={['#4caf50', '#45a049']}
              style={styles.actionGradient}
            >
              <IconLogo type="food" size={32} color="#fff" />
              <Text style={styles.actionTitle}>Log Meals</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AiCoach')}
          >
            <LinearGradient
              colors={['#2196f3', '#1976d2']}
              style={styles.actionGradient}
            >
              <IconLogo type="robot" size={32} color="#fff" />
              <Text style={styles.actionTitle}>AI Coach</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('MusicPlaylist')}
          >
            <LinearGradient
              colors={['#9c27b0', '#7b1fa2']}
              style={styles.actionGradient}
            >
              <IconLogo type="music" size={32} color="#fff" />
              <Text style={styles.actionTitle}>Music Playlists</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Diet')}
          >
            <LinearGradient
              colors={['#ff9800', '#f57c00']}
              style={styles.actionGradient}
            >
              <IconLogo type="weather" size={32} color="#fff" />
              <Text style={styles.actionTitle}>Meal Suggestions</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
  },
  trackingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#708d50',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    gap: 8,
  },
  trackingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  bannerIcon: {
    fontSize: 32,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  metricsGrid: {
    padding: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCard: {},
  secondaryCard: {},
  accentCard: {},
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  metricInfo: {
    flex: 1,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  hydrationCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hydrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  hydrationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  hydrationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusButton: {
    backgroundColor: '#ff6b6b',
  },
  plusButton: {
    backgroundColor: '#4caf50',
  },
  waterGlasses: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  activityRingsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activityRingsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  ringsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  ringWrapper: {
    alignItems: 'center',
    gap: 12,
  },
  ringContainer: {
    width: 100,
    height: 100,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    position: 'absolute',
  },
  ringProgress: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: '#FF006E',
    borderRightColor: '#FF006E',
    position: 'absolute',
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  ringValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a1a',
    marginTop: 4,
  },
  ringLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  ringInfo: {
    alignItems: 'center',
  },
  ringPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  ringGoal: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});

export default DashboardScreen;
