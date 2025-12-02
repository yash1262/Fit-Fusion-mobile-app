import React, { useState } from 'react';
import FitFusionLogo from "./FitFusionLogo";
import { Link } from 'react-router-dom';

interface ProgressData {
  date: string;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  steps: number;
  calories: number;
  workouts: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
  category: 'workout' | 'nutrition' | 'consistency' | 'milestone';
}

const ProgressAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'body' | 'achievements'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | '3months' | 'year'>('month');

  // Mock progress data - in real app this would come from API
  const progressData: ProgressData[] = [
    { date: '2025-08-01', weight: 75.2, bodyFat: 18.5, muscleMass: 35.2, steps: 8500, calories: 2150, workouts: 1 },
    { date: '2025-08-08', weight: 74.8, bodyFat: 18.2, muscleMass: 35.4, steps: 9200, calories: 2200, workouts: 4 },
    { date: '2025-08-15', weight: 74.5, bodyFat: 17.9, muscleMass: 35.6, steps: 9800, calories: 2180, workouts: 5 },
    { date: '2025-08-22', weight: 74.1, bodyFat: 17.6, muscleMass: 35.8, steps: 10200, calories: 2220, workouts: 6 },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Workout Complete',
      description: 'Completed your first workout session',
      icon: '🏋️‍♂️',
      dateEarned: '2025-08-01',
      category: 'workout'
    },
    {
      id: '2',
      title: '7-Day Streak',
      description: 'Logged activities for 7 consecutive days',
      icon: '🔥',
      dateEarned: '2025-08-07',
      category: 'consistency'
    },
    {
      id: '3',
      title: 'Goal Crusher',
      description: 'Hit your daily calorie goal 5 times',
      icon: '🎯',
      dateEarned: '2025-08-12',
      category: 'nutrition'
    },
    {
      id: '4',
      title: '10K Steps Champion',
      description: 'Walked 10,000+ steps in a single day',
      icon: '👟',
      dateEarned: '2025-08-15',
      category: 'milestone'
    },
    {
      id: '5',
      title: 'Weight Loss Hero',
      description: 'Lost 1kg from your starting weight',
      icon: '⚖️',
      dateEarned: '2025-08-20',
      category: 'milestone'
    },
  ];

  const getCurrentData = () => {
    return progressData[progressData.length - 1];
  };

  const getStartData = () => {
    return progressData[0];
  };

  const calculateChange = (current: number, start: number) => {
    return current - start;
  };

  const getChangeColor = (change: number, isWeight = false) => {
    if (isWeight) {
      return change < 0 ? '#10b981' : change > 0 ? '#ef4444' : '#6a6a6a';
    }
    return change > 0 ? '#10b981' : change < 0 ? '#ef4444' : '#6a6a6a';
  };

  const formatChange = (change: number, unit: string) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}${unit}`;
  };

  const currentData = getCurrentData();
  const startData = getStartData();

  const weightChange = calculateChange(currentData.weight, startData.weight);
  const bodyFatChange = calculateChange(currentData.bodyFat, startData.bodyFat);
  const muscleMassChange = calculateChange(currentData.muscleMass, startData.muscleMass);

  const weeklyStats = {
    avgSteps: Math.round(progressData.reduce((sum, data) => sum + data.steps, 0) / progressData.length),
    avgCalories: Math.round(progressData.reduce((sum, data) => sum + data.calories, 0) / progressData.length),
    totalWorkouts: progressData.reduce((sum, data) => sum + data.workouts, 0),
    activeDays: progressData.filter(data => data.workouts > 0).length,
  };

  return (
    <div className="progress-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-wrapper">
            <Link to="/landing" className="brand-logo">
              <FitFusionLogo width={40} height={40} />
              <span className="brand-text">Fit Fusion</span>
            </Link>
            
            <ul className="nav-menu">
              <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
              <li><Link to="/workout" className="nav-link">Workouts</Link></li>
              <li><Link to="/diet" className="nav-link">Nutrition</Link></li>
              <li><Link to="/progress" className="nav-link active">Progress</Link></li>
              <li><Link to="/contact" className="nav-link">Support</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="progress-container">
        <div className="container">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">Progress Analytics</h1>
              <p className="page-description">
                Track your fitness journey with comprehensive analytics and insights.
              </p>
            </div>
            <div className="time-range-selector">
              {['week', 'month', '3months', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`time-btn ${timeRange === range ? 'active' : ''}`}
                >
                  {range === '3months' ? '3M' : range === 'week' ? '1W' : range === 'month' ? '1M' : '1Y'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              onClick={() => setActiveTab('overview')}
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
              Overview
            </button>
            <button
              onClick={() => setActiveTab('body')}
              className={`tab-btn ${activeTab === 'body' ? 'active' : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
              </svg>
              Body Metrics
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
            >
              <FitFusionLogo width={20} height={20} />
              Achievements
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              {/* Key Metrics Summary */}
              <div className="metrics-summary">
                <h2 className="section-title">Performance Summary</h2>
                <div className="summary-grid">
                  <div className="summary-card">
                    <div className="summary-icon">📊</div>
                    <div className="summary-content">
                      <h3 className="summary-value">{weeklyStats.avgSteps.toLocaleString()}</h3>
                      <p className="summary-label">Avg Daily Steps</p>
                      <span className="summary-trend positive">+12% vs last period</span>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">🔥</div>
                    <div className="summary-content">
                      <h3 className="summary-value">{weeklyStats.avgCalories.toLocaleString()}</h3>
                      <p className="summary-label">Avg Calories Burned</p>
                      <span className="summary-trend positive">+8% vs last period</span>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">💪</div>
                    <div className="summary-content">
                      <h3 className="summary-value">{weeklyStats.totalWorkouts}</h3>
                      <p className="summary-label">Total Workouts</p>
                      <span className="summary-trend positive">+3 vs last period</span>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">📅</div>
                    <div className="summary-content">
                      <h3 className="summary-value">{weeklyStats.activeDays}</h3>
                      <p className="summary-label">Active Days</p>
                      <span className="summary-trend positive">Great consistency!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Charts Placeholder */}
              <div className="charts-section">
                <h2 className="section-title">Progress Trends</h2>
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3 className="chart-title">Weight Progress</h3>
                    <div className="chart-placeholder">
                      <div className="chart-visual">
                        <div className="chart-line"></div>
                        <div className="chart-points">
                          {progressData.map((_, index) => (
                            <div key={index} className="chart-point" style={{ left: `${(index / (progressData.length - 1)) * 100}%` }}></div>
                          ))}
                        </div>
                      </div>
                      <div className="chart-labels">
                        <span>Start: {startData.weight}kg</span>
                        <span>Current: {currentData.weight}kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="chart-card">
                    <h3 className="chart-title">Activity Levels</h3>
                    <div className="chart-placeholder">
                      <div className="bar-chart">
                        {progressData.map((data, index) => (
                          <div key={index} className="bar" style={{ height: `${(data.steps / 12000) * 100}%` }}>
                            <div className="bar-value">{Math.round(data.steps / 1000)}k</div>
                          </div>
                        ))}
                      </div>
                      <div className="chart-labels">
                        <span>Weekly Steps Progress</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'body' && (
            <div className="tab-content">
              <div className="body-metrics">
                <h2 className="section-title">Body Composition Analysis</h2>
                <div className="body-grid">
                  <div className="body-card weight">
                    <div className="body-header">
                      <div className="body-icon">⚖️</div>
                      <div className="body-info">
                        <h3 className="body-value">{currentData.weight} kg</h3>
                        <p className="body-label">Current Weight</p>
                      </div>
                    </div>
                    <div className="body-change">
                      <span 
                        className="change-value" 
                        style={{ color: getChangeColor(weightChange, true) }}
                      >
                        {formatChange(weightChange, 'kg')}
                      </span>
                      <span className="change-label">from start</span>
                    </div>
                    <div className="body-progress">
                      <div className="progress-bar">
                        <div className="progress-fill weight-progress" style={{ width: '65%' }}></div>
                      </div>
                      <p className="progress-text">65% to goal weight</p>
                    </div>
                  </div>

                  <div className="body-card bodyfat">
                    <div className="body-header">
                      <div className="body-icon">📊</div>
                      <div className="body-info">
                        <h3 className="body-value">{currentData.bodyFat}%</h3>
                        <p className="body-label">Body Fat</p>
                      </div>
                    </div>
                    <div className="body-change">
                      <span 
                        className="change-value" 
                        style={{ color: getChangeColor(bodyFatChange, true) }}
                      >
                        {formatChange(bodyFatChange, '%')}
                      </span>
                      <span className="change-label">from start</span>
                    </div>
                    <div className="body-status">
                      <span className="status-badge healthy">Healthy Range</span>
                    </div>
                  </div>

                  <div className="body-card muscle">
                    <div className="body-header">
                      <div className="body-icon">💪</div>
                      <div className="body-info">
                        <h3 className="body-value">{currentData.muscleMass} kg</h3>
                        <p className="body-label">Muscle Mass</p>
                      </div>
                    </div>
                    <div className="body-change">
                      <span 
                        className="change-value" 
                        style={{ color: getChangeColor(muscleMassChange) }}
                      >
                        {formatChange(muscleMassChange, 'kg')}
                      </span>
                      <span className="change-label">from start</span>
                    </div>
                    <div className="body-status">
                      <span className="status-badge excellent">Excellent Progress</span>
                    </div>
                  </div>
                </div>

                {/* Body Composition Chart */}
                <div className="composition-chart">
                  <h3 className="chart-title">Body Composition Trends</h3>
                  <div className="chart-container">
                    <div className="composition-visual">
                      <div className="composition-bars">
                        {progressData.map((data, index) => (
                          <div key={index} className="composition-bar">
                            <div 
                              className="muscle-bar" 
                              style={{ height: `${(data.muscleMass / 40) * 100}%` }}
                              title={`Muscle: ${data.muscleMass}kg`}
                            ></div>
                            <div 
                              className="fat-bar" 
                              style={{ height: `${(data.bodyFat / 25) * 60}%` }}
                              title={`Body Fat: ${data.bodyFat}%`}
                            ></div>
                            <div className="date-label">
                              {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="composition-legend">
                        <div className="legend-item">
                          <div className="legend-color muscle"></div>
                          <span>Muscle Mass</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color fat"></div>
                          <span>Body Fat</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="tab-content">
              <div className="achievements-section">
                <div className="achievements-header">
                  <h2 className="section-title">Your Achievements</h2>
                  <div className="achievements-stats">
                    <div className="achievement-stat">
                      <span className="stat-number">{achievements.length}</span>
                      <span className="stat-label">Total Earned</span>
                    </div>
                    <div className="achievement-stat">
                      <span className="stat-number">12</span>
                      <span className="stat-label">Available</span>
                    </div>
                  </div>
                </div>

                <div className="achievements-grid">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="achievement-card earned">
                      <div className="achievement-icon">{achievement.icon}</div>
                      <div className="achievement-content">
                        <h3 className="achievement-title">{achievement.title}</h3>
                        <p className="achievement-description">{achievement.description}</p>
                        <div className="achievement-meta">
                          <span className="achievement-category">{achievement.category}</span>
                          <span className="achievement-date">
                            {new Date(achievement.dateEarned).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="achievement-status">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    </div>
                  ))}

                  {/* Locked Achievement Examples */}
                  <div className="achievement-card locked">
                    <div className="achievement-icon">🏃‍♂️</div>
                    <div className="achievement-content">
                      <h3 className="achievement-title">Marathon Prep</h3>
                      <p className="achievement-description">Complete 20 cardio workouts</p>
                      <div className="achievement-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '60%' }}></div>
                        </div>
                        <span className="progress-text">12/20 completed</span>
                      </div>
                    </div>
                    <div className="achievement-lock">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="achievement-card locked">
                    <div className="achievement-icon">🥗</div>
                    <div className="achievement-content">
                      <h3 className="achievement-title">Nutrition Master</h3>
                      <p className="achievement-description">Log meals for 30 consecutive days</p>
                      <div className="achievement-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '23%' }}></div>
                        </div>
                        <span className="progress-text">7/30 days</span>
                      </div>
                    </div>
                    <div className="achievement-lock">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .progress-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* Navigation (consistent with other components) */
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

        /* Main Container */
        .progress-container {
          padding: 2rem 0;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .page-description {
          font-size: 1.125rem;
          color: #6a6a6a;
        }

        .time-range-selector {
          display: flex;
          background: white;
          border-radius: 12px;
          padding: 0.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .time-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #6a6a6a;
        }

        .time-btn.active {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
        }

        /* Tab Navigation */
        .tab-navigation {
          display: flex;
          background: white;
          border-radius: 16px;
          padding: 0.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          border: none;
          background: transparent;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #6a6a6a;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(112, 141, 80, 0.3);
        }

        /* Tab Content */
        .tab-content {
          animation: fadeIn 0.4s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Metrics Summary */
        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .summary-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .summary-icon {
          font-size: 2rem;
        }

        .summary-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .summary-label {
          font-size: 0.95rem;
          color: #6a6a6a;
          margin-bottom: 0.5rem;
        }

        .summary-trend {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .summary-trend.positive {
          color: #10b981;
        }

        /* Charts Section */
        .charts-section {
          margin-bottom: 2rem;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .chart-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .chart-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .chart-placeholder {
          height: 200px;
          position: relative;
        }

        .chart-visual {
          position: relative;
          height: 150px;
          margin-bottom: 1rem;
        }

        .chart-line {
          position: absolute;
          top: 20%;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #708d50, #10b981);
          border-radius: 1px;
        }

        .chart-points {
          position: relative;
          height: 100%;
        }

        .chart-point {
          position: absolute;
          top: 20%;
          width: 8px;
          height: 8px;
          background: #708d50;
          border-radius: 50%;
          transform: translateY(-50%);
        }

        .bar-chart {
          display: flex;
          align-items: end;
          justify-content: space-between;
          height: 150px;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .bar {
          flex: 1;
          background: linear-gradient(135deg, #708d50, #5a7340);
          border-radius: 4px 4px 0 0;
          position: relative;
          min-height: 20px;
        }

        .bar-value {
          position: absolute;
          top: -1.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          font-weight: 600;
          color: #6a6a6a;
        }

        .chart-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #6a6a6a;
        }

        /* Body Metrics */
        .body-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .body-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .body-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .body-card.weight {
          border-top: 4px solid #708d50;
        }

        .body-card.bodyfat {
          border-top: 4px solid #f59e0b;
        }

        .body-card.muscle {
          border-top: 4px solid #10b981;
        }

        .body-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .body-icon {
          font-size: 2rem;
        }

        .body-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .body-label {
          font-size: 0.95rem;
          color: #6a6a6a;
          font-weight: 500;
        }

        .body-change {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .change-value {
          font-weight: 700;
          font-size: 1rem;
        }

        .change-label {
          font-size: 0.875rem;
          color: #6a6a6a;
        }

        .body-progress {
          margin-bottom: 1rem;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 1s ease;
        }

        .weight-progress {
          background: linear-gradient(90deg, #708d50, #5a7340);
        }

        .progress-text {
          font-size: 0.875rem;
          color: #6a6a6a;
        }

        .body-status {
          display: flex;
          align-items: center;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-badge.healthy {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .status-badge.excellent {
          background: rgba(112, 141, 80, 0.1);
          color: #708d50;
        }

        /* Composition Chart */
        .composition-chart {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .composition-visual {
          margin-top: 1.5rem;
        }

        .composition-bars {
          display: flex;
          justify-content: space-around;
          align-items: end;
          height: 200px;
          margin-bottom: 1rem;
        }

        .composition-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .muscle-bar,
        .fat-bar {
          width: 30px;
          border-radius: 4px 4px 0 0;
          transition: height 0.8s ease;
        }

        .muscle-bar {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .fat-bar {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .date-label {
          font-size: 0.75rem;
          color: #6a6a6a;
          margin-top: 0.5rem;
        }

        .composition-legend {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6a6a6a;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .legend-color.muscle {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .legend-color.fat {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        /* Achievements */
        .achievements-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .achievements-stats {
          display: flex;
          gap: 2rem;
        }

        .achievement-stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: #708d50;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6a6a6a;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .achievement-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .achievement-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .achievement-card.earned {
          border-left: 4px solid #10b981;
        }

        .achievement-card.locked {
          border-left: 4px solid #e2e8f0;
          opacity: 0.7;
        }

        .achievement-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .achievement-content {
          flex: 1;
        }

        .achievement-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .achievement-description {
          font-size: 0.95rem;
          color: #6a6a6a;
          margin-bottom: 0.75rem;
        }

        .achievement-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .achievement-category {
          background: rgba(112, 141, 80, 0.1);
          color: #708d50;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .achievement-date {
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .achievement-progress {
          margin-top: 0.5rem;
        }

        .progress-text {
          font-size: 0.875rem;
          color: #6a6a6a;
          margin-top: 0.5rem;
        }

        .achievement-status {
          color: #10b981;
        }

        .achievement-lock {
          color: #9ca3af;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .progress-container {
            padding: 1.5rem 0;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .tab-navigation {
            flex-direction: column;
            gap: 0.5rem;
          }

          .summary-grid,
          .body-grid,
          .achievements-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .charts-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .achievements-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressAnalytics;
