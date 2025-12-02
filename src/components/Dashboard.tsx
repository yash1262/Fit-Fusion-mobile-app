import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import FitFusionLogo from './FitFusionLogo';
import { getTodayActivity, updateActivity, incrementActivity, subscribeToActivityUpdates } from '../services/activityTrackingService';
import MoodAdaptiveWorkout from './MoodAdaptiveWorkout';

interface ActivityData {
  steps: number;
  calories: number;
  activeMinutes: number;
  distance: number;
  hydration: number;
  sleep: number;
  workoutsCompleted: number;
  streak: number;
}

interface RecentActivity {
  id: string;
  type: 'workout' | 'meal' | 'achievement';
  title: string;
  description: string;
  time: string;
  duration?: string;
  calories?: number;
}

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  // Load activity data from localStorage on mount
  const loadActivityData = (uid: string): ActivityData => {
    try {
      const stored = localStorage.getItem('fitfusion_activity');
      if (stored) {
        const allData = JSON.parse(stored);
        const userKey = `user_${uid}`;
        if (allData[userKey]) {
          return allData[userKey];
        }
      }
    } catch (e) {
      console.error('Error loading activity data:', e);
    }
    return {
      steps: 0,
      calories: 0,
      activeMinutes: 0,
      distance: 0,
      hydration: 0,
      sleep: 0,
      workoutsCompleted: 0,
      streak: 1
    };
  };

  // Save activity data to localStorage
  const saveActivityData = (uid: string, data: ActivityData) => {
    try {
      const stored = localStorage.getItem('fitfusion_activity') || '{}';
      const allData = JSON.parse(stored);
      const userKey = `user_${uid}`;
      allData[userKey] = data;
      localStorage.setItem('fitfusion_activity', JSON.stringify(allData));
    } catch (e) {
      console.error('Error saving activity data:', e);
    }
  };

  // Get real-time activity data
  const [todayData, setTodayData] = useState<ActivityData>(() => {
    const activity = getTodayActivity();
    return {
      steps: activity.steps,
      calories: activity.calories,
      activeMinutes: activity.activeMinutes,
      distance: Number((activity.steps * 0.0008).toFixed(1)),
      hydration: activity.hydration,
      sleep: activity.sleep,
      workoutsCompleted: activity.workoutsCompleted,
      streak: 1
    };
  });

  // Subscribe to real-time activity updates
  useEffect(() => {
    const unsubscribe = subscribeToActivityUpdates((activity) => {
      setTodayData({
        steps: activity.steps,
        calories: activity.calories,
        activeMinutes: activity.activeMinutes,
        distance: Number((activity.steps * 0.0008).toFixed(1)),
        hydration: activity.hydration,
        sleep: activity.sleep,
        workoutsCompleted: activity.workoutsCompleted,
        streak: 1
      });
    });
    return () => unsubscribe();
  }, []);

  // Functions to update activity data
  const addSteps = (amount: number) => {
    incrementActivity('steps', amount);
    incrementActivity('calories', Math.round(amount * 0.04));
  };

  const addWater = () => {
    const newHydration = Math.min(todayData.hydration + 1, 12);
    updateActivity({ hydration: newHydration });
  };

  const removeWater = () => {
    const newHydration = Math.max(todayData.hydration - 1, 0);
    updateActivity({ hydration: newHydration });
  };

  const addActiveMinutes = (minutes: number) => {
    incrementActivity('activeMinutes', minutes);
    incrementActivity('calories', Math.round(minutes * 8));
    incrementActivity('workoutsCompleted', 1);
  };

  const completeWorkout = () => {
    setTodayData(prev => ({
      ...prev,
      workoutsCompleted: prev.workoutsCompleted + 1
    }));
  };

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'workout',
      title: 'Morning HIIT Session',
      description: 'High intensity cardio workout',
      time: '45 minutes ago',
      duration: '25 min',
      calories: 320
    },
    {
      id: '2',
      type: 'meal',
      title: 'Healthy Breakfast',
      description: 'Oatmeal with berries and almonds',
      time: '2 hours ago',
      calories: 450
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Weekly Goal Achieved!',
      description: 'Completed 4 workouts this week',
      time: '1 day ago'
    },
    {
      id: '4',
      type: 'workout',
      title: 'Evening Yoga',
      description: 'Relaxing yoga and meditation',
      time: 'Yesterday',
      duration: '30 min',
      calories: 120
    }
  ]);

  // Save activity data whenever it changes
  useEffect(() => {
    if (userId) {
      saveActivityData(userId, todayData);
    }
  }, [todayData, userId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUserName('');
        setUserId('');
        return;
      }
      
      setUserId(u.uid);
      
      // Load saved activity data
      const savedData = loadActivityData(u.uid);
      setTodayData(savedData);
      
      try {
        let name = u.displayName || '';
        if (!name) {
          const snap = await getDoc(doc(db, 'users', u.uid));
          name = (snap.exists() && (snap.data() as any)?.name) || '';
        }
        if (!name) {
          name = (u.email?.split('@')[0] || '').replace(/\./g, ' ');
        }
        const cap = name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
        setUserName(cap);
      } catch (e) {
        const fallback = (u.email?.split('@')[0] || '');
        const cap = fallback ? fallback.charAt(0).toUpperCase() + fallback.slice(1) : '';
        setUserName(cap);
      }
    });

    return () => {
      clearInterval(timer);
      unsub();
    };
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
          </svg>
        );
      case 'meal':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
          </svg>
        );
      case 'achievement':
        return <FitFusionLogo width={20} height={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-wrapper">
            <Link to="/landing" className="brand-logo">
              <FitFusionLogo width={40} height={40} />
              <span className="brand-text">Fit Fusion</span>
            </Link>
            
            <ul className="nav-menu">
              <li><Link to="/dashboard" className="nav-link active">Dashboard</Link></li>
              <li><Link to="/smart-workout" className="nav-link">🤖 AI Workout</Link></li>
              <li><Link to="/workout" className="nav-link">Workouts</Link></li>
              <li><Link to="/diet" className="nav-link">Nutrition</Link></li>
              <li><Link to="/progress" className="nav-link">Progress</Link></li>
              <li><Link to="/notifications" className="nav-link">🔔 Reminders</Link></li>
              <li><Link to="/contact" className="nav-link">Support</Link></li>
              <li className="nav-profile">
                <Link to="/profile" className="profile-avatar" title="View Profile">
                  <span>{userName.charAt(0)}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="dashboard-container">
        <div className="container">
          {/* Info Banner */}
          {todayData.steps === 0 && todayData.hydration === 0 && (
            <div className="info-banner">
              <span className="info-icon">💡</span>
              <p className="info-text">
                Start tracking your daily activities! Use the buttons below to log your steps, water intake, and active minutes.
              </p>
            </div>
          )}

          {/* Welcome Header */}
          <div className="dashboard-header">
            <div className="welcome-section">
              <h1 className="welcome-title">
                {getGreeting()}, {userName || 'there'}! 👋
              </h1>
              <p className="welcome-subtitle">
                Ready to crush your fitness goals today?
              </p>
            </div>
            <div className="date-section">
              <div className="current-date">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="current-time">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>

          {/* Mood-Adaptive Workout */}
          <MoodAdaptiveWorkout />

          {/* Notification Banner */}
          <Link to="/notifications" className="ai-workout-banner notification-banner">
            <div className="banner-icon">🔔</div>
            <div className="banner-content">
              <h3 className="banner-title">Morning Health Reminders</h3>
              <p className="banner-text">Get daily water reminders and weather-based meal suggestions every morning</p>
            </div>
            <div className="banner-arrow">→</div>
          </Link>

          {/* AI Smart Workout Banner */}
          <Link to="/smart-workout" className="ai-workout-banner">
            <div className="banner-icon">🤖</div>
            <div className="banner-content">
              <h3 className="banner-title">AI-Powered Smart Workout</h3>
              <p className="banner-text">Get personalized workout recommendations based on your sleep, stress, and activity levels</p>
            </div>
            <div className="banner-arrow">→</div>
          </Link>

          {/* Key Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-header">
                <div className="metric-icon steps-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.12 10H19l2.38-3.17C21.76 6.37 21.34 6 20.76 6H16L14.12 10zM9.09 10L12 7.09 14.91 10H12H9.09zM12 15c-1.66 0-3-1.34-3-3h1c0 1.1.9 2 2 2s2-.9 2-2h1c0 1.66-1.34 3-3 3z"/>
                  </svg>
                </div>
                <div className="metric-info">
                  <h3 className="metric-value">{todayData.steps.toLocaleString()}</h3>
                  <p className="metric-label">Steps Today</p>
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getProgressPercentage(todayData.steps, 10000)}%` }}
                ></div>
              </div>
              <p className="metric-subtitle">
                {todayData.steps >= 10000 
                  ? '🎉 Daily goal achieved!' 
                  : `${(10000 - todayData.steps).toLocaleString()} steps to reach daily goal`}
              </p>
            </div>

            <div className="metric-card secondary">
              <div className="metric-header">
                <div className="metric-icon calories-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
                  </svg>
                </div>
                <div className="metric-info">
                  <h3 className="metric-value">{todayData.calories.toLocaleString()}</h3>
                  <p className="metric-label">Calories Burned</p>
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getProgressPercentage(todayData.calories, 2500)}%` }}
                ></div>
              </div>
              <p className="metric-subtitle">
                {todayData.calories >= 2500 
                  ? 'Great work! Above daily target' 
                  : `${2500 - todayData.calories} calories to reach target`}
              </p>
            </div>

            <div className="metric-card accent">
              <div className="metric-header">
                <div className="metric-icon active-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="metric-info">
                  <h3 className="metric-value">{todayData.activeMinutes}</h3>
                  <p className="metric-label">Active Minutes</p>
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getProgressPercentage(todayData.activeMinutes, 60)}%` }}
                ></div>
              </div>
              <p className="metric-subtitle">
                {todayData.activeMinutes >= 60 
                  ? '🎯 Daily goal achieved!' 
                  : `${60 - todayData.activeMinutes} minutes to reach daily goal`}
              </p>
            </div>

            <div className="metric-card streak">
              <div className="metric-header">
                <div className="metric-icon streak-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </div>
                <div className="metric-info">
                  <h3 className="metric-value">{todayData.streak}</h3>
                  <p className="metric-label">Day Streak</p>
                </div>
              </div>
              <div className="streak-indicator">
                <span className="streak-text">🔥 On Fire!</span>
              </div>
              <p className="metric-subtitle">Amazing consistency! Keep it up!</p>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="secondary-metrics">
            <div className="secondary-metric interactive">
              <div className="secondary-icon">💧</div>
              <div className="secondary-info">
                <div className="secondary-value">{todayData.hydration}/8</div>
                <div className="secondary-label">Glasses of Water</div>
              </div>
              <div className="metric-controls">
                <button className="control-btn minus" onClick={removeWater} disabled={todayData.hydration === 0}>−</button>
                <button className="control-btn plus" onClick={addWater} disabled={todayData.hydration >= 12}>+</button>
              </div>
            </div>
            <div className="secondary-metric interactive">
              <div className="secondary-icon">🏃‍♂️</div>
              <div className="secondary-info">
                <div className="secondary-value">{todayData.steps.toLocaleString()}</div>
                <div className="secondary-label">Steps Today</div>
              </div>
              <div className="metric-controls">
                <button className="control-btn" onClick={() => addSteps(100)}>+100</button>
                <button className="control-btn" onClick={() => addSteps(1000)}>+1K</button>
              </div>
            </div>
            <div className="secondary-metric interactive">
              <div className="secondary-icon">⏱️</div>
              <div className="secondary-info">
                <div className="secondary-value">{todayData.activeMinutes} min</div>
                <div className="secondary-label">Active Minutes</div>
              </div>
              <div className="metric-controls">
                <button className="control-btn" onClick={() => addActiveMinutes(5)}>+5</button>
                <button className="control-btn" onClick={() => addActiveMinutes(15)}>+15</button>
              </div>
            </div>
            <div className="secondary-metric interactive">
              <div className="secondary-icon">💪</div>
              <div className="secondary-info">
                <div className="secondary-value">{todayData.workoutsCompleted}</div>
                <div className="secondary-label">Workouts Today</div>
              </div>
              <div className="metric-controls">
                <button className="control-btn plus" onClick={completeWorkout}>Complete</button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/workout" className="action-card primary-action">
                <div className="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
                  </svg>
                </div>
                <div className="action-content">
                  <h3 className="action-title">Start Workout</h3>
                  <p className="action-description">Begin your next training session</p>
                </div>
              </Link>

              <Link to="/diet" className="action-card secondary-action">
                <div className="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                  </svg>
                </div>
                <div className="action-content">
                  <h3 className="action-title">Log Meal</h3>
                  <p className="action-description">Track your nutrition intake</p>
                </div>
              </Link>

              <Link to="/progress" className="action-card accent-action">
                <div className="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                  </svg>
                </div>
                <div className="action-content">
                  <h3 className="action-title">View Progress</h3>
                  <p className="action-description">Check your fitness analytics</p>
                </div>
              </Link>

              <Link to="/ai-coach" className="action-card ai-coach-action">
                <div className="action-icon">
                  🤖
                </div>
                <div className="action-content">
                  <h3 className="action-title">AI Coach</h3>
                  <p className="action-description">Get personalized guidance and tips</p>
                </div>
              </Link>

              <Link to="/music" className="action-card music-action">
                <div className="action-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
                <div className="action-content">
                  <h3 className="action-title">Workout Music</h3>
                  <p className="action-description">Browse playlists for your workout</p>
                </div>
              </Link>

            </div>
          </div>

          {/* Recent Activities */}
          <div className="recent-activities">
            <div className="section-header">
              <h2 className="section-title">Recent Activities</h2>
              <Link to="/activity-history" className="view-all-link">View All</Link>
            </div>
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon-wrapper">
                    <div className={`activity-icon ${activity.type}-icon`}>
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="activity-details">
                    <h4 className="activity-title">{activity.title}</h4>
                    <p className="activity-description">{activity.description}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <div className="activity-metrics">
                    {activity.duration && (
                      <div className="activity-metric">
                        <span className="metric-icon">⏱️</span>
                        <span className="metric-text">{activity.duration}</span>
                      </div>
                    )}
                    {activity.calories && (
                      <div className="activity-metric">
                        <span className="metric-icon">🔥</span>
                        <span className="metric-text">{activity.calories} cal</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivational Widget */}
          <div className="motivation-widget">
            <div className="motivation-content">
              <h3 className="motivation-title">You're doing amazing! 🎉</h3>
              <p className="motivation-text">
                You're {Math.round(getProgressPercentage(todayData.steps, 10000))}% of the way to your daily step goal. 
                Every step counts towards a healthier you!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
          min-height: 100vh;

        }
          @media (max-width: 768px) {
          .actions-grid {
          grid-template-columns: 1fr;
          }
          }

          .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }


        .ai-coach-action .action-icon {
          background: linear-gradient(135deg, #8aa665, #708d50);
        }

        .music-action .action-icon {
          background: linear-gradient(135deg, #b0b1ab, #8aa665);
        }

        /* AI Workout Banner */
        .ai-workout-banner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: linear-gradient(135deg, #708d50, #5a7340);
          padding: 1.5rem 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          text-decoration: none;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(112, 141, 80, 0.3);
        }

        .ai-workout-banner:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(112, 141, 80, 0.4);
        }

        .banner-icon {
          font-size: 3rem;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .banner-content {
          flex: 1;
        }

        .banner-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .banner-text {
          font-size: 1rem;
          opacity: 0.9;
        }

        .banner-arrow {
          font-size: 2rem;
          font-weight: 700;
        }

        /* Notification Banner */
        .notification-banner {
          background: linear-gradient(135deg, #ff6b6b, #ee5a6f) !important;
          box-shadow: 0 8px 24px rgba(255, 107, 107, 0.3) !important;
        }

        .notification-banner:hover {
          box-shadow: 0 12px 32px rgba(255, 107, 107, 0.4) !important;
        }

        /* Navigation */
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

        .nav-link:hover {
          color: #708d50;
          background: rgba(112, 141, 80, 0.08);
        }

        .nav-profile {
          margin-left: 1rem;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #708d50, #5a7340);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .profile-avatar:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(112, 141, 80, 0.4);
        }

        /* Dashboard Container */
        .dashboard-container {
          padding: 2rem 0;
        }

        .info-banner {
          background: linear-gradient(135deg, #708d5015, #5a734015);
          border: 2px solid #708d50;
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          animation: slideDown 0.5s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .info-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .info-text {
          color: #1a1a1a;
          font-size: 0.95rem;
          font-weight: 500;
          margin: 0;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .welcome-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
          font-size: 1.125rem;
          color: #6a6a6a;
        }

        .date-section {
          text-align: right;
        }

        .current-date {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .current-time {
          font-size: 0.95rem;
          color: #6a6a6a;
          margin-top: 0.25rem;
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .metric-card.primary {
          border-top: 4px solid #708d50;
        }

        .metric-card.secondary {
          border-top: 4px solid #10b981;
        }

        .metric-card.accent {
          border-top: 4px solid #f59e0b;
        }

        .metric-card.streak {
          border-top: 4px solid #ef4444;
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .metric-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .steps-icon {
          background: linear-gradient(135deg, #708d50, #5a7340);
        }

        .calories-icon {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .active-icon {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .streak-icon {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .metric-label {
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

        .metric-subtitle {
          font-size: 0.875rem;
          color: #6a6a6a;
        }

        .streak-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }

        .streak-text {
          font-size: 0.95rem;
          font-weight: 600;
          color: #ef4444;
        }

        /* Secondary Metrics */
        .secondary-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .secondary-metric {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .secondary-metric:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .secondary-icon {
          font-size: 1.5rem;
        }

        .secondary-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .secondary-label {
          font-size: 0.875rem;
          color: #6a6a6a;
        }

        .secondary-metric.interactive {
          flex-wrap: wrap;
          position: relative;
        }

        .metric-controls {
          display: flex;
          gap: 0.5rem;
          margin-left: auto;
        }

        .control-btn {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 50px;
        }

        .control-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(112, 141, 80, 0.4);
        }

        .control-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .control-btn.minus {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .control-btn.minus:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .control-btn.plus {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .control-btn.plus:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        /* Quick Actions */
        .quick-actions {
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .action-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          text-decoration: none;
          color: #1a1a1a;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .action-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
          color: #1a1a1a;
        }

        .primary-action:hover {
          border-color: rgba(112, 141, 80, 0.3);
        }

        .secondary-action:hover {
          border-color: rgba(16, 185, 129, 0.3);
        }

        .accent-action:hover {
          border-color: rgba(245, 158, 11, 0.3);
        }

        .action-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .primary-action .action-icon {
          background: linear-gradient(135deg, #708d50, #5a7340);
        }

        .secondary-action .action-icon {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .accent-action .action-icon {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .action-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .action-description {
          font-size: 0.95rem;
          color: #6a6a6a;
        }

        /* Recent Activities */
        .recent-activities {
          margin-bottom: 2.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .view-all-link {
          color: #708d50;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        .activities-list {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-item:hover {
          background: #f8fafc;
        }

        .activity-icon-wrapper {
          flex-shrink: 0;
        }

        .activity-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .workout-icon {
          background: linear-gradient(135deg, #708d50, #5a7340);
        }

        .meal-icon {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .achievement-icon {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .activity-details {
          flex: 1;
        }

        .activity-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .activity-description {
          font-size: 0.875rem;
          color: #6a6a6a;
          margin-bottom: 0.25rem;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .activity-metrics {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          align-items: flex-end;
        }

        .activity-metric {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #6a6a6a;
        }

        .metric-icon {
          font-size: 0.875rem;
        }

        /* Motivation Widget */
        .motivation-widget {
          background: linear-gradient(135deg, #708d50, #5a7340);
          border-radius: 20px;
          padding: 2rem;
          color: white;
          text-align: center;
        }

        .motivation-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .motivation-text {
          font-size: 1.125rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .metrics-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .dashboard-container {
            padding: 1.5rem 0;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
            padding: 1.5rem;
          }

          .welcome-title {
            font-size: 1.875rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .secondary-metrics {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .action-card {
            padding: 1.5rem;
          }

          .activity-item {
            padding: 1rem;
          }

          .activity-metrics {
            display: none;
          }
        }
      `}</style>

      {/* Floating AI Chat Button */}
      <Link to="/ai-coach" className="floating-chat-btn" title="Chat with AI Coach">
        <div className="chat-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            <circle cx="12" cy="10" r="1.5"/>
            <circle cx="8" cy="10" r="1.5"/>
            <circle cx="16" cy="10" r="1.5"/>
          </svg>
        </div>
        <div className="chat-pulse"></div>
        <div className="chat-tooltip">Ask AI Coach 🤖</div>
      </Link>

      <style>{`
        .floating-chat-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #8aa665, #708d50);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(112, 141, 80, 0.4);
          cursor: pointer;
          z-index: 9999;
          transition: all 0.3s ease;
          text-decoration: none;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .floating-chat-btn:hover {
          transform: scale(1.1) translateY(-5px);
          box-shadow: 0 12px 32px rgba(112, 141, 80, 0.6);
        }

        .chat-icon {
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .chat-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #8aa665, #708d50);
          opacity: 0.6;
          animation: pulse 2s ease-out infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.3; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .chat-tooltip {
          position: absolute;
          right: 75px;
          background: #1a1a1a;
          color: white;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .chat-tooltip::after {
          content: '';
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid #1a1a1a;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
        }

        .floating-chat-btn:hover .chat-tooltip {
          opacity: 1;
          right: 80px;
        }

        .floating-chat-btn::before {
          content: '';
          position: absolute;
          top: 8px;
          right: 8px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @media (max-width: 768px) {
          .floating-chat-btn {
            width: 56px;
            height: 56px;
            bottom: 20px;
            right: 20px;
          }
          .chat-tooltip { display: none; }
        }
      `}</style>

    </div>
  );
};


export default Dashboard;
