import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { IconLogo } from '../components/IconLogo';
import {
  getNotificationSchedule,
  saveNotificationSchedule,
  requestNotificationPermission,
  sendWaterReminderNow,
  sendMealSuggestionNow,
  scheduleWaterReminder,
  scheduleMealSuggestion,
} from '../services/notificationService';

const NotificationSettingsScreen = () => {
  const [schedule, setSchedule] = useState({
    waterReminderHour: 7,
    waterReminderMinute: 0,
    mealSuggestionHour: 7,
    mealSuggestionMinute: 30,
    enabled: true,
  });
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    loadSettings();
    checkPermission();
  }, []);

  const loadSettings = async () => {
    const savedSchedule = await getNotificationSchedule();
    setSchedule(savedSchedule);
  };

  const checkPermission = async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      Alert.alert('Success', 'Notifications enabled!');
    } else {
      Alert.alert('Error', 'Please enable notifications in your device settings');
    }
  };

  const handleSave = async () => {
    await saveNotificationSchedule(schedule);
    await scheduleWaterReminder();
    await scheduleMealSuggestion();
    Alert.alert('Success', 'Notification settings saved!');
  };

  const handleTestWater = async () => {
    await sendWaterReminderNow();
    Alert.alert('Test Sent', 'Check your notifications!');
  };

  const handleTestMeal = async () => {
    await sendMealSuggestionNow();
    Alert.alert('Test Sent', 'Check your notifications!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconLogo type="notification" size={28} color="#708d50" />
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Manage your morning reminders
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Permission Status */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionHeader}>
            <Icon
              name={hasPermission ? 'check-circle' : 'alert-circle'}
              size={32}
              color={hasPermission ? '#4caf50' : '#ff6b6b'}
            />
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>
                {hasPermission ? 'Enabled' : 'Disabled'}
              </Text>
              <Text style={styles.permissionText}>
                {hasPermission
                  ? 'You will receive notifications'
                  : 'Enable to receive reminders'}
              </Text>
            </View>
          </View>
          {!hasPermission && (
            <TouchableOpacity
              style={styles.enableButton}
              onPress={handleEnableNotifications}
            >
              <Text style={styles.enableButtonText}>Enable Notifications</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Water Reminder */}
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <IconLogo type="water" size={32} color="#2196f3" />
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Morning Water Reminder</Text>
              <Text style={styles.settingDesc}>
                Get reminded to hydrate first thing in the morning
              </Text>
            </View>
          </View>
          <View style={styles.timeSelector}>
            <Text style={styles.timeLabel}>Time:</Text>
            <Text style={styles.timeValue}>
              {String(schedule.waterReminderHour).padStart(2, '0')}:
              {String(schedule.waterReminderMinute).padStart(2, '0')}
            </Text>
          </View>
          <TouchableOpacity style={styles.testButton} onPress={handleTestWater}>
            <Text style={styles.testButtonText}>Test Reminder</Text>
          </TouchableOpacity>
        </View>

        {/* Meal Suggestion */}
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <IconLogo type="food" size={32} color="#708d50" />
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Weather-Based Meal Suggestion</Text>
              <Text style={styles.settingDesc}>
                Get breakfast ideas based on today's weather
              </Text>
            </View>
          </View>
          <View style={styles.timeSelector}>
            <Text style={styles.timeLabel}>Time:</Text>
            <Text style={styles.timeValue}>
              {String(schedule.mealSuggestionHour).padStart(2, '0')}:
              {String(schedule.mealSuggestionMinute).padStart(2, '0')}
            </Text>
          </View>
          <TouchableOpacity style={styles.testButton} onPress={handleTestMeal}>
            <Text style={styles.testButtonText}>Test Suggestion</Text>
          </TouchableOpacity>
        </View>

        {/* Enable Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleInfo}>
            <IconLogo type="notification" size={32} color="#708d50" />
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>Enable All Notifications</Text>
              <Text style={styles.toggleDesc}>Turn all reminders on or off</Text>
            </View>
          </View>
          <Switch
            value={schedule.enabled}
            onValueChange={(value) =>
              setSchedule({ ...schedule, enabled: value })
            }
            trackColor={{ false: '#ccc', true: '#708d50' }}
            thumbColor="#fff"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <IconLogo type="checkmark" size={24} color="#708d50" />
            <Text style={styles.infoTitle}>How It Works</Text>
          </View>
          <Text style={styles.infoText}>
            • Water Reminder: Get notified every morning to drink water and start
            your day hydrated{'\n\n'}
            • Meal Suggestion: Receive personalized breakfast recommendations based
            on real-time weather{'\n\n'}
            • Smart Timing: Each notification is sent only once per day
          </Text>
        </View>
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
  permissionCard: {
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
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  permissionText: {
    fontSize: 14,
    color: '#666',
  },
  enableButton: {
    backgroundColor: '#708d50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  settingCard: {
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
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  settingIcon: {
    fontSize: 32,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#708d50',
  },
  testButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  toggleIcon: {
    fontSize: 32,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  toggleDesc: {
    fontSize: 12,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#708d50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: '#708d5015',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#708d50',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 22,
  },
});

export default NotificationSettingsScreen;
