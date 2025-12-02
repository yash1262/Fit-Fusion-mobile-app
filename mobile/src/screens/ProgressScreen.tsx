import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { IconLogo } from '../components/IconLogo';
import { getTodayActivity, getActivityHistory } from '../services/activityTrackingService';
import { getWeeklyStepStats } from '../services/stepTrackingService';
import { ProgressCharts } from '../components/ProgressCharts';
import { WeeklyComparison } from '../components/WeeklyComparison';
import { ErrorBoundary } from '../components/ErrorBoundary';

const screenWidth = Dimensions.get('window').width;

const ProgressScreen = () => {
  const [todayActivity, setTodayActivity] = useState<any>(null);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadData();
    
    // Refresh data every 10 seconds for real-time updates
    const interval = setInterval(() => {
      loadData();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const activity = await getTodayActivity();
      setTodayActivity(activity);

      const stats = await getWeeklyStepStats();
      setWeeklyStats(stats);

      const history = await getActivityHistory(90); // Get 90 days for heatmap
      setActivityHistory(history);
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.headerTitle}>Progress</Text>
            <IconLogo type="chart" size={28} color="#708d50" />
          </View>
          <TouchableOpacity onPress={loadData} style={styles.refreshButton}>
            <Icon name="refresh" size={24} color="#708d50" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Track your fitness journey • Updated {lastUpdate.toLocaleTimeString()}
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            colors={['#708d50']}
            tintColor="#708d50"
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#708d50" />
            <Text style={styles.loadingText}>Loading your progress...</Text>
          </View>
        ) : (
          <>
            {/* Today's Summary */}
            <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Today's Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Icon name="walk" size={32} color="#708d50" />
              <Text style={styles.summaryValue}>
                {todayActivity?.steps.toLocaleString() || 0}
              </Text>
              <Text style={styles.summaryLabel}>Steps</Text>
            </View>
            <View style={styles.summaryItem}>
              <Icon name="fire" size={32} color="#ff6b6b" />
              <Text style={styles.summaryValue}>
                {todayActivity?.calories || 0}
              </Text>
              <Text style={styles.summaryLabel}>Calories</Text>
            </View>
            <View style={styles.summaryItem}>
              <Icon name="clock-outline" size={32} color="#4caf50" />
              <Text style={styles.summaryValue}>
                {todayActivity?.activeMinutes || 0}
              </Text>
              <Text style={styles.summaryLabel}>Minutes</Text>
            </View>
            <View style={styles.summaryItem}>
              <Icon name="dumbbell" size={32} color="#2196f3" />
              <Text style={styles.summaryValue}>
                {todayActivity?.workoutsCompleted || 0}
              </Text>
              <Text style={styles.summaryLabel}>Workouts</Text>
            </View>
          </View>
        </View>

        {/* Charts */}
        {activityHistory.length > 0 && todayActivity && (
          <ErrorBoundary>
            <ProgressCharts
              activityHistory={activityHistory}
              todayActivity={todayActivity}
            />

            <WeeklyComparison activityHistory={activityHistory} />
          </ErrorBoundary>
        )}

        {/* Weekly Stats */}
        {weeklyStats && (
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Weekly Statistics</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Steps</Text>
              <Text style={styles.statValue}>
                {weeklyStats.totalSteps.toLocaleString()}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Daily Average</Text>
              <Text style={styles.statValue}>
                {weeklyStats.dailyAverage.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <Text style={styles.cardTitle}>Achievements 🏆</Text>
          <View style={styles.achievement}>
            <Text style={styles.achievementIcon}>🎯</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>First Workout</Text>
              <Text style={styles.achievementDesc}>Complete your first workout</Text>
            </View>
          </View>
          <View style={styles.achievement}>
            <Text style={styles.achievementIcon}>🔥</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>7 Day Streak</Text>
              <Text style={styles.achievementDesc}>Stay active for 7 days</Text>
            </View>
          </View>
          <View style={styles.achievement}>
            <Text style={styles.achievementIcon}>👟</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>10K Steps</Text>
              <Text style={styles.achievementDesc}>Reach 10,000 steps in a day</Text>
            </View>
          </View>
        </View>
          </>
        )}
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
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  achievementsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default ProgressScreen;
