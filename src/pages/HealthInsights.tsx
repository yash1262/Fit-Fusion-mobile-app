import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { getTodayActivity, subscribeToActivityUpdates } from '../services/activityTrackingService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HealthInsights: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');
  const [activity, setActivity] = useState(getTodayActivity());
  
  // Refresh data on mount
  useEffect(() => {
    const refreshData = () => {
      const updated = getTodayActivity();
      console.log('Health Insights mounted, loading data:', updated);
      setActivity(updated);
    };
    refreshData();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToActivityUpdates((updatedActivity) => {
      console.log('Health Insights received update:', updatedActivity);
      setActivity(updatedActivity);
    });
    
    // Also listen for storage changes (in case of cross-tab updates)
    const handleStorageChange = () => {
      const updated = getTodayActivity();
      console.log('Storage changed, updating Health Insights:', updated);
      setActivity(updated);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Refresh data when component becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const updated = getTodayActivity();
        console.log('Page visible, refreshing Health Insights:', updated);
        setActivity(updated);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Generate PDF Report
  const generatePDFReport = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Header
    doc.setFillColor(112, 141, 80);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Fit Fusion', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Health & Fitness Report', 105, 30, { align: 'center' });

    // Date
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated on: ${today}`, 20, 50);

    // Activity Summary Section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(112, 141, 80);
    doc.text('📊 Today\'s Activity Summary', 20, 65);

    doc.setDrawColor(112, 141, 80);
    doc.setLineWidth(0.5);
    doc.line(20, 68, 190, 68);

    // Activity Metrics
    const activityData = [
      ['Metric', 'Value', 'Goal', 'Progress'],
      ['Steps', activity.steps.toLocaleString(), '10,000', `${Math.round((activity.steps / 10000) * 100)}%`],
      ['Calories Burned', `${activity.calories} cal`, '2,500 cal', `${Math.round((activity.calories / 2500) * 100)}%`],
      ['Active Minutes', `${activity.activeMinutes} min`, '60 min', `${Math.round((activity.activeMinutes / 60) * 100)}%`],
      ['Water Intake', `${activity.hydration} glasses`, '8 glasses', `${Math.round((activity.hydration / 8) * 100)}%`],
      ['Workouts Completed', activity.workoutsCompleted.toString(), '-', '-'],
    ];

    autoTable(doc, {
      startY: 75,
      head: [activityData[0]],
      body: activityData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [112, 141, 80], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 20, right: 20 },
    });

    // Wellness Metrics Section
    let yPos = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(112, 141, 80);
    doc.text('💪 Wellness Metrics', 20, yPos);

    doc.setDrawColor(112, 141, 80);
    doc.line(20, yPos + 3, 190, yPos + 3);

    const wellnessData = [
      ['Metric', 'Rating', 'Status'],
      ['Sleep Quality', `${activity.sleep}/10`, activity.sleep >= 8 ? 'Excellent' : activity.sleep >= 6 ? 'Good' : 'Needs Improvement'],
      ['Stress Level', `${activity.stress}/10`, activity.stress <= 3 ? 'Low' : activity.stress <= 6 ? 'Moderate' : 'High'],
      ['Mood', `${activity.mood}/10`, activity.mood >= 8 ? 'Great' : activity.mood >= 6 ? 'Good' : 'Could be better'],
      ['Muscle Soreness', `${activity.soreness}/10`, activity.soreness <= 3 ? 'Minimal' : activity.soreness <= 6 ? 'Moderate' : 'High'],
    ];

    autoTable(doc, {
      startY: yPos + 8,
      head: [wellnessData[0]],
      body: wellnessData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [112, 141, 80], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 20, right: 20 },
    });

    // Recommendations Section
    yPos = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(112, 141, 80);
    doc.text('💡 Personalized Recommendations', 20, yPos);

    doc.setDrawColor(112, 141, 80);
    doc.line(20, yPos + 3, 190, yPos + 3);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    yPos += 12;

    const recommendations = [];
    if (activity.steps < 10000) recommendations.push(`• Increase daily steps by ${10000 - activity.steps} to reach your goal`);
    if (activity.hydration < 8) recommendations.push(`• Drink ${8 - activity.hydration} more glasses of water today`);
    if (activity.activeMinutes < 60) recommendations.push(`• Add ${60 - activity.activeMinutes} more minutes of activity`);
    if (activity.sleep < 7) recommendations.push('• Aim for 7-9 hours of sleep for better recovery');
    if (activity.stress > 6) recommendations.push('• Consider stress-relief activities like yoga or meditation');
    if (recommendations.length === 0) recommendations.push('• Great job! You\'re meeting all your goals today! 🎉');

    recommendations.forEach(rec => {
      doc.text(rec, 25, yPos);
      yPos += 8;
    });

    // Footer
    doc.setFillColor(112, 141, 80);
    doc.rect(0, 270, 210, 27, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Fit Fusion - Your AI-Powered Fitness Companion', 105, 282, { align: 'center' });
    doc.text('Keep pushing towards your goals! 💪', 105, 290, { align: 'center' });

    // Save PDF
    doc.save(`FitFusion-Health-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="health-insights-page">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/landing" className="logo">FitFusion</Link>
          <ul className="nav-menu">
            <li><Link to="/landing" className="nav-link">Home</Link></li>
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link to="/contact" className="nav-link">Contact</Link></li>
            <li><Link to="/signin" className="nav-link">Sign In</Link></li>
          </ul>
        </div>
      </nav>

      <div className="insights-container">
        <div className="insights-header">
          <div className="header-content">
            <h1>Health Insights</h1>
            <p>Your comprehensive health analytics and performance metrics</p>
          </div>
          <div className="period-selector">
            <button 
              className={selectedPeriod === 'week' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('week')}
            >
              Week
            </button>
            <button 
              className={selectedPeriod === 'month' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </button>
            <button 
              className={selectedPeriod === 'year' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="insights-tabs">
          <button 
            className={activeTab === 'overview' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={activeTab === 'activity' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('activity')}
          >
            🏃 Activity
          </button>
          <button 
            className={activeTab === 'nutrition' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('nutrition')}
          >
            🥗 Nutrition
          </button>
          <button 
            className={activeTab === 'sleep' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('sleep')}
          >
            😴 Sleep
          </button>
          <button 
            className={activeTab === 'trends' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('trends')}
          >
            📈 Trends
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="insights-content">
            {/* Today's Nutrition */}
            <div className="todays-nutrition-section">
              <h2 className="section-title">Today's Activity Summary</h2>
              <div className="nutrition-boxes">
                <div className="nutrition-box calories">
                  <div className="nutrition-icon">🔥</div>
                  <div className="nutrition-data">
                    <div className="nutrition-value">{activity.calories}</div>
                    <div className="nutrition-label">Calories Burned</div>
                    <div className="nutrition-goal">Goal: 2500 cal</div>
                  </div>
                </div>
                <div className="nutrition-box protein">
                  <div className="nutrition-icon">👟</div>
                  <div className="nutrition-data">
                    <div className="nutrition-value">{activity.steps.toLocaleString()}</div>
                    <div className="nutrition-label">Steps</div>
                    <div className="nutrition-goal">Goal: 10,000</div>
                  </div>
                </div>
                <div className="nutrition-box carbs">
                  <div className="nutrition-icon">⏱️</div>
                  <div className="nutrition-data">
                    <div className="nutrition-value">{activity.activeMinutes} min</div>
                    <div className="nutrition-label">Active Time</div>
                    <div className="nutrition-goal">Goal: 60 min</div>
                  </div>
                </div>
                <div className="nutrition-box fat">
                  <div className="nutrition-icon">💪</div>
                  <div className="nutrition-data">
                    <div className="nutrition-value">{activity.workoutsCompleted}</div>
                    <div className="nutrition-label">Workouts</div>
                    <div className="nutrition-goal">Today's sessions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="metrics-grid">
              <div className="metric-card clickable">
                <div className="metric-icon">👟</div>
                <div className="metric-info">
                  <h3>Daily Steps</h3>
                  <div className="metric-value">{activity.steps.toLocaleString()}</div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${Math.min((activity.steps / 10000) * 100, 100)}%`}}></div>
                    </div>
                    <span className="progress-text">{Math.round((activity.steps / 10000) * 100)}% of 10,000 goal</span>
                  </div>
                </div>
              </div>

              <div className="metric-card clickable">
                <div className="metric-icon">💧</div>
                <div className="metric-info">
                  <h3>Water Intake</h3>
                  <div className="metric-value">{activity.hydration} / 8 glasses</div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${(activity.hydration / 8) * 100}%`}}></div>
                    </div>
                    <span className="progress-text">{Math.round((activity.hydration / 8) * 100)}% of daily goal</span>
                  </div>
                </div>
              </div>

              <div className="metric-card clickable">
                <div className="metric-icon">🔥</div>
                <div className="metric-info">
                  <h3>Calories Burned</h3>
                  <div className="metric-value">{activity.calories.toLocaleString()}</div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${Math.min((activity.calories / 2500) * 100, 100)}%`}}></div>
                    </div>
                    <span className="progress-text">{Math.round((activity.calories / 2500) * 100)}% of daily target</span>
                  </div>
                </div>
              </div>

              <div className="metric-card clickable">
                <div className="metric-icon">⚡</div>
                <div className="metric-info">
                  <h3>Active Minutes</h3>
                  <div className="metric-value">{activity.activeMinutes} min</div>
                  <div className="metric-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${Math.min((activity.activeMinutes / 60) * 100, 100)}%`}}></div>
                    </div>
                    <span className="progress-text">{Math.round((activity.activeMinutes / 60) * 100)}% of 60 min goal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
              {/* Weekly Activity Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Weekly Activity</h3>
                  <button className="export-btn">📥 Export</button>
                </div>
                <div className="bar-chart">
                  <div className="chart-bars">
                    <div className="bar-group">
                      <div className="bar" style={{height: '60%'}}></div>
                      <span className="bar-label">Mon</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar" style={{height: '75%'}}></div>
                      <span className="bar-label">Tue</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar" style={{height: '85%'}}></div>
                      <span className="bar-label">Wed</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar" style={{height: '70%'}}></div>
                      <span className="bar-label">Thu</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar" style={{height: '90%'}}></div>
                      <span className="bar-label">Fri</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar" style={{height: '65%'}}></div>
                      <span className="bar-label">Sat</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar active" style={{height: '80%'}}></div>
                      <span className="bar-label">Sun</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workout Distribution Pie Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Workout Distribution</h3>
                  <button className="export-btn">📥 Export</button>
                </div>
                <div className="pie-chart-container">
                  <svg className="pie-chart" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#708d50" strokeWidth="40" strokeDasharray="251 251" transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#4facfe" strokeWidth="40" strokeDasharray="157 251" strokeDashoffset="-251" transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#fa709a" strokeWidth="40" strokeDasharray="94 251" strokeDashoffset="-408" transform="rotate(-90 100 100)" />
                  </svg>
                  <div className="pie-legend">
                    <div className="legend-item">
                      <span className="legend-color" style={{background: '#708d50'}}></span>
                      <span>Strength (50%)</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{background: '#4facfe'}}></span>
                      <span>Cardio (31%)</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{background: '#fa709a'}}></span>
                      <span>Flexibility (19%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Line Chart */}
            <div className="chart-card full-width">
              <div className="chart-header">
                <h3>Weight Progress Trend</h3>
                <button className="export-btn">📥 Export</button>
              </div>
              <div className="line-chart">
                <svg viewBox="0 0 800 300" className="line-chart-svg">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#708d50" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#708d50" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="url(#lineGradient)"
                    stroke="none"
                    points="0,300 50,180 150,160 250,170 350,150 450,140 550,145 650,130 750,120 800,125 800,300"
                  />
                  <polyline
                    fill="none"
                    stroke="#708d50"
                    strokeWidth="3"
                    points="50,180 150,160 250,170 350,150 450,140 550,145 650,130 750,120"
                  />
                  {[50,150,250,350,450,550,650,750].map((x, i) => (
                    <circle key={i} cx={x} cy={[180,160,170,150,140,145,130,120][i]} r="5" fill="#708d50" className="chart-point"/>
                  ))}
                </svg>
                <div className="chart-labels">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                  <span>Week 5</span>
                  <span>Week 6</span>
                  <span>Week 7</span>
                  <span>Week 8</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="insights-content">
            <div className="activity-stats">
              <div className="stat-card">
                <h3>Today's Workouts</h3>
                <div className="stat-number">{activity.workoutsCompleted}</div>
                <div className="stat-change positive">Sessions completed</div>
              </div>
              <div className="stat-card">
                <h3>Active Minutes</h3>
                <div className="stat-number">{activity.activeMinutes}</div>
                <div className="stat-change positive">Goal: 60 min</div>
              </div>
              <div className="stat-card">
                <h3>Steps Today</h3>
                <div className="stat-number">{activity.steps.toLocaleString()}</div>
                <div className="stat-change">Goal: 10,000</div>
              </div>
            </div>

            <div className="chart-card">
              <h3>Steps Histogram</h3>
              <div className="histogram">
                {[65, 80, 90, 75, 95, 70, 85, 88, 92, 78, 85, 90, 94, 87].map((height, i) => (
                  <div key={i} className="histogram-bar" style={{height: `${height}%`}}>
                    <span className="histogram-value">{Math.floor(height * 100)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Nutrition Tab */}
        {activeTab === 'nutrition' && (
          <div className="insights-content">
            <div className="nutrition-overview">
              <div className="macro-card">
                <h3>Macronutrients</h3>
                <div className="macro-rings">
                  <div className="macro-ring">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="8"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#708d50" strokeWidth="8" 
                        strokeDasharray="251" strokeDashoffset="75" transform="rotate(-90 50 50)"/>
                    </svg>
                    <div className="macro-label">
                      <div className="macro-value">45%</div>
                      <div className="macro-name">Protein</div>
                    </div>
                  </div>
                  <div className="macro-ring">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="8"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#4facfe" strokeWidth="8" 
                        strokeDasharray="251" strokeDashoffset="100" transform="rotate(-90 50 50)"/>
                    </svg>
                    <div className="macro-label">
                      <div className="macro-value">35%</div>
                      <div className="macro-name">Carbs</div>
                    </div>
                  </div>
                  <div className="macro-ring">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="8"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#fa709a" strokeWidth="8" 
                        strokeDasharray="251" strokeDashoffset="150" transform="rotate(-90 50 50)"/>
                    </svg>
                    <div className="macro-label">
                      <div className="macro-value">20%</div>
                      <div className="macro-name">Fats</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hydration-card">
                <h3>Daily Hydration</h3>
                <div className="water-container">
                  <div className="water-glass">
                    <div className="water-level" style={{height: `${(activity.hydration / 8) * 100}%`}}></div>
                  </div>
                  <div className="water-stats">
                    <div className="water-amount">{activity.hydration} / 8 glasses</div>
                    <div className="water-cups">
                      {Array.from({length: 8}, (_, i) => (
                        <span key={i} className={i < activity.hydration ? 'cup filled' : 'cup'}>💧</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sleep Tab */}
        {activeTab === 'sleep' && (
          <div className="insights-content">
            <div className="sleep-overview">
              <div className="sleep-score-card">
                <h3>Sleep Quality</h3>
                <div className="sleep-score">
                  <svg viewBox="0 0 200 200" className="score-ring">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e0e0" strokeWidth="12"/>
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#708d50" strokeWidth="12" 
                      strokeDasharray="502" strokeDashoffset={502 - (activity.sleep / 10) * 502} transform="rotate(-90 100 100)"/>
                  </svg>
                  <div className="score-value">
                    <div className="score-number">{activity.sleep}/10</div>
                    <div className="score-label">{activity.sleep >= 8 ? 'Excellent' : activity.sleep >= 6 ? 'Good' : 'Needs Improvement'}</div>
                  </div>
                </div>
              </div>

              <div className="sleep-stages">
                <h3>Sleep Stages</h3>
                <div className="stage-bars">
                  <div className="stage-item">
                    <span className="stage-name">Deep Sleep</span>
                    <div className="stage-bar">
                      <div className="stage-fill" style={{width: '25%', background: '#708d50'}}></div>
                    </div>
                    <span className="stage-time">2h</span>
                  </div>
                  <div className="stage-item">
                    <span className="stage-name">REM Sleep</span>
                    <div className="stage-bar">
                      <div className="stage-fill" style={{width: '30%', background: '#4facfe'}}></div>
                    </div>
                    <span className="stage-time">2.4h</span>
                  </div>
                  <div className="stage-item">
                    <span className="stage-name">Light Sleep</span>
                    <div className="stage-bar">
                      <div className="stage-fill" style={{width: '40%', background: '#a8edea'}}></div>
                    </div>
                    <span className="stage-time">3.2h</span>
                  </div>
                  <div className="stage-item">
                    <span className="stage-name">Awake</span>
                    <div className="stage-bar">
                      <div className="stage-fill" style={{width: '5%', background: '#fa709a'}}></div>
                    </div>
                    <span className="stage-time">0.4h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="insights-content">
            <div className="trends-grid">
              <div className="trend-card positive">
                <div className="trend-icon">📈</div>
                <h3>Workout Consistency</h3>
                <div className="trend-value">+15%</div>
                <p>You're working out more regularly this month</p>
              </div>
              <div className="trend-card positive">
                <div className="trend-icon">💪</div>
                <h3>Strength Gains</h3>
                <div className="trend-value">+8kg</div>
                <p>Average lift weight increased significantly</p>
              </div>
              <div className="trend-card warning">
                <div className="trend-icon">😴</div>
                <h3>Sleep Quality</h3>
                <div className="trend-value">-5%</div>
                <p>Consider going to bed earlier for better recovery</p>
              </div>
              <div className="trend-card positive">
                <div className="trend-icon">🎯</div>
                <h3>Goal Progress</h3>
                <div className="trend-value">78%</div>
                <p>On track to reach your monthly goal</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="insights-actions">
          <button className="action-btn primary" onClick={generatePDFReport}>
            📊 Generate Full Report
          </button>
          <button className="action-btn" onClick={generatePDFReport}>
            📥 Download PDF
          </button>
          <button className="action-btn" onClick={() => alert('Email feature coming soon!')}>
            📧 Email Report
          </button>
          <button className="action-btn" onClick={() => alert('Share feature coming soon!')}>
            🔗 Share Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthInsights;
