import React, { useState, useEffect } from 'react';
import FitFusionLogo from "./FitFusionLogo";
import { Link } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
  completed: boolean;
}

interface WorkoutSession {
  id: string;
  name: string;
  exercises: Exercise[];
  duration: number;
  calories: number;
  startTime?: Date;
  icon: string;
  category: string;
  targetGoals: string[];
  experienceLevel: string[];
  equipment: string[];
}

interface UserProfile {
  fitnessGoal?: string;
  experienceLevel?: string;
  equipment?: string[];
  workoutPreference?: string;
}

const WorkoutTracker: React.FC = () => {
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendedWorkouts, setRecommendedWorkouts] = useState<string[]>([]);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const workoutTemplates: WorkoutSession[] = [
    {
      id: '1',
      name: 'Upper Body Strength',
      duration: 45,
      calories: 320,
      icon: '💪',
      category: 'Strength',
      targetGoals: ['build muscle', 'toning', 'maintain body'],
      experienceLevel: ['intermediate', 'advanced'],
      equipment: ['dumbbells', 'gym'],
      exercises: [
        { id: '1', name: 'Push-ups', sets: 3, reps: 12, weight: 0, rest: 60, completed: false },
        { id: '2', name: 'Dumbbell Bench Press', sets: 4, reps: 10, weight: 20, rest: 90, completed: false },
        { id: '3', name: 'Pull-ups', sets: 3, reps: 8, weight: 0, rest: 90, completed: false },
        { id: '4', name: 'Shoulder Press', sets: 3, reps: 12, weight: 15, rest: 60, completed: false },
      ]
    },
    {
      id: '2',
      name: 'HIIT Cardio',
      duration: 20,
      calories: 280,
      icon: '🔥',
      category: 'Cardio',
      targetGoals: ['lose weight', 'endurance', 'toning'],
      experienceLevel: ['beginner', 'intermediate', 'advanced'],
      equipment: ['none', 'home'],
      exercises: [
        { id: '5', name: 'Burpees', sets: 4, reps: 15, weight: 0, rest: 30, completed: false },
        { id: '6', name: 'Mountain Climbers', sets: 4, reps: 20, weight: 0, rest: 30, completed: false },
        { id: '7', name: 'Jump Squats', sets: 4, reps: 15, weight: 0, rest: 45, completed: false },
        { id: '8', name: 'High Knees', sets: 4, reps: 30, weight: 0, rest: 30, completed: false },
      ]
    },
    {
      id: '3',
      name: 'Lower Body Power',
      duration: 40,
      calories: 350,
      icon: '🦵',
      category: 'Strength',
      targetGoals: ['build muscle', 'toning', 'lose weight'],
      experienceLevel: ['intermediate', 'advanced'],
      equipment: ['dumbbells', 'gym'],
      exercises: [
        { id: '9', name: 'Squats', sets: 4, reps: 15, weight: 25, rest: 75, completed: false },
        { id: '10', name: 'Deadlifts', sets: 3, reps: 8, weight: 40, rest: 120, completed: false },
        { id: '11', name: 'Lunges', sets: 3, reps: 12, weight: 10, rest: 60, completed: false },
        { id: '12', name: 'Calf Raises', sets: 3, reps: 20, weight: 15, rest: 45, completed: false },
      ]
    },
    {
      id: '4',
      name: 'Core & Abs',
      duration: 25,
      calories: 200,
      icon: '🎯',
      category: 'Core',
      targetGoals: ['toning', 'build muscle', 'maintain body'],
      experienceLevel: ['beginner', 'intermediate', 'advanced'],
      equipment: ['none', 'home'],
      exercises: [
        { id: '13', name: 'Plank', sets: 3, reps: 60, weight: 0, rest: 45, completed: false },
        { id: '14', name: 'Crunches', sets: 4, reps: 20, weight: 0, rest: 30, completed: false },
        { id: '15', name: 'Russian Twists', sets: 3, reps: 30, weight: 5, rest: 45, completed: false },
        { id: '16', name: 'Leg Raises', sets: 3, reps: 15, weight: 0, rest: 60, completed: false },
      ]
    },
    {
      id: '5',
      name: 'Full Body Circuit',
      duration: 35,
      calories: 400,
      icon: '🏃',
      category: 'Circuit',
      targetGoals: ['lose weight', 'toning', 'endurance'],
      experienceLevel: ['beginner', 'intermediate'],
      equipment: ['none', 'home', 'dumbbells'],
      exercises: [
        { id: '17', name: 'Burpees', sets: 3, reps: 12, weight: 0, rest: 60, completed: false },
        { id: '18', name: 'Squats', sets: 3, reps: 15, weight: 20, rest: 60, completed: false },
        { id: '19', name: 'Push-ups', sets: 3, reps: 15, weight: 0, rest: 45, completed: false },
        { id: '20', name: 'Jumping Jacks', sets: 3, reps: 30, weight: 0, rest: 30, completed: false },
      ]
    },
    {
      id: '6',
      name: 'Yoga & Flexibility',
      duration: 30,
      calories: 150,
      icon: '🧘',
      category: 'Flexibility',
      targetGoals: ['flexibility', 'maintain body', 'stress relief'],
      experienceLevel: ['beginner', 'intermediate', 'advanced'],
      equipment: ['none', 'home'],
      exercises: [
        { id: '21', name: 'Sun Salutations', sets: 3, reps: 5, weight: 0, rest: 30, completed: false },
        { id: '22', name: 'Warrior Pose', sets: 2, reps: 60, weight: 0, rest: 45, completed: false },
        { id: '23', name: 'Downward Dog', sets: 3, reps: 45, weight: 0, rest: 30, completed: false },
        { id: '24', name: 'Child Pose', sets: 2, reps: 90, weight: 0, rest: 0, completed: false },
      ]
    },
    {
      id: '7',
      name: 'Chest & Triceps',
      duration: 40,
      calories: 300,
      icon: '💪',
      category: 'Strength',
      targetGoals: ['build muscle', 'toning'],
      experienceLevel: ['intermediate', 'advanced'],
      equipment: ['gym', 'dumbbells'],
      exercises: [
        { id: '25', name: 'Bench Press', sets: 4, reps: 10, weight: 30, rest: 90, completed: false },
        { id: '26', name: 'Incline Dumbbell Press', sets: 3, reps: 12, weight: 15, rest: 75, completed: false },
        { id: '27', name: 'Tricep Dips', sets: 3, reps: 12, weight: 0, rest: 60, completed: false },
        { id: '28', name: 'Cable Flyes', sets: 3, reps: 15, weight: 10, rest: 60, completed: false },
      ]
    },
    {
      id: '8',
      name: 'Back & Biceps',
      duration: 40,
      calories: 310,
      icon: '💪',
      category: 'Strength',
      targetGoals: ['build muscle', 'toning'],
      experienceLevel: ['intermediate', 'advanced'],
      equipment: ['gym', 'dumbbells'],
      exercises: [
        { id: '29', name: 'Pull-ups', sets: 4, reps: 8, weight: 0, rest: 90, completed: false },
        { id: '30', name: 'Barbell Rows', sets: 4, reps: 10, weight: 25, rest: 90, completed: false },
        { id: '31', name: 'Bicep Curls', sets: 3, reps: 12, weight: 12, rest: 60, completed: false },
        { id: '32', name: 'Hammer Curls', sets: 3, reps: 12, weight: 10, rest: 60, completed: false },
      ]
    },
    {
      id: '9',
      name: 'Legs & Glutes',
      duration: 45,
      calories: 380,
      icon: '🍑',
      category: 'Strength',
      targetGoals: ['build muscle', 'toning', 'lose weight'],
      experienceLevel: ['intermediate', 'advanced'],
      equipment: ['gym', 'dumbbells'],
      exercises: [
        { id: '33', name: 'Bulgarian Split Squats', sets: 3, reps: 12, weight: 15, rest: 75, completed: false },
        { id: '34', name: 'Hip Thrusts', sets: 4, reps: 15, weight: 30, rest: 90, completed: false },
        { id: '35', name: 'Leg Press', sets: 4, reps: 12, weight: 50, rest: 90, completed: false },
        { id: '36', name: 'Glute Bridges', sets: 3, reps: 20, weight: 20, rest: 60, completed: false },
      ]
    },
  ];

  // Load user profile and calculate recommendations
  useEffect(() => {
    const loadUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile({
              fitnessGoal: data.fitnessGoal,
              experienceLevel: data.experienceLevel,
              equipment: data.equipment || [],
              workoutPreference: data.workoutPreference
            });
            
            // Calculate recommended workouts
            const recommended = calculateRecommendations(data);
            setRecommendedWorkouts(recommended);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };

    loadUserProfile();
  }, []);

  // Workout timer - counts up during workout
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isWorkoutStarted && !isResting && !isTimerPaused) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutStarted, isResting, isTimerPaused]);

  // Rest timer - counts down during rest
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isResting && restTimer > 0 && !isTimerPaused) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, restTimer, isTimerPaused]);

  const calculateRecommendations = (profile: any): string[] => {
    const recommended: string[] = [];
    const goal = profile.fitnessGoal?.toLowerCase() || '';
    const level = profile.experienceLevel?.toLowerCase() || '';
    
    workoutTemplates.forEach(workout => {
      let score = 0;
      
      // Match fitness goal
      if (workout.targetGoals.some(g => goal.includes(g))) {
        score += 3;
      }
      
      // Match experience level
      if (workout.experienceLevel.includes(level)) {
        score += 2;
      }
      
      // Match equipment
      const userEquipment = profile.equipment || [];
      if (workout.equipment.some(eq => userEquipment.includes(eq) || eq === 'none')) {
        score += 1;
      }
      
      // Add to recommended if score is high enough
      if (score >= 3) {
        recommended.push(workout.id);
      }
    });
    
    return recommended;
  };

  // Sort workouts: recommended first
  const sortedWorkouts = [...workoutTemplates].sort((a, b) => {
    const aRecommended = recommendedWorkouts.includes(a.id);
    const bRecommended = recommendedWorkouts.includes(b.id);
    if (aRecommended && !bRecommended) return -1;
    if (!aRecommended && bRecommended) return 1;
    return 0;
  });

  const startWorkout = (workout: WorkoutSession) => {
    setActiveWorkout({
      ...workout,
      startTime: new Date(),
      exercises: workout.exercises.map(ex => ({ ...ex, completed: false }))
    });
    setIsWorkoutStarted(true);
    setCurrentExerciseIndex(0);
    setTimer(0);
    setIsTimerPaused(false);
  };

  const completeExercise = (exerciseId: string) => {
    if (!activeWorkout) return;
    
    const updatedExercises = activeWorkout.exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, completed: true } : ex
    );
    
    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });

    // Move to next exercise or complete workout
    const completedCount = updatedExercises.filter(ex => ex.completed).length;
    if (completedCount === updatedExercises.length) {
      completeWorkout();
    } else {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      startRest();
    }
  };

  const startRest = () => {
    setIsResting(true);
    const currentExercise = activeWorkout?.exercises[currentExerciseIndex];
    if (currentExercise) {
      setRestTimer(currentExercise.rest);
    }
  };

  const completeWorkout = () => {
    setIsWorkoutStarted(false);
    setActiveWorkout(null);
    setCurrentExerciseIndex(0);
    setTimer(0);
    setIsResting(false);
    setRestTimer(0);
    setIsTimerPaused(false);
  };

  const toggleTimer = () => {
    setIsTimerPaused(prev => !prev);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="workout-page">
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
              <li><Link to="/workout" className="nav-link active">Workouts</Link></li>
              <li><Link to="/diet" className="nav-link">Nutrition</Link></li>
              <li><Link to="/progress" className="nav-link">Progress</Link></li>
              <li><Link to="/contact" className="nav-link">Support</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="workout-container">
        <div className="container">
          {!isWorkoutStarted ? (
            /* Workout Selection */
            <div className="workout-selection">
              <div className="page-header">
                <h1 className="page-title">Choose Your Workout</h1>
                <p className="page-description">
                  Select a workout program tailored to your fitness goals and get started on your journey to better health.
                </p>
              </div>

              <div className="workout-templates">
                {sortedWorkouts.map((workout) => {
                  const isRecommended = recommendedWorkouts.includes(workout.id);
                  return (
                  <div key={workout.id} className={`workout-card ${isRecommended ? 'recommended' : ''}`}>
                    {isRecommended && (
                      <div className="recommended-badge">
                        <span className="badge-icon">⭐</span>
                        Recommended for You
                      </div>
                    )}
                    <div className="workout-icon-large">{workout.icon}</div>
                    <div className="workout-header">
                      <h3 className="workout-name">{workout.name}</h3>
                      <div className="workout-category">{workout.category}</div>
                      <div className="workout-stats">
                        <div className="stat-item">
                          <span className="stat-icon">⏱️</span>
                          <span className="stat-value">{workout.duration} min</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-icon">🔥</span>
                          <span className="stat-value">{workout.calories} cal</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-icon">💪</span>
                          <span className="stat-value">{workout.exercises.length} exercises</span>
                        </div>
                      </div>
                    </div>

                    <div className="exercise-preview">
                      <h4 className="preview-title">Exercises:</h4>
                      <div className="exercise-list">
                        {workout.exercises.map((exercise, index) => (
                          <div key={exercise.id} className="exercise-item">
                            <span className="exercise-number">{index + 1}</span>
                            <span className="exercise-name">{exercise.name}</span>
                            <span className="exercise-details">
                              {exercise.sets} × {exercise.reps} {exercise.weight > 0 && `@ ${exercise.weight}kg`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => startWorkout(workout)}
                      className="btn btn-primary btn-start-workout"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Start Workout
                    </button>
                  </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Workout - Split Screen Layout */
            <div className="active-workout-split">
              {/* Left Side - Workout Details */}
              <div className="workout-details-panel">
                <div className="workout-header-split">
                  <h1 className="workout-title-split">{activeWorkout?.name}</h1>
                  <div className="workout-meta-split">
                    <span className="meta-item">⏱️ {activeWorkout?.duration} min</span>
                    <span className="meta-item">🔥 {activeWorkout?.calories} cal</span>
                    <span className="meta-item">💪 {activeWorkout?.exercises.length} exercises</span>
                  </div>
                </div>

                {/* All Exercises List */}
                <div className="exercises-list-panel">
                  <h3 className="panel-title">Workout Exercises</h3>
                  {activeWorkout?.exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className={`exercise-card-split ${
                        exercise.completed ? 'completed' :
                        index === currentExerciseIndex ? 'current' : 'pending'
                      }`}
                    >
                      <div className="exercise-status-icon">
                        {exercise.completed ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        ) : index === currentExerciseIndex ? (
                          <div className="current-pulse">▶</div>
                        ) : (
                          <div className="pending-number">{index + 1}</div>
                        )}
                      </div>
                      <div className="exercise-content-split">
                        <div className="exercise-name-split">{exercise.name}</div>
                        <div className="exercise-specs">
                          <span className="spec-badge">Sets: {exercise.sets}</span>
                          <span className="spec-badge">Reps: {exercise.reps}</span>
                          {exercise.weight > 0 && <span className="spec-badge">Weight: {exercise.weight}kg</span>}
                          <span className="spec-badge">Rest: {exercise.rest}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Timer & Controls */}
              <div className="timer-control-panel">
                {isResting ? (
                  /* Rest Mode */
                  <div className="timer-section-rest">
                    <div className="rest-icon-large">😌</div>
                    <h2 className="timer-title">Rest Time</h2>
                    <div className="circular-timer rest-mode">
                      <svg className="timer-svg" viewBox="0 0 200 200">
                        <circle className="timer-circle-bg" cx="100" cy="100" r="90" />
                        <circle 
                          className="timer-circle-progress" 
                          cx="100" 
                          cy="100" 
                          r="90"
                          style={{
                            strokeDasharray: `${2 * Math.PI * 90}`,
                            strokeDashoffset: `${2 * Math.PI * 90 * (1 - restTimer / (activeWorkout?.exercises[currentExerciseIndex]?.rest || 60))}`
                          }}
                        />
                      </svg>
                      <div className="timer-text">
                        <div className="timer-value">{formatTime(restTimer)}</div>
                        <div className="timer-label-small">Rest</div>
                      </div>
                    </div>
                    <div className="timer-controls">
                      <button
                        onClick={() => {
                          setIsResting(false);
                          setRestTimer(0);
                        }}
                        className="btn-timer btn-skip"
                      >
                        Skip Rest
                      </button>
                      <button
                        onClick={() => setRestTimer(prev => prev + 30)}
                        className="btn-timer btn-add"
                      >
                        +30s
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Active Exercise Mode */
                  <div className="timer-section-active">
                    <div className="current-exercise-info">
                      <h2 className="current-exercise-title">
                        {activeWorkout?.exercises[currentExerciseIndex]?.name}
                      </h2>
                      <div className="exercise-progress-badge">
                        Exercise {currentExerciseIndex + 1} of {activeWorkout?.exercises.length}
                      </div>
                    </div>

                    {/* Circular Timer */}
                    <div className="circular-timer">
                      <svg className="timer-svg" viewBox="0 0 200 200">
                        <circle className="timer-circle-bg" cx="100" cy="100" r="90" />
                        <circle 
                          className="timer-circle-progress" 
                          cx="100" 
                          cy="100" 
                          r="90"
                          style={{
                            strokeDasharray: `${2 * Math.PI * 90}`,
                            strokeDashoffset: `${2 * Math.PI * 90 * (1 - (timer % 60) / 60)}`
                          }}
                        />
                      </svg>
                      <div className="timer-text">
                        <div className="timer-value">{formatTime(timer)}</div>
                        <div className="timer-label-small">Total Time</div>
                      </div>
                    </div>

                    {/* Start/Pause/Stop Controls */}
                    <div className="timer-controls">
                      <button
                        onClick={toggleTimer}
                        className={`btn-timer ${isTimerPaused ? 'btn-start' : 'btn-pause'}`}
                      >
                        {isTimerPaused ? '▶ Start Timer' : '⏸ Pause Timer'}
                      </button>
                      <button
                        onClick={() => completeExercise(activeWorkout?.exercises[currentExerciseIndex]?.id || '')}
                        className="btn-timer btn-complete"
                      >
                        ✓ Complete Exercise
                      </button>
                      <button
                        onClick={completeWorkout}
                        className="btn-timer btn-stop"
                      >
                        ■ End Workout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .workout-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* Navigation (reusing from other components) */
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
        .workout-container {
          padding: 2rem 0;
        }

        /* Page Header */
        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .page-description {
          font-size: 1.125rem;
          color: #1a1a1a;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Workout Templates */
        .workout-templates {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .workout-card {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 2px solid rgba(0, 0, 0, 0.05);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .workout-card.recommended {
          border-color: #708d50;
          background: linear-gradient(135deg, rgba(112, 141, 80, 0.05), rgba(255, 255, 255, 1));
        }

        .workout-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .recommended-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(112, 141, 80, 0.3);
        }

        .badge-icon {
          font-size: 1rem;
        }

        .workout-icon-large {
          font-size: 4rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .workout-category {
          display: inline-block;
          background: rgba(112, 141, 80, 0.1);
          color: #708d50;
          padding: 0.375rem 0.875rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .workout-header {
          margin-bottom: 1.5rem;
        }

        .workout-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .workout-stats {
          display: flex;
          gap: 1.5rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          color: #1a1a1a;
        }

        .stat-icon {
          font-size: 1.125rem;
        }

        .stat-value {
          font-weight: 700;
          color: #1a1a1a;
        }

        .exercise-preview {
          margin-bottom: 2rem;
        }

        .preview-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .exercise-list {
          display: grid;
          gap: 0.75rem;
        }

        .exercise-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 12px;
        }

        .exercise-number {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .exercise-name {
          flex: 1;
          font-weight: 500;
          color: #1a1a1a;
        }

        .exercise-details {
          font-size: 0.875rem;
          color: #1a1a1a;
          font-weight: 600;
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          box-shadow: 0 8px 20px rgba(112, 141, 80, 0.3);
        }

        .btn-primary:hover {
          box-shadow: 0 12px 30px rgba(112, 141, 80, 0.4);
        }

        .btn-outline {
          background: transparent;
          color: #708d50;
          border: 2px solid #708d50;
        }

        .btn-outline:hover {
          background: rgba(112, 141, 80, 0.05);
        }

        .btn-start-workout {
          width: 100%;
          font-size: 1.1rem;
        }

        /* Active Workout - Split Screen */
        .active-workout-split {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          min-height: calc(100vh - 200px);
        }

        /* Left Panel - Workout Details */
        .workout-details-panel {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          overflow-y: auto;
          max-height: calc(100vh - 200px);
        }

        .workout-header-split {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .workout-title-split {
          font-size: 2rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .workout-meta-split {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .meta-item {
          background: #f8fafc;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-weight: 600;
          color: #1a1a1a;
          font-size: 0.95rem;
        }

        .exercises-list-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panel-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .exercise-card-split {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          border-radius: 16px;
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        }

        .exercise-card-split.current {
          background: linear-gradient(135deg, rgba(112, 141, 80, 0.1), rgba(255, 255, 255, 1));
          border-color: #708d50;
          box-shadow: 0 4px 16px rgba(112, 141, 80, 0.2);
        }

        .exercise-card-split.completed {
          background: rgba(16, 185, 129, 0.05);
          border-color: #10b981;
          opacity: 0.7;
        }

        .exercise-card-split.pending {
          background: white;
        }

        .exercise-status-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .exercise-card-split.current .exercise-status-icon {
          background: #708d50;
          color: white;
        }

        .exercise-card-split.completed .exercise-status-icon {
          background: #10b981;
          color: white;
        }

        .exercise-card-split.pending .exercise-status-icon {
          background: #e0e0e0;
          color: #1a1a1a;
          font-weight: 700;
        }

        .current-pulse {
          animation: pulse-icon 1.5s ease-in-out infinite;
        }

        @keyframes pulse-icon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .pending-number {
          font-weight: 700;
          font-size: 1.1rem;
        }

        .exercise-content-split {
          flex: 1;
        }

        .exercise-name-split {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
        }

        .exercise-specs {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .spec-badge {
          background: #f0f0f0;
          padding: 0.375rem 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        /* Right Panel - Timer & Controls */
        .timer-control-panel {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .timer-section-active,
        .timer-section-rest {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          width: 100%;
        }

        .current-exercise-info {
          text-align: center;
        }

        .current-exercise-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .exercise-progress-badge {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          display: inline-block;
        }

        .rest-icon-large {
          font-size: 4rem;
        }

        .timer-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          text-align: center;
        }

        /* Circular Timer */
        .circular-timer {
          position: relative;
          width: 250px;
          height: 250px;
        }

        .timer-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .timer-circle-bg {
          fill: none;
          stroke: #f0f0f0;
          stroke-width: 12;
        }

        .timer-circle-progress {
          fill: none;
          stroke: #708d50;
          stroke-width: 12;
          stroke-linecap: round;
          transition: stroke-dashoffset 1s linear;
        }

        .timer-section-rest .timer-circle-progress {
          stroke: #f59e0b;
        }

        .timer-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .timer-value {
          font-size: 3rem;
          font-weight: 800;
          color: #1a1a1a;
          font-family: monospace;
          line-height: 1;
        }

        .timer-label-small {
          font-size: 0.875rem;
          color: #6a6a6a;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        /* Timer Controls */
        .timer-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .btn-timer {
          padding: 1rem 2rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.05rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .btn-start {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }

        .btn-start:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4);
        }

        .btn-pause {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
        }

        .btn-pause:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(245, 158, 11, 0.4);
        }

        .btn-complete {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          box-shadow: 0 8px 20px rgba(112, 141, 80, 0.3);
        }

        .btn-complete:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(112, 141, 80, 0.4);
        }

        .btn-stop {
          background: #ef4444;
          color: white;
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
        }

        .btn-stop:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(239, 68, 68, 0.4);
        }

        .btn-skip {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          box-shadow: 0 8px 20px rgba(112, 141, 80, 0.3);
        }

        .btn-skip:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(112, 141, 80, 0.4);
        }

        .btn-add {
          background: transparent;
          color: #708d50;
          border: 2px solid #708d50;
        }

        .btn-add:hover {
          background: rgba(112, 141, 80, 0.1);
        }

        .workout-header-active {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 2rem;
          border-radius: 24px;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .workout-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .workout-progress {
          font-size: 1rem;
          color: #1a1a1a;
          font-weight: 600;
        }

        .timer-display {
          font-size: 2.5rem;
          font-weight: 800;
          color: #708d50;
          font-family: monospace;
        }

        .timer-label {
          font-size: 0.875rem;
          color: #1a1a1a;
          text-align: center;
          font-weight: 600;
        }

        /* Rest Screen */
        .rest-screen {
          background: white;
          border-radius: 24px;
          padding: 4rem;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .rest-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .rest-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .rest-timer {
          font-size: 3rem;
          font-weight: 800;
          color: #f59e0b;
          font-family: monospace;
          margin-bottom: 1rem;
        }

        .rest-description {
          font-size: 1.125rem;
          color: #1a1a1a;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .rest-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        /* Exercise Screen */
        .exercise-screen {
          display: grid;
          gap: 2rem;
        }

        .exercise-card-active {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .exercise-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .exercise-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .exercise-number-badge {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .exercise-details-active {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .detail-item {
          text-align: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 16px;
        }

        .detail-label {
          font-size: 0.875rem;
          color: #1a1a1a;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1a1a1a;
        }

        .exercise-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-complete {
          flex: 1;
          font-size: 1.1rem;
        }

        .btn-end {
          padding: 0.875rem 1.5rem;
        }

        /* Exercise List Active */
        .exercise-list-active {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .list-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .exercises-grid {
          display: grid;
          gap: 1rem;
        }

        .exercise-item-active {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .exercise-item-active.completed {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .exercise-item-active.current {
          background: rgba(112, 141, 80, 0.1);
          border-color: rgba(112, 141, 80, 0.3);
        }

        .exercise-status {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .exercise-item-active.completed .exercise-status {
          background: #10b981;
          color: white;
        }

        .exercise-item-active.current .exercise-status {
          background: #708d50;
          color: white;
        }

        .pending-indicator {
          background: #e2e8f0;
          color: #1a1a1a;
          width: 100%;
          height: 100%;
          display: flex;
          font-weight: 600;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .current-indicator {
          color: #708d50;
          font-size: 1rem;
        }

        .exercise-info {
          flex: 1;
        }

        .exercise-item-active .exercise-name {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .exercise-params {
          font-size: 0.875rem;
          color: #1a1a1a;
          font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .active-workout-split {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .workout-details-panel {
            max-height: none;
          }

          .timer-control-panel {
            position: relative;
            top: 0;
          }

          .circular-timer {
            width: 200px;
            height: 200px;
          }

          .timer-value {
            font-size: 2.5rem;
          }

          .workout-container {
            padding: 1.5rem 0;
          }

          .workout-templates {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .workout-card {
            padding: 1.5rem;
          }

          .workout-header-active {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .rest-screen {
            padding: 2rem;
          }

          .rest-timer {
            font-size: 2.5rem;
          }

          .exercise-details-active {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .exercise-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default WorkoutTracker;
