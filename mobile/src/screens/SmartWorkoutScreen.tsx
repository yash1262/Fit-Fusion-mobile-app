import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getTodayActivity, incrementActivity } from '../services/activityTrackingService';
import ScreenHeader from '../components/ScreenHeader';
import { MoodLogo } from '../components/MoodLogo';
import { IconLogo } from '../components/IconLogo';
// Voice service temporarily disabled for Expo Go compatibility
// import { voiceService } from '../services/voiceService';

interface WorkoutRecommendation {
  emoji: string;
  name: string;
  title: string;
  duration: string;
  exercises: string[];
  intensity: string;
  motivation: string;
  videoLinks: Array<{ title: string; url: string }>;
}

const SmartWorkoutScreen = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [todayActivity, setTodayActivity] = useState<any>(null);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    const activity = await getTodayActivity();
    setTodayActivity(activity);
  };

  const moods = [
    { id: 'happy', name: 'Happy', color: '#4caf50' },
    { id: 'sad', name: 'Sad', color: '#2196f3' },
    { id: 'stressed', name: 'Stressed', color: '#ff9800' },
    { id: 'energetic', name: 'Energetic', color: '#ff6b6b' },
    { id: 'tired', name: 'Tired', color: '#9c27b0' },
    { id: 'motivated', name: 'Motivated', color: '#708d50' },
  ];

  const workoutRecommendations: Record<string, WorkoutRecommendation> = {
    happy: {
      emoji: 'happy',
      name: 'Happy',
      title: 'High-Energy Dance Workout',
      duration: '30 minutes',
      exercises: [
        'Jumping Jacks - 3 sets × 20 reps',
        'Dance Cardio - 10 minutes',
        'Burpees - 3 sets × 10 reps',
        'Mountain Climbers - 3 sets × 15 reps',
        'Cool Down Stretching - 5 minutes',
      ],
      intensity: 'High',
      motivation:
        "You're already feeling great! Let's amplify that energy with an exciting workout. Your positive vibes will make this session amazing!",
      videoLinks: [
        { title: '20 Min HIIT Cardio Workout', url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI' },
        { title: 'Full Body HIIT Workout', url: 'https://www.youtube.com/watch?v=M0uO8X3_tEA' },
        { title: 'Dance Cardio Workout', url: 'https://www.youtube.com/watch?v=gC_L9qAHVJ8' },
        { title: 'High Energy Cardio', url: 'https://www.youtube.com/watch?v=2MfE8TxFZYk' },
        { title: 'Jumping Jacks Tutorial', url: 'https://www.youtube.com/watch?v=UpH7rm0cYbM' },
        { title: 'Burpees Guide', url: 'https://www.youtube.com/watch?v=TU8QYVW0gDU' },
        { title: 'Mountain Climbers', url: 'https://www.youtube.com/watch?v=nmwgirgXLYM' },
        { title: 'HIIT for Beginners', url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI' },
        { title: 'Cardio Blast Workout', url: 'https://www.youtube.com/watch?v=M0uO8X3_tEA' },
        { title: 'Dance Fitness Fun', url: 'https://www.youtube.com/watch?v=gC_L9qAHVJ8' },
      ],
    },
    sad: {
      emoji: 'sad',
      name: 'Sad',
      title: 'Gentle Mood-Lifting Yoga',
      duration: '25 minutes',
      exercises: [
        'Child Pose - 2 minutes',
        'Cat-Cow Stretch - 3 minutes',
        'Gentle Forward Fold - 3 minutes',
        'Seated Twist - 2 minutes each side',
        'Legs Up the Wall - 5 minutes',
        'Savasana - 5 minutes',
      ],
      intensity: 'Low',
      motivation:
        "It's okay to feel sad. Movement can be medicine for the soul. Take it slow, be gentle with yourself. You're doing great just by showing up.",
      videoLinks: [
        { title: 'Gentle Yoga Flow', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE' },
        { title: 'Yoga for Beginners', url: 'https://www.youtube.com/watch?v=4pKly2JojMw' },
        { title: 'Relaxing Yoga', url: 'https://www.youtube.com/watch?v=COp7BR_Dvps' },
        { title: 'Mood Lifting Yoga', url: 'https://www.youtube.com/watch?v=sTANio_2E0Q' },
        { title: 'Child Pose Tutorial', url: 'https://www.youtube.com/watch?v=2MfE8TxFZYk' },
        { title: 'Cat-Cow Stretch', url: 'https://www.youtube.com/watch?v=kqnua4rHVVA' },
        { title: 'Forward Fold Guide', url: 'https://www.youtube.com/watch?v=g_tea8ZNk5A' },
        { title: 'Seated Twist', url: 'https://www.youtube.com/watch?v=Yz_qqzVvhao' },
        { title: 'Legs Up Wall Pose', url: 'https://www.youtube.com/watch?v=pAzJZRPqUXE' },
        { title: 'Savasana Relaxation', url: 'https://www.youtube.com/watch?v=1ZXeWfEN8Yo' },
      ],
    },
    stressed: {
      emoji: 'stressed',
      name: 'Stressed',
      title: 'Stress-Relief Flow',
      duration: '20 minutes',
      exercises: [
        'Deep Breathing - 3 minutes',
        'Neck & Shoulder Rolls - 2 minutes',
        'Gentle Yoga Flow - 10 minutes',
        'Progressive Muscle Relaxation - 3 minutes',
        'Meditation - 2 minutes',
      ],
      intensity: 'Low-Medium',
      motivation:
        "Stress is temporary. This workout will help release tension and bring clarity. Breathe, move, and let go. You've got this!",
      videoLinks: [
        { title: 'Stress Relief Yoga', url: 'https://www.youtube.com/watch?v=_zbtKeeAa-Y' },
        { title: 'Breathing Exercises', url: 'https://www.youtube.com/watch?v=tybOi4hjZFQ' },
        { title: 'Neck & Shoulder Relief', url: 'https://www.youtube.com/watch?v=X3-gKPNyrTA' },
        { title: 'Gentle Flow Yoga', url: 'https://www.youtube.com/watch?v=COp7BR_Dvps' },
        { title: 'Progressive Relaxation', url: 'https://www.youtube.com/watch?v=86HUcX8ZtAk' },
        { title: 'Meditation Guide', url: 'https://www.youtube.com/watch?v=inpok4MKVLM' },
        { title: 'Stress Management', url: 'https://www.youtube.com/watch?v=_zbtKeeAa-Y' },
        { title: 'Calming Yoga Flow', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE' },
        { title: 'Deep Breathing', url: 'https://www.youtube.com/watch?v=tybOi4hjZFQ' },
        { title: 'Tension Release', url: 'https://www.youtube.com/watch?v=X3-gKPNyrTA' },
      ],
    },
    energetic: {
      emoji: 'energetic',
      name: 'Energetic',
      title: 'Power HIIT Session',
      duration: '35 minutes',
      exercises: [
        'Warm-up Jog - 5 minutes',
        'Sprint Intervals - 10 minutes',
        'Box Jumps - 3 sets × 12 reps',
        'Kettlebell Swings - 3 sets × 15 reps',
        'Battle Ropes - 3 sets × 30 seconds',
        'Cool Down - 5 minutes',
      ],
      intensity: 'Very High',
      motivation:
        "Channel that energy! You're ready to crush this workout. Push your limits and feel the power within you!",
      videoLinks: [
        { title: 'Power HIIT Workout', url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI' },
        { title: 'Sprint Intervals', url: 'https://www.youtube.com/watch?v=M0uO8X3_tEA' },
        { title: 'Box Jumps Tutorial', url: 'https://www.youtube.com/watch?v=NBY9-kTuHEk' },
        { title: 'Kettlebell Swings', url: 'https://www.youtube.com/watch?v=YSxHifyI6s8' },
        { title: 'Battle Ropes Workout', url: 'https://www.youtube.com/watch?v=w8ZwMyVxSr8' },
        { title: 'High Intensity Training', url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI' },
        { title: 'Explosive Exercises', url: 'https://www.youtube.com/watch?v=M0uO8X3_tEA' },
        { title: 'Plyometric Training', url: 'https://www.youtube.com/watch?v=NBY9-kTuHEk' },
        { title: 'Power Workout', url: 'https://www.youtube.com/watch?v=YSxHifyI6s8' },
        { title: 'Intense Cardio', url: 'https://www.youtube.com/watch?v=w8ZwMyVxSr8' },
      ],
    },
    tired: {
      emoji: 'tired',
      name: 'Tired',
      title: 'Restorative Stretching',
      duration: '15 minutes',
      exercises: [
        'Gentle Neck Stretches - 2 minutes',
        'Shoulder Rolls - 2 minutes',
        'Seated Forward Bend - 3 minutes',
        'Supine Twist - 2 minutes each side',
        'Legs Up Wall - 4 minutes',
      ],
      intensity: 'Very Low',
      motivation:
        'Rest is productive. This gentle session will help restore your energy. Listen to your body and honor what it needs.',
      videoLinks: [
        { title: 'Gentle Stretching', url: 'https://www.youtube.com/watch?v=g_tea8ZNk5A' },
        { title: 'Restorative Yoga', url: 'https://www.youtube.com/watch?v=COp7BR_Dvps' },
        { title: 'Neck Stretches', url: 'https://www.youtube.com/watch?v=X3-gKPNyrTA' },
        { title: 'Shoulder Rolls', url: 'https://www.youtube.com/watch?v=kqnua4rHVVA' },
        { title: 'Forward Bend', url: 'https://www.youtube.com/watch?v=g_tea8ZNk5A' },
        { title: 'Supine Twist', url: 'https://www.youtube.com/watch?v=Yz_qqzVvhao' },
        { title: 'Legs Up Wall', url: 'https://www.youtube.com/watch?v=pAzJZRPqUXE' },
        { title: 'Relaxation Techniques', url: 'https://www.youtube.com/watch?v=1ZXeWfEN8Yo' },
        { title: 'Recovery Stretches', url: 'https://www.youtube.com/watch?v=g_tea8ZNk5A' },
        { title: 'Gentle Movement', url: 'https://www.youtube.com/watch?v=COp7BR_Dvps' },
      ],
    },
    motivated: {
      emoji: 'motivated',
      name: 'Motivated',
      title: 'Full Body Strength Training',
      duration: '40 minutes',
      exercises: [
        'Warm-up - 5 minutes',
        'Squats - 4 sets × 12 reps',
        'Push-ups - 4 sets × 15 reps',
        'Deadlifts - 4 sets × 10 reps',
        'Plank - 3 sets × 60 seconds',
        'Pull-ups - 3 sets × 8 reps',
        'Cool Down - 5 minutes',
      ],
      intensity: 'High',
      motivation:
        "You're on fire! This is your moment. Give it everything you've got and watch yourself grow stronger!",
      videoLinks: [
        { title: 'Full Body Strength', url: 'https://www.youtube.com/watch?v=UBMk30rjy0o' },
        { title: 'Squats Tutorial', url: 'https://www.youtube.com/watch?v=aclHkVaku9U' },
        { title: 'Push-ups Guide', url: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
        { title: 'Deadlifts Form', url: 'https://www.youtube.com/watch?v=op9kVnSso6Q' },
        { title: 'Plank Variations', url: 'https://www.youtube.com/watch?v=pSHjTRCQxIw' },
        { title: 'Pull-ups Tutorial', url: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
        { title: 'Strength Training', url: 'https://www.youtube.com/watch?v=UBMk30rjy0o' },
        { title: 'Muscle Building', url: 'https://www.youtube.com/watch?v=aclHkVaku9U' },
        { title: 'Power Exercises', url: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
        { title: 'Compound Movements', url: 'https://www.youtube.com/watch?v=op9kVnSso6Q' },
      ],
    },
  };

  const getSmartRecommendation = () => {
    if (!todayActivity) return null;

    const { steps, activeMinutes, sleep, stress } = todayActivity;

    // AI logic based on activity data
    if (stress >= 7) return 'stressed';
    if (sleep < 6) return 'tired';
    if (steps > 8000 && activeMinutes > 45) return 'energetic';
    if (steps < 2000 && activeMinutes < 15) return 'tired';
    if (activeMinutes > 30) return 'motivated';

    return 'happy'; // default
  };

  const handleMoodSelect = async (moodId: string) => {
    setSelectedMood(moodId);
    
    // Speak mood greeting if voice is enabled
    if (voiceEnabled) {
      const workout = workoutRecommendations[moodId];
      const moodName = workout.name.toLowerCase();
      const greeting = getTimeBasedGreeting();
      
      const speechText = `${greeting}! I see you're feeling ${moodName} today. ${workout.motivation} Here's your workout: ${workout.title}. This is a ${workout.duration} ${workout.intensity} intensity workout. Let's get started!`;
      
      // Voice service disabled for Expo Go
      // await voiceService.speak(speechText, {
      //   rate: 0.92,
      //   pitch: 1.05,
      //   onStart: () => setIsSpeaking(true),
      //   onDone: () => setIsSpeaking(false),
      //   onError: () => setIsSpeaking(false),
      // });
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = async () => {
    if (!selectedMood) return;

    const workout = workoutRecommendations[selectedMood];
    setIsWorkoutActive(true);
    setWorkoutTimer(0);
    setIsPaused(false);
    
    // Speak workout start motivation - disabled for Expo Go
    // if (voiceEnabled) {
    //   await voiceService.speakWorkoutMotivation(workout.title, workout.duration);
    // }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const completeWorkout = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const minutes = Math.floor(workoutTimer / 60);
    await incrementActivity('workoutsCompleted', 1);
    await incrementActivity('activeMinutes', minutes);
    await incrementActivity('calories', 200);
    
    setIsWorkoutActive(false);
    setWorkoutTimer(0);
    setIsPaused(false);
    
    // Speak completion message - disabled for Expo Go
    // if (voiceEnabled) {
    //   await voiceService.speak(
    //     `Workout complete! Amazing job! You worked out for ${minutes} minutes. You're crushing your fitness goals!`,
    //     {
    //       rate: 1.0,
    //       pitch: 1.1,
    //     }
    //   );
    // }
    
    Alert.alert('Workout Complete!', `Great job! You worked out for ${minutes} minutes.`);
  };

  const cancelWorkout = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsWorkoutActive(false);
    setWorkoutTimer(0);
    setIsPaused(false);
  };

  const smartRecommendation = getSmartRecommendation();
  const selectedWorkout = selectedMood ? workoutRecommendations[selectedMood] : null;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff', position: 'relative' }}>
        <IconLogo type="robot" size={32} color="#708d50" />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#1a1a1a' }}>AI Smart Workout</Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Personalized workouts based on your mood and activity</Text>
        </View>
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: voiceEnabled ? '#e8f5e9' : '#f0f0f0',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            setVoiceEnabled(!voiceEnabled);
            if (isSpeaking) {
              // voiceService.stop(); // Disabled for Expo Go
              setIsSpeaking(false);
            }
          }}
        >
          <Icon 
            name={voiceEnabled ? "volume-high" : "volume-off"} 
            size={24} 
            color={voiceEnabled ? "#708d50" : "#999"} 
          />
        </TouchableOpacity>
      </View>

      {/* AI Recommendation */}
      {smartRecommendation && (
        <View style={styles.recommendationCard}>
          <LinearGradient colors={['#708d50', '#5a7340']} style={styles.recommendationGradient}>
            <View style={styles.recommendationHeader}>
              <Icon name="robot" size={32} color="#fff" />
              <Text style={styles.recommendationTitle}>AI Recommendation</Text>
            </View>
            <Text style={styles.recommendationText}>
              Based on your activity today ({todayActivity?.steps || 0} steps,{' '}
              {todayActivity?.activeMinutes || 0} active minutes), we recommend:
            </Text>
            <TouchableOpacity
              style={styles.recommendationButton}
              onPress={() => handleMoodSelect(smartRecommendation)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MoodLogo 
                  mood={workoutRecommendations[smartRecommendation].emoji as any} 
                  size={24} 
                  color="#fff" 
                />
                <Text style={styles.recommendationButtonText}>
                  {workoutRecommendations[smartRecommendation].title}
                </Text>
              </View>
              <Icon name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      {/* Mood Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling today?</Text>
        <View style={styles.moodGrid}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodCard,
                selectedMood === mood.id && styles.moodCardSelected,
              ]}
              onPress={() => handleMoodSelect(mood.id)}
            >
              <MoodLogo mood={mood.id as any} size={50} color={mood.color} />
              <Text style={styles.moodName}>{mood.name}</Text>
              {selectedMood === mood.id && (
                <View style={styles.selectedBadge}>
                  <Icon name="check-circle" size={20} color={mood.color} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Workout Details */}
      {selectedWorkout && (
        <View style={styles.workoutDetails}>
          <View style={styles.workoutHeader}>
            <MoodLogo 
              mood={selectedWorkout.emoji as any} 
              size={60} 
              color={moods.find(m => m.id === selectedMood)?.color || '#708d50'} 
            />
            <View style={styles.workoutHeaderText}>
              <Text style={styles.workoutTitle}>{selectedWorkout.title}</Text>
              <View style={styles.workoutMeta}>
                <View style={styles.metaItem}>
                  <Icon name="clock-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>{selectedWorkout.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="fire" size={16} color="#ff6b6b" />
                  <Text style={styles.metaText}>{selectedWorkout.intensity}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.motivationCard}>
            <Icon name="lightbulb-on" size={24} color="#ff9800" />
            <Text style={styles.motivationText}>{selectedWorkout.motivation}</Text>
          </View>

          <View style={styles.exercisesSection}>
            <Text style={styles.exercisesTitle}>Exercises:</Text>
            {selectedWorkout.exercises.map((exercise, idx) => (
              <View key={idx} style={styles.exerciseItem}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{idx + 1}</Text>
                </View>
                <Text style={styles.exerciseText}>{exercise}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
            <LinearGradient colors={['#708d50', '#5a7340']} style={styles.startButtonGradient}>
              <Icon name="play-circle" size={24} color="#fff" />
              <Text style={styles.startButtonText}>Start Workout</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Video Links */}
          <View style={styles.videoSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <IconLogo type="video" size={24} color="#708d50" />
              <Text style={styles.videoTitle}>Workout Videos</Text>
            </View>
            <Text style={styles.videoSubtitle}>Follow along with these tutorials</Text>
            <View style={styles.videoGrid}>
              {selectedWorkout.videoLinks.map((video, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.videoCard}
                  onPress={() => Linking.openURL(video.url)}
                >
                  <Icon name="play-circle" size={32} color="#708d50" />
                  <Text style={styles.videoCardTitle}>{video.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Workout Timer Modal */}
      <Modal visible={isWorkoutActive} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedWorkout?.title}</Text>

            {/* Timer Display */}
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(workoutTimer)}</Text>
              <Text style={styles.timerLabel}>{isPaused ? 'Paused' : 'In Progress'}</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Icon name="clock-outline" size={24} color="#708d50" />
                <Text style={styles.statValue}>{Math.floor(workoutTimer / 60)}</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="fire" size={24} color="#ff6b6b" />
                <Text style={styles.statValue}>~{Math.floor(workoutTimer / 60) * 8}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
            </View>

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

              <TouchableOpacity style={styles.cancelButton} onPress={cancelWorkout}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  recommendationCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  recommendationGradient: {
    padding: 20,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  recommendationText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 20,
  },
  recommendationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 12,
  },
  recommendationButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  moodCardSelected: {
    borderColor: '#708d50',
    backgroundColor: '#f0f7ed',
  },
  moodEmoji: {
    fontSize: 40,
  },
  moodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  workoutDetails: {
    padding: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  workoutEmoji: {
    fontSize: 48,
  },
  workoutHeaderText: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  motivationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  motivationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  exercisesSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#708d50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  exerciseText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  videoSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  videoSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  videoCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  videoCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 24,
    textAlign: 'center',
  },
  timerContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
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
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  modalActions: {
    width: '100%',
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

export default SmartWorkoutScreen;
