import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { IconLogo } from '../components/IconLogo';
import { getTodayActivity, getActivityHistory } from '../services/activityTrackingService';
import { getWeeklyStepStats } from '../services/stepTrackingService';

const ProgressScreenSimple = () => {
  const [todayActivity, setTodayActivity] = useState<any>(null);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const activity = await getTodayActivity();
      setTodayActivity(activity);

      const stats = await getWeeklyStepStats();
      setWeeklyStats(stats);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.headerTitle}>Progress</Text>
          <IconLogo type="chart" size={28} color="#708d50" />
        </View>
        <Text style={styles.headerSubtitle}>Track your fitness journey</Text>
      </View>

      <ScrollView style={styles.content}>
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

            {/* Placeholder for Charts */}
            <View style={styles.chartPlaceholder}>
              <IconLogo type="chart" size={60} color="#ccc" />
              <Text style={styles.placeholderText}>Charts Coming Soon</Text>
              <Text style={styles.placeholderSubtext}>
                Visual graphs and analytics will appear here
              </Text>
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
  chartPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#708d50',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProgressScreenSimple;
