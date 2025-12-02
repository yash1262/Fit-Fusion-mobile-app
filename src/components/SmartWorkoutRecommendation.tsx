import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SmartWorkoutRecommendation.css';
import { getTodayActivity, subscribeToActivityUpdates, updateActivity } from '../services/activityTrackingService';

interface WorkoutVideo {
  id: string;
  title: string;
  duration: string;
  type: string;
  videoId: string;
  thumbnail: string;
}

interface UserMetrics {
  sleep: number;
  stress: number;
  steps: number;
  calories: number;
  water: number;
  soreness: number;
  mood: number;
  schedule: string;
  weather: string;
  lastWorkout: string;
}

interface WorkoutRecommendation {
  duration: string;
  energyLevel: string;
  bestTime: string;
  videos: WorkoutVideo[];
  reasoning: string[];
  intensity: string;
}

const SmartWorkoutRecommendation: React.FC = () => {
  const [recommendation, setRecommendation] = useState<WorkoutRecommendation | null>(null);
  const [currentVideo, setCurrentVideo] = useState<WorkoutVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userMetrics, setUserMetrics] = useState<UserMetrics>(() => {
    const activity = getTodayActivity();
    return {
      sleep: activity.sleep,
      stress: activity.stress,
      steps: activity.steps,
      calories: activity.calories,
      water: activity.hydration,
      soreness: activity.soreness,
      mood: activity.mood,
      schedule: '',
      weather: 'Sunny',
      lastWorkout: activity.workoutsCompleted > 0 ? 'Today' : 'Not yet today'
    };
  });

  const generateRecommendation = (metrics: UserMetrics): WorkoutRecommendation => {
    const reasons: string[] = [];
    let intensity = 'moderate';
    let duration = '15-20';
    let energyLevel = 'Medium';
    const videos: WorkoutVideo[] = [];

    if (metrics.sleep < 6) {
      reasons.push('Sleep was low today - recommending gentle recovery');
      intensity = 'low';
      energyLevel = 'Low → Medium';
      duration = '10-15';
    } else if (metrics.sleep >= 8) {
      reasons.push('Well-rested - perfect for high-intensity training');
      intensity = 'high';
      energyLevel = 'Medium → High';
      duration = '20-30';
    }

    if (metrics.stress > 7) {
      reasons.push('Stress score elevated - adding stress-relief flow');
      intensity = 'low';
    }

    if (metrics.soreness > 6) {
      reasons.push('Muscles slightly sore - focusing on mobility & stretching');
      intensity = 'recovery';
    }

    if (metrics.steps > 8000) {
      reasons.push('Step count is high - lighter cardio today');
    } else if (metrics.steps < 3000) {
      reasons.push('Low activity today - adding cardio boost');
    }

    // Check actual time availability based on current hour
    const hour = new Date().getHours();
    if (hour >= 8 && hour < 12) {
      reasons.push('Morning energy detected - great time for workout');
    } else if (hour >= 17 && hour < 20) {
      reasons.push('Evening workout window - optimal training time');
    } else if (hour >= 20) {
      reasons.push('Late evening - lighter workout recommended');
      intensity = intensity === 'high' ? 'moderate' : intensity;
    }

    if (metrics.weather.toLowerCase().includes('rain')) {
      reasons.push('Rainy weather - indoor workout selected');
    }

    if (intensity === 'low' || intensity === 'recovery') {
      videos.push(
        { id: '1', title: 'Gentle Yoga Flow', duration: '8 min', type: 'Yoga', videoId: 'v7AYKMP6rOE', thumbnail: 'https://img.youtube.com/vi/v7AYKMP6rOE/mqdefault.jpg' },
        { id: '2', title: 'Full Body Stretch', duration: '10 min', type: 'Stretching', videoId: 'g_tea8ZNk5A', thumbnail: 'https://img.youtube.com/vi/g_tea8ZNk5A/mqdefault.jpg' },
        { id: '3', title: 'Morning Yoga', duration: '15 min', type: 'Yoga', videoId: 'VaoV1PrYft4', thumbnail: 'https://img.youtube.com/vi/VaoV1PrYft4/mqdefault.jpg' },
        { id: '4', title: 'Relaxation Flow', duration: '12 min', type: 'Recovery', videoId: 'COp7BR_Dvps', thumbnail: 'https://img.youtube.com/vi/COp7BR_Dvps/mqdefault.jpg' },
        { id: '5', title: 'Beginner Yoga', duration: '20 min', type: 'Yoga', videoId: 'b1H3xO3x_Js', thumbnail: 'https://img.youtube.com/vi/b1H3xO3x_Js/mqdefault.jpg' },
        { id: '6', title: 'Gentle Stretching', duration: '10 min', type: 'Stretching', videoId: 'qULTwquOuT4', thumbnail: 'https://img.youtube.com/vi/qULTwquOuT4/mqdefault.jpg' },
        { id: '7', title: 'Yoga for Flexibility', duration: '15 min', type: 'Yoga', videoId: 'Yzm3fA2HhkQ', thumbnail: 'https://img.youtube.com/vi/Yzm3fA2HhkQ/mqdefault.jpg' },
        { id: '8', title: 'Relaxing Stretch', duration: '8 min', type: 'Stretching', videoId: 'L_xrDAtykMI', thumbnail: 'https://img.youtube.com/vi/L_xrDAtykMI/mqdefault.jpg' },
        { id: '9', title: 'Bedtime Yoga', duration: '12 min', type: 'Yoga', videoId: 'BiWDsfZ3zbo', thumbnail: 'https://img.youtube.com/vi/BiWDsfZ3zbo/mqdefault.jpg' },
        { id: '10', title: 'Cool Down Stretch', duration: '5 min', type: 'Stretching', videoId: 'Lu76J2yT7Lc', thumbnail: 'https://img.youtube.com/vi/Lu76J2yT7Lc/mqdefault.jpg' }
      );
    } else if (intensity === 'high') {
      videos.push(
        { id: '1', title: 'HIIT Fat Burn', duration: '10 min', type: 'HIIT', videoId: 'ml6cT4AZdqI', thumbnail: 'https://img.youtube.com/vi/ml6cT4AZdqI/mqdefault.jpg' },
        { id: '2', title: 'Core Crusher', duration: '8 min', type: 'Core', videoId: 'DHD1-2P94DI', thumbnail: 'https://img.youtube.com/vi/DHD1-2P94DI/mqdefault.jpg' },
        { id: '3', title: 'Cardio HIIT', duration: '15 min', type: 'HIIT', videoId: '2MfE7uNT5Vg', thumbnail: 'https://img.youtube.com/vi/2MfE7uNT5Vg/mqdefault.jpg' },
        { id: '4', title: 'Full Body HIIT', duration: '20 min', type: 'HIIT', videoId: 'M0uO8X3_tEA', thumbnail: 'https://img.youtube.com/vi/M0uO8X3_tEA/mqdefault.jpg' },
        { id: '5', title: 'Abs Workout', duration: '10 min', type: 'Core', videoId: 'sWjTnBmCHTY', thumbnail: 'https://img.youtube.com/vi/sWjTnBmCHTY/mqdefault.jpg' },
        { id: '6', title: 'Intense Cardio', duration: '12 min', type: 'Cardio', videoId: 'gC_L9qAHVJ8', thumbnail: 'https://img.youtube.com/vi/gC_L9qAHVJ8/mqdefault.jpg' },
        { id: '7', title: 'Tabata Training', duration: '15 min', type: 'HIIT', videoId: 'Wd4Yz7PZiKk', thumbnail: 'https://img.youtube.com/vi/Wd4Yz7PZiKk/mqdefault.jpg' },
        { id: '8', title: 'Bodyweight Strength', duration: '18 min', type: 'Strength', videoId: 'UItWltVZZmE', thumbnail: 'https://img.youtube.com/vi/UItWltVZZmE/mqdefault.jpg' },
        { id: '9', title: 'Power Workout', duration: '10 min', type: 'HIIT', videoId: 'JZQA08SlJnM', thumbnail: 'https://img.youtube.com/vi/JZQA08SlJnM/mqdefault.jpg' },
        { id: '10', title: 'Cool Down Stretch', duration: '5 min', type: 'Stretching', videoId: 'g_tea8ZNk5A', thumbnail: 'https://img.youtube.com/vi/g_tea8ZNk5A/mqdefault.jpg' }
      );
    } else {
      videos.push(
        { id: '1', title: 'Moderate Cardio', duration: '15 min', type: 'Cardio', videoId: 'gC_L9qAHVJ8', thumbnail: 'https://img.youtube.com/vi/gC_L9qAHVJ8/mqdefault.jpg' },
        { id: '2', title: 'Core Strength', duration: '8 min', type: 'Core', videoId: 'DHD1-2P94DI', thumbnail: 'https://img.youtube.com/vi/DHD1-2P94DI/mqdefault.jpg' },
        { id: '3', title: 'Bodyweight Workout', duration: '18 min', type: 'Strength', videoId: 'UItWltVZZmE', thumbnail: 'https://img.youtube.com/vi/UItWltVZZmE/mqdefault.jpg' },
        { id: '4', title: 'Standing Abs', duration: '10 min', type: 'Core', videoId: 'sWjTnBmCHTY', thumbnail: 'https://img.youtube.com/vi/sWjTnBmCHTY/mqdefault.jpg' },
        { id: '5', title: 'Low Impact Cardio', duration: '20 min', type: 'Cardio', videoId: 'Eml2xnoLpYE', thumbnail: 'https://img.youtube.com/vi/Eml2xnoLpYE/mqdefault.jpg' },
        { id: '6', title: 'Full Body Tone', duration: '12 min', type: 'Strength', videoId: 'ml6cT4AZdqI', thumbnail: 'https://img.youtube.com/vi/ml6cT4AZdqI/mqdefault.jpg' },
        { id: '7', title: 'Pilates Core', duration: '15 min', type: 'Pilates', videoId: 'VaoV1PrYft4', thumbnail: 'https://img.youtube.com/vi/VaoV1PrYft4/mqdefault.jpg' },
        { id: '8', title: 'Pilates for Beginners', duration: '10 min', type: 'Pilates', videoId: 'b1H3xO3x_Js', thumbnail: 'https://img.youtube.com/vi/b1H3xO3x_Js/mqdefault.jpg' },
        { id: '9', title: 'Mobility Flow', duration: '8 min', type: 'Mobility', videoId: 'qULTwquOuT4', thumbnail: 'https://img.youtube.com/vi/qULTwquOuT4/mqdefault.jpg' },
        { id: '10', title: 'Cooldown Stretch', duration: '5 min', type: 'Stretching', videoId: 'g_tea8ZNk5A', thumbnail: 'https://img.youtube.com/vi/g_tea8ZNk5A/mqdefault.jpg' }
      );
    }

    const currentHour = new Date().getHours();
    let bestTime = '6:30 PM';
    if (currentHour < 12) {
      bestTime = '7:00 AM';
    } else if (currentHour < 17) {
      bestTime = '5:30 PM';
    }

    return { duration, energyLevel, bestTime, videos, reasoning: reasons, intensity };
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const rec = generateRecommendation(userMetrics);
      setRecommendation(rec);
      setCurrentVideo(rec.videos[0]);
      setIsLoading(false);
    }, 1500);
  }, [userMetrics]);

  // Subscribe to real-time activity updates
  useEffect(() => {
    const unsubscribe = subscribeToActivityUpdates((activity) => {
      setUserMetrics({
        sleep: activity.sleep,
        stress: activity.stress,
        steps: activity.steps,
        calories: activity.calories,
        water: activity.hydration,
        soreness: activity.soreness,
        mood: activity.mood,
        schedule: '',
        weather: 'Sunny',
        lastWorkout: activity.workoutsCompleted > 0 ? 'Today' : 'Not yet today'
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive && !isPaused) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, isPaused]);

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setWorkoutTimer(0);
    setCurrentVideoIndex(0);
    if (recommendation) {
      setCurrentVideo(recommendation.videos[0]);
    }
  };

  const pauseWorkout = () => {
    setIsPaused(!isPaused);
  };

  const stopWorkout = () => {
    setIsWorkoutActive(false);
    setWorkoutTimer(0);
    setIsPaused(false);
    setCurrentVideoIndex(0);
  };

  const nextVideo = () => {
    if (recommendation && currentVideoIndex < recommendation.videos.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      setCurrentVideo(recommendation.videos[nextIndex]);
      // Scroll to video player
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="smart-workout-container">
        <div className="loading-state">
          <div className="ai-analyzing">
            <svg className="loading-logo" width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M50 85 C 20 65, 10 50, 10 35 C 10 20, 20 10, 32 10 C 40 10, 45 15, 50 22 C 55 15, 60 10, 68 10 C 80 10, 90 20, 90 35 C 90 50, 80 65, 50 85 Z" 
                fill="#708d50"
              />
              <circle cx="35" cy="40" r="10" fill="none" stroke="white" strokeWidth="3"/>
              <ellipse cx="35" cy="40" rx="4" ry="6" fill="white"/>
              <circle cx="65" cy="40" r="10" fill="none" stroke="white" strokeWidth="3"/>
              <ellipse cx="65" cy="40" rx="4" ry="6" fill="white"/>
              <path d="M 45 40 Q 50 38, 55 40" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <path d="M 25 40 Q 20 38, 18 35" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <path d="M 75 40 Q 80 38, 82 35" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <line x1="50" y1="48" x2="48" y2="55" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M 40 60 Q 50 68, 60 60" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="loading-title">FitSense AI is analyzing your data...</h3>
          <div className="loading-steps">
            <div className="loading-step">
              <span className="step-icon">💤</span>
              <span className="step-text">Analyzing sleep quality</span>
            </div>
            <div className="loading-step">
              <span className="step-icon">📊</span>
              <span className="step-text">Reviewing activity levels</span>
            </div>
            <div className="loading-step">
              <span className="step-icon">🧠</span>
              <span className="step-text">Calculating optimal intensity</span>
            </div>
            <div className="loading-step">
              <span className="step-icon">🎯</span>
              <span className="step-text">Generating personalized plan</span>
            </div>
          </div>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  return (
    <div className="smart-workout-container">
      <div className="recommendation-header">
        <div className="header-badge">
          <span className="ai-badge">🤖 AI-Powered</span>
          <span className="live-badge">🔴 Live Analysis</span>
        </div>
        <h2 className="header-title">Your Smart Workout for Today</h2>
        <p className="header-subtitle">Auto-Generated by FitSense AI</p>
      </div>

      <div className="recommendation-card">
        <div className="rec-stats">
          <div className="stat-item">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-label">Duration</div>
              <div className="stat-value">{recommendation.duration} min</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-label">Energy Level</div>
              <div className="stat-value">{recommendation.energyLevel}</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🕐</div>
            <div className="stat-content">
              <div className="stat-label">Best Time</div>
              <div className="stat-value">{recommendation.bestTime}</div>
            </div>
          </div>
        </div>

        <div className="ai-reasoning">
          <h3 className="reasoning-title">
            <span className="brain-icon">🧠</span>
            Why This Workout?
          </h3>
          <ul className="reasoning-list">
            {recommendation.reasoning.map((reason, index) => (
              <li key={index} className="reason-item">
                <span className="check-icon">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {currentVideo && (
        <div className="video-player-section">
          <div className="video-header">
            <h3 className="video-title">{currentVideo.title}</h3>
            <span className="video-badge">{currentVideo.type}</span>
          </div>
          <div className="video-wrapper">
            <iframe
              key={currentVideo.videoId}
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=${isWorkoutActive ? 1 : 0}&rel=0`}
              title={currentVideo.title}
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="video-playlist">
        <h3 className="playlist-title">Today's Workout Plan</h3>
        <div className="playlist-grid">
          {recommendation.videos.map((video, index) => (
            <div
              key={video.id}
              className={`playlist-item ${currentVideo?.id === video.id ? 'active' : ''}`}
              onClick={() => setCurrentVideo(video)}
            >
              <div className="playlist-number">{index + 1}</div>
              <img src={video.thumbnail} alt={video.title} className="playlist-thumb" />
              <div className="playlist-info">
                <h4 className="playlist-video-title">{video.title}</h4>
                <div className="playlist-meta">
                  <span className="playlist-duration">{video.duration}</span>
                  <span className="playlist-type">{video.type}</span>
                </div>
              </div>
              {currentVideo?.id === video.id && (
                <div className="playing-indicator">
                  <span className="pulse-dot"></span>
                  Playing
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isWorkoutActive && (
        <div className="workout-timer-bar">
          <div className="timer-info">
            <div className="timer-display">
              <span className="timer-icon">⏱️</span>
              <span className="timer-text">{formatTime(workoutTimer)}</span>
            </div>
            <div className="workout-progress">
              Video {currentVideoIndex + 1} of {recommendation.videos.length}
            </div>
          </div>
          <div className="timer-controls">
            <button className="timer-btn" onClick={pauseWorkout}>
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
            <button className="timer-btn" onClick={nextVideo} disabled={currentVideoIndex >= recommendation.videos.length - 1}>
              ⏭️ Next
            </button>
            <button className="timer-btn stop-btn" onClick={stopWorkout}>
              ⏹️ Stop
            </button>
          </div>
        </div>
      )}

      <div className="action-buttons">
        {!isWorkoutActive ? (
          <button className="btn-primary btn-large" onClick={startWorkout}>
            <span>🔥</span>
            Start Workout Now
          </button>
        ) : (
          <button className="btn-primary btn-large" onClick={stopWorkout}>
            <span>⏹️</span>
            End Workout
          </button>
        )}
        <button className="btn-secondary btn-large">
          <span>📅</span>
          Schedule for Later
        </button>
        <Link to="/workout" className="btn-outline btn-large">
          <span>💪</span>
          Browse All Workouts
        </Link>
      </div>

      <div className="metrics-dashboard">
        <h4 className="metrics-title">Current Metrics (Adjust to see AI adapt)</h4>
        <div className="metrics-grid">
          <div className="metric-control">
            <label>Sleep Quality: {userMetrics.sleep}/10</label>
            <input
              type="range"
              min="1"
              max="10"
              value={userMetrics.sleep}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setUserMetrics({...userMetrics, sleep: value});
                updateActivity({ sleep: value });
              }}
            />
          </div>
          <div className="metric-control">
            <label>Stress Level: {userMetrics.stress}/10</label>
            <input
              type="range"
              min="1"
              max="10"
              value={userMetrics.stress}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setUserMetrics({...userMetrics, stress: value});
                updateActivity({ stress: value });
              }}
            />
          </div>
          <div className="metric-control">
            <label>Muscle Soreness: {userMetrics.soreness}/10</label>
            <input
              type="range"
              min="1"
              max="10"
              value={userMetrics.soreness}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setUserMetrics({...userMetrics, soreness: value});
                updateActivity({ soreness: value });
              }}
            />
          </div>
          <div className="metric-control">
            <label>Steps Today: {userMetrics.steps}</label>
            <input
              type="range"
              min="0"
              max="15000"
              step="500"
              value={userMetrics.steps}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setUserMetrics({...userMetrics, steps: value});
                updateActivity({ steps: value });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartWorkoutRecommendation;
