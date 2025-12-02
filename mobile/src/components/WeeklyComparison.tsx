import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { StackedBarChart, ContributionGraph } from 'react-native-chart-kit';
import { IconLogo } from './IconLogo';

const screenWidth = Dimensions.get('window').width;

interface WeeklyComparisonProps {
  activityHistory: any[];
}

export const WeeklyComparison: React.FC<WeeklyComparisonProps> = ({
  activityHistory,
}) => {
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(112, 141, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const getStackedBarData = () => {
    if (!activityHistory.length) {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        legend: ['Steps', 'Calories', 'Minutes'],
        data: [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        barColors: ['#708d50', '#ff6b6b', '#4caf50'],
      };
    }

    const last7Days = activityHistory.slice(0, 7);
    const labels = last7Days.slice().reverse().map((day) => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const data = last7Days.slice().reverse().map((day) => [
      Math.max((day.steps || 0) / 100, 1), // Scale down for visibility, min 1
      Math.max(day.calories || 0, 1),
      Math.max((day.activeMinutes || 0) * 10, 1), // Scale up for visibility, min 1
    ]);

    return {
      labels,
      legend: ['Steps (÷100)', 'Calories', 'Minutes (×10)'],
      data,
      barColors: ['#708d50', '#ff6b6b', '#4caf50'],
    };
  };

  const getContributionData = () => {
    // Generate last 90 days of data
    const data = [];
    const today = new Date();

    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Find matching activity or use 0
      const activity = activityHistory.find((a) => a.date === dateStr);
      const steps = activity?.steps || 0;

      // Calculate contribution level (0-4)
      let count = 0;
      if (steps > 0) count = 1;
      if (steps > 2500) count = 2;
      if (steps > 5000) count = 3;
      if (steps > 7500) count = 4;

      data.push({
        date: dateStr,
        count,
      });
    }

    return data;
  };

  return (
    <>
      {/* Stacked Bar Chart */}
      <View style={styles.chartCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <IconLogo type="chart" size={24} color="#708d50" />
          <Text style={styles.cardTitle}>Weekly Activity Breakdown</Text>
        </View>
        <Text style={styles.subtitle}>
          Combined view of steps, calories, and active minutes
        </Text>
        <StackedBarChart
          data={getStackedBarData()}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      {/* Contribution Graph (Activity Heatmap) */}
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>Activity Heatmap 🔥</Text>
        <Text style={styles.subtitle}>
          Your activity consistency over the last 90 days
        </Text>
        <ContributionGraph
          values={getContributionData()}
          endDate={new Date()}
          numDays={90}
          width={screenWidth - 64}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(112, 141, 80, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chartCard: {
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
