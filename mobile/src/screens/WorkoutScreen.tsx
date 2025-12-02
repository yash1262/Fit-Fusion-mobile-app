import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { IconLogo } from '../components/IconLogo';
import { LinearGradient } from 'expo-linear-gradient';
import { incrementActivity } from '../services/activityTrackingService';
import ScreenHeader from '../components/ScreenHeader';

interface Exercise {
  id: number;
  name: string;
  reps: string;
  completed: boolean;
}

interface Workout {
  id: number;
  name: string;
  icon: string;
  color: string;
  duration: string;
  calories: number;
  exercises: Exercise[];
}

const WorkoutScreen = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const workoutCategories: Workout[] = [
    {
      id: 1,
      name: 'HIIT',
      icon: 'fire',
      color: '#ff6b6b',
      duration: '20 min',
      calories: 250,
      exercises: [
        { id: 1, name: 'Jumping Jacks', reps: '3 sets × 20 reps', completed: false },
        { id: 2, name: 'Burpees', reps: '3 sets × 10 reps', completed: false },
        { id: 3, name: 'Mountain Climbers', reps: '3 sets × 15 reps', completed: false },
        { id: 4, name: 'High Knees', reps: '3 sets × 30 seconds', completed: false },
      ],
    },
    {
      id: 2,
      name: 'Strength',
      icon: 'dumbbell',
      color: '#708d50',
      duration: '30 min',
      calories: 200,
      exercises: [
        { id: 1, name: 'Push-ups', reps: '4 sets × 12 reps', completed: false },
        { id: 2, name: 'Squats', reps: '4 sets × 15 reps', completed: false },
        { id: 3, name: 'Plank', reps: '3 sets × 60 seconds', completed: false },
        { id: 4, name: 'Lunges', reps: '3 sets × 10 reps each leg', completed: false },
      ],
    },
    {
      id: 3,
      name: 'Yoga',
      icon: 'yoga',
      color: '#9b59b6',
      duration: '45 min',
      calories: 150,
      exercises: [
        { id: 1, name: 'Sun Salutation', reps: '5 rounds', completed: false },
        { id: 2, name: 'Warrior Pose', reps: '3 sets × 30 seconds each side', completed: false },
        { id: 3, name: 'Tree Pose', reps: '3 sets × 45 seconds each side', completed: false },
        { id: 4, name: 'Child Pose', reps: '2 minutes', completed: false },
      ],
    },
    {
      id: 4,
      name: 'Cardio',
      icon: 'run',
      color: '#3498db',
      duration: '25 min',
      calories: 300,
      exercises: [
        { id: 1, name: 'Running', reps: '10 minutes', completed: false },
        { id: 2, name: 'Jump Rope', reps: '5 minutes', completed: false },
        { id: 3, name: 'Sprint Intervals', reps: '5 sets × 30 seconds', completed: false },
        { id: 4, name: 'Cool Down Jog', reps: '5 minutes', completed: false },
      ],
    },
  ];

  // Timer effect
  React.useEffect(() => {
    if (isWorkoutActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isWorkoutActive, isPaused]);

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setExercises(workout.exercises.map((ex) => ({ ...ex, completed: false })));
    setIsWorkoutActive(true);
    setWorkoutTimer(0);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const toggleExerciseComplete = (exerciseId: number) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex))
    );
  };

  const completeWorkout = async () => {
    if (selectedWorkout) {
      const minutes = Math.floor(workoutTimer / 60);
      await incrementActivity('workoutsCompleted', 1);
      await incrementActivity('activeMinutes', minutes);
      await incrementActivity('calories', selectedWorkout.calories);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsWorkoutActive(false);
    setSelectedWorkout(null);
    setWorkoutTimer(0);
    setIsPaused(false);
    setExercises([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount = exercises.filter((ex) => ex.completed).length;
  const totalCount = exercises.length;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff' }}>
        <IconLogo type="workout" size={32} color="#708d50" />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#1a1a1a' }}>Workouts</Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Choose your workout type</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.workoutGrid}>
          {workoutCategories.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.workoutCard}
              onPress={() => startWorkout(workout)}
            >
              <LinearGradient
                colors={[workout.color, workout.color + 'dd']}
                style={styles.workoutGradient}
              >
                <Icon name={workout.icon as any} size={48} color="#fff" />
                <Text style={styles.workoutName}>{workout.name}</Text>
                <View style={styles.workoutInfo}>
                  <View style={styles.infoItem}>
                    <Icon name="clock-outline" size={16} color="#fff" />
                    <Text style={styles.infoText}>{workout.duration}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Icon name="fire" size={16} color="#fff" />
                    <Text style={styles.infoText}>{workout.calories} cal</Text>
                  </View>
                </View>
                <Text style={styles.exerciseCount}>{workout.exercises.length} exercises</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Workout Modal */}
      <Modal visible={isWorkoutActive} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Icon
              name={selectedWorkout?.icon as any}
              size={40}
              color={selectedWorkout?.color}
            />
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>{selectedWorkout?.name} Workout</Text>
              <Text style={styles.modalSubtitle}>
                {completedCount}/{totalCount} exercises completed
              </Text>
            </View>
          </View>

          {/* Timer Display */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(workoutTimer)}</Text>
            <Text style={styles.timerLabel}>{isPaused ? 'Paused' : 'In Progress'}</Text>
          </View>

          {/* Exercise List */}
          <ScrollView style={styles.exerciseList}>
            <Text style={styles.exerciseListTitle}>Exercises:</Text>
            {exercises.map((exercise, index) => (
              <TouchableOpacity
                key={exercise.id}
                style={[
                  styles.exerciseItem,
                  exercise.completed && styles.exerciseItemCompleted,
                ]}
                onPress={() => toggleExerciseComplete(exercise.id)}
              >
                <View style={styles.exerciseNumber}>
                  {exercise.completed ? (
                    <Icon name="check-circle" size={32} color="#4caf50" />
                  ) : (
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                  )}
                </View>
                <View style={styles.exerciseInfo}>
                  <Text
                    style={[
                      styles.exerciseName,
                      exercise.completed && styles.exerciseNameCompleted,
                    ]}
                  >
                    {exercise.name}
                  </Text>
                  <Text style={styles.exerciseReps}>{exercise.reps}</Text>
                </View>
                {!exercise.completed && (
                  <Icon name="checkbox-blank-circle-outline" size={32} color="#ccc" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Controls */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.pauseButton} onPress={togglePause}>
              <LinearGradient colors={['#ff9800', '#f57c00']} style={styles.buttonGradient}>
                <Icon name={isPaused ? 'play' : 'pause'} size={24} color="#fff" />
                <Text style={styles.buttonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.completeButton} onPress={completeWorkout}>
              <LinearGradient colors={['#4caf50', '#45a049']} style={styles.buttonGradient}>
                <Icon name="check-circle" size={24} color="#fff" />
                <Text style={styles.buttonText}>Complete</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                if (timerRef.current) clearInterval(timerRef.current);
                setIsWorkoutActive(false);
                setWorkoutTimer(0);
                setIsPaused(false);
                setExercises([]);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  workoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  workoutCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  workoutGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  workoutInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#fff',
  },
  exerciseCount: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  timerContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#708d50',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontWeight: '600',
  },
  exerciseList: {
    flex: 1,
    padding: 16,
  },
  exerciseListTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseItemCompleted: {
    backgroundColor: '#f0f7ed',
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  exerciseNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#708d50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  exerciseNameCompleted: {
    color: '#4caf50',
    textDecorationLine: 'line-through',
  },
  exerciseReps: {
    fontSize: 14,
    color: '#666',
  },
  modalActions: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  pauseButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default WorkoutScreen;
