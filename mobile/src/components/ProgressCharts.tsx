import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import { IconLogo } from './IconLogo';

const screenWidth = Dimensions.get('window').width;

interface ProgressChartsProps {
  activityHistory: any[];
  todayActivity: any;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  activityHistory,
  todayActivity,
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
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#708d50',
    },
  };

  const getStepsChartData = () => {
    if (!activityHistory.length) {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ data: [1, 1, 1, 1, 1, 1, 1] }], // Use 1 instead of 0 to avoid chart errors
      };
    }

    const last7Days = activityHistory.slice(0, 7);
    const labels = last7Days.slice().reverse().map((day) => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const data = last7Days.slice().reverse().map((day) => Math.max(day.steps || 0, 1)); // Ensure minimum value of 1

    return {
      labels,
      datasets: [{ data }],
    };
  };

  const getCaloriesChartData = () => {
    if (!activityHistory.length) {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ data: [1, 1, 1, 1, 1, 1, 1] }], // Use 1 instead of 0 to avoid chart errors
      };
    }

    const last7Days = activityHistory.slice(0, 7);
    const labels = last7Days.slice().reverse().map((day) => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const data = last7Days.slice().reverse().map((day) => Math.max(day.calories || 0, 1)); // Ensure minimum value of 1

    return {
      labels,
      datasets: [{ data }],
    };
  };

  const getActivityPieData = () => {
    const steps = Math.max(todayActivity?.steps || 0, 1);
    const calories = Math.max(todayActivity?.calories || 0, 1);
    const activeMinutes = Math.max(todayActivity?.activeMinutes || 0, 1);

    return [
      {
        name: 'Steps',
        population: steps,
        color: '#708d50',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Calories',
        population: calories,
        color: '#ff6b6b',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Minutes',
        population: activeMinutes * 10,
        color: '#4caf50',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
    ];
  };

  const getGoalsProgressData = () => {
    const stepsGoal = 10000;
    const caloriesGoal = 500;
    const activeMinutesGoal = 30;
    const hydrationGoal = 8;

    return {
      labels: ['Steps', 'Calories', 'Minutes', 'Water'],
      data: [
        Math.min((todayActivity?.steps || 0) / stepsGoal, 1),
        Math.min((todayActivity?.calories || 0) / caloriesGoal, 1),
        Math.min((todayActivity?.activeMinutes || 0) / activeMinutesGoal, 1),
        Math.min((todayActivity?.hydration || 0) / hydrationGoal, 1),
      ],
    };
  };

  return (
    <>
      {/* Steps Line Chart */}
      <View style={styles.chartCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <IconLogo type="shoe" size={24} color="#708d50" />
          <Text style={styles.cardTitle}>Steps This Week</Text>
        </View>
        <LineChart
          data={getStepsChartData()}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
        />
      </View>

      {/* Calories Bar Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>Calories Burned 🔥</Text>
        <BarChart
          data={getCaloriesChartData()}
          width={screenWidth - 64}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
          }}
          style={styles.chart}
          showValuesOnTopOfBars={true}
          withInnerLines={false}
        />
      </View>

      {/* Goals Progress Ring Chart */}
      <View style={styles.chartCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <IconLogo type="target" size={24} color="#708d50" />
          <Text style={styles.cardTitle}>Today's Goals Progress</Text>
        </View>
        <ProgressChart
          data={getGoalsProgressData()}
          width={screenWidth - 64}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1, index) => {
              const colors = [
                `rgba(112, 141, 80, ${opacity})`,
                `rgba(255, 107, 107, ${opacity})`,
                `rgba(76, 175, 80, ${opacity})`,
                `rgba(33, 150, 243, ${opacity})`,
              ];
              return colors[index || 0];
            },
          }}
          hideLegend={false}
          style={styles.chart}
        />
      </View>

      {/* Activity Distribution Pie Chart */}
      <View style={styles.chartCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <IconLogo type="chart" size={24} color="#708d50" />
          <Text style={styles.cardTitle}>Today's Activity Distribution</Text>
        </View>
        <PieChart
          data={getActivityPieData()}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
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
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
