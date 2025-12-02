import React, { useState, useEffect } from 'react';
import {
  getNotificationSchedule,
  saveNotificationSchedule,
  requestNotificationPermission,
  testNotifications,
  sendWaterReminder,
  sendMealSuggestion
} from '../services/notificationService';

const NotificationSettings: React.FC = () => {
  const [schedule, setSchedule] = useState(getNotificationSchedule());
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check notification permission status
    if (typeof Notification !== 'undefined') {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationPermission('granted');
      alert('✅ Notifications enabled! You will receive morning reminders.');
    } else {
      alert('❌ Notification permission denied. Please enable it in your browser settings.');
    }
  };

  const handleSave = () => {
    saveNotificationSchedule(schedule);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestWater = async () => {
    await sendWaterReminder();
    alert('💧 Water reminder sent! Check your notifications.');
  };

  const handleTestMeal = async () => {
    await sendMealSuggestion();
    alert('🍽️ Meal suggestion sent! Check your notifications.');
  };

  return (
    <div className="notification-settings">
      <div className="settings-header">
        <h2>🔔 Notification Settings</h2>
        <p className="settings-subtitle">
          Get personalized morning reminders to stay healthy
        </p>
      </div>

      {/* Permission Status */}
      <div className="permission-status">
        <div className="status-card">
          <div className="status-icon">
            {notificationPermission === 'granted' ? '✅' : '⚠️'}
          </div>
          <div className="status-info">
            <h3>Notification Permission</h3>
            <p className="status-text">
              {notificationPermission === 'granted'
                ? 'Enabled - You will receive notifications'
                : notificationPermission === 'denied'
                ? 'Blocked - Please enable in browser settings'
                : 'Not enabled - Click below to enable'}
            </p>
          </div>
          {notificationPermission !== 'granted' && (
            <button className="enable-btn" onClick={handleEnableNotifications}>
              Enable Notifications
            </button>
          )}
        </div>
      </div>

      {/* Schedule Settings */}
      <div className="schedule-settings">
        <div className="setting-card">
          <div className="setting-header">
            <div className="setting-icon">💧</div>
            <div className="setting-info">
              <h3>Morning Water Reminder</h3>
              <p>Get reminded to hydrate first thing in the morning</p>
            </div>
          </div>
          <div className="setting-control">
            <label className="time-label">Reminder Time:</label>
            <input
              type="time"
              value={schedule.waterReminder}
              onChange={(e) =>
                setSchedule({ ...schedule, waterReminder: e.target.value })
              }
              className="time-input"
            />
          </div>
          <button className="test-btn" onClick={handleTestWater}>
            Test Water Reminder
          </button>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <div className="setting-icon">🍽️</div>
            <div className="setting-info">
              <h3>Weather-Based Meal Suggestion</h3>
              <p>Get breakfast ideas based on today's weather</p>
            </div>
          </div>
          <div className="setting-control">
            <label className="time-label">Suggestion Time:</label>
            <input
              type="time"
              value={schedule.mealSuggestion}
              onChange={(e) =>
                setSchedule({ ...schedule, mealSuggestion: e.target.value })
              }
              className="time-input"
            />
          </div>
          <button className="test-btn" onClick={handleTestMeal}>
            Test Meal Suggestion
          </button>
        </div>

        <div className="setting-card toggle-card">
          <div className="setting-header">
            <div className="setting-icon">🔔</div>
            <div className="setting-info">
              <h3>Enable All Notifications</h3>
              <p>Turn all morning reminders on or off</p>
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={schedule.enabled}
              onChange={(e) =>
                setSchedule({ ...schedule, enabled: e.target.checked })
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="settings-actions">
        <button
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? '✅ Saved!' : 'Save Settings'}
        </button>
      </div>

      {/* Info Box */}
      <div className="info-box">
        <h4>📱 How It Works</h4>
        <ul>
          <li>
            <strong>Water Reminder:</strong> Every morning at your chosen time,
            you'll get a notification to drink water and start your day hydrated
          </li>
          <li>
            <strong>Meal Suggestion:</strong> Based on real-time weather data,
            you'll receive personalized breakfast recommendations (hot meals for
            cold days, cooling foods for hot weather, etc.)
          </li>
          <li>
            <strong>Smart Timing:</strong> Each notification is sent only once
            per day to avoid spam
          </li>
        </ul>
      </div>

      <style>{`
        .notification-settings {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .settings-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .settings-header h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .settings-subtitle {
          color: #666;
          font-size: 1rem;
        }

        .permission-status {
          margin-bottom: 2rem;
        }

        .status-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .status-info {
          flex: 1;
        }

        .status-info h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: #1a1a1a;
        }

        .status-text {
          color: #666;
          font-size: 0.95rem;
          margin: 0;
        }

        .enable-btn {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .enable-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(112, 141, 80, 0.3);
        }

        .schedule-settings {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .setting-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .setting-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .setting-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .setting-info h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: #1a1a1a;
        }

        .setting-info p {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
        }

        .setting-control {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .time-label {
          font-weight: 600;
          color: #1a1a1a;
        }

        .time-input {
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          transition: all 0.3s ease;
        }

        .time-input:focus {
          outline: none;
          border-color: #708d50;
          box-shadow: 0 0 0 3px rgba(112, 141, 80, 0.1);
        }

        .test-btn {
          background: #f0f0f0;
          color: #1a1a1a;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .test-btn:hover {
          background: #e0e0e0;
        }

        .toggle-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .toggle-card .setting-header {
          margin-bottom: 0;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
          flex-shrink: 0;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 34px;
        }

        .toggle-slider:before {
          position: absolute;
          content: '';
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        .toggle-switch input:checked + .toggle-slider {
          background: linear-gradient(135deg, #708d50, #5a7340);
        }

        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .settings-actions {
          text-align: center;
          margin-bottom: 2rem;
        }

        .save-btn {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          border: none;
          padding: 1rem 3rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(112, 141, 80, 0.3);
        }

        .save-btn.saved {
          background: #4caf50;
        }

        .save-btn:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }

        .info-box {
          background: linear-gradient(135deg, #708d5015, #5a734015);
          border: 2px solid #708d50;
          border-radius: 16px;
          padding: 1.5rem;
        }

        .info-box h4 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .info-box ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-box li {
          padding: 0.75rem 0;
          color: #1a1a1a;
          line-height: 1.6;
        }

        .info-box li:not(:last-child) {
          border-bottom: 1px solid rgba(112, 141, 80, 0.2);
        }

        .info-box strong {
          color: #708d50;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .notification-settings {
            padding: 1rem;
          }

          .status-card {
            flex-direction: column;
            text-align: center;
          }

          .setting-control {
            flex-direction: column;
            align-items: flex-start;
          }

          .toggle-card {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationSettings;
