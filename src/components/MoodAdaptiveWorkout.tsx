import React, { useState } from 'react';
import './MoodAdaptiveWorkout.css';

interface MoodData {
  emoji: string;
  name: string;
  workout: {
    title: string;
    duration: string;
    exercises: string[];
    intensity: string;
  };
  music: {
    genre: string;
    playlist: string;
    mood: string;
  };
  motivation: string;
  breathing: {
    technique: string;
    steps: string[];
    duration: string;
  };
  quote: string;
}

const MoodAdaptiveWorkout: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Get time-based greeting
  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // AI Voice Greeting Function
  const speakMoodGreeting = (mood: MoodData) => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const greeting = getTimeBasedGreeting();
    const moodName = mood.name.toLowerCase();
    
    // Construct the speech text
    const speechText = `${greeting}! I see you're feeling ${moodName} today. ${mood.quote} Here's your workout for ${moodName} mood: ${mood.workout.title}. This is a ${mood.workout.duration} ${mood.workout.intensity} intensity workout. Let's get started!`;

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(speechText);
    
    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use a female voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen') ||
      voice.name.includes('Google US English')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
    };

    // Speak
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech function
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const moodData: Record<string, MoodData> = {
    happy: {
      emoji: '😊',
      name: 'Happy',
      workout: {
        title: 'High-Energy Dance Workout',
        duration: '30 minutes',
        exercises: [
          'Jumping Jacks - 3 sets × 20 reps',
          'Dance Cardio - 10 minutes',
          'Burpees - 3 sets × 10 reps',
          'Mountain Climbers - 3 sets × 15 reps',
          'Cool Down Stretching - 5 minutes'
        ],
        intensity: 'High'
      },
      music: {
        genre: 'Upbeat Pop & Dance',
        playlist: 'Happy Hits',
        mood: 'Energetic and fun'
      },
      motivation: "You're already feeling great! Let's amplify that energy with an exciting workout. Your positive vibes will make this session amazing!",
      breathing: {
        technique: 'Energizing Breath',
        steps: [
          'Sit comfortably with spine straight',
          'Inhale deeply through nose for 4 counts',
          'Hold for 2 counts',
          'Exhale forcefully through mouth for 4 counts',
          'Repeat 5 times'
        ],
        duration: '2 minutes'
      },
      quote: "Happiness is not by chance, but by choice. You chose to move today - that's powerful! 💪✨"
    },
    sad: {
      emoji: '😢',
      name: 'Sad',
      workout: {
        title: 'Gentle Mood-Lifting Yoga',
        duration: '25 minutes',
        exercises: [
          'Child Pose - 2 minutes',
          'Cat-Cow Stretch - 3 minutes',
          'Gentle Forward Fold - 3 minutes',
          'Seated Twist - 2 minutes each side',
          'Legs Up the Wall - 5 minutes',
          'Savasana - 5 minutes'
        ],
        intensity: 'Low'
      },
      music: {
        genre: 'Calm Acoustic & Soft Piano',
        playlist: 'Healing Sounds',
        mood: 'Soothing and comforting'
      },
      motivation: "It's okay to feel sad. Movement can be medicine for the soul. Take it slow, be gentle with yourself. You're doing great just by showing up.",
      breathing: {
        technique: 'Box Breathing',
        steps: [
          'Sit or lie down comfortably',
          'Inhale slowly through nose for 4 counts',
          'Hold breath for 4 counts',
          'Exhale slowly through mouth for 4 counts',
          'Hold empty for 4 counts',
          'Repeat 4 times'
        ],
        duration: '3 minutes'
      },
      quote: "The sun will rise again. Every storm runs out of rain. You are stronger than you know. 🌅💙"
    },
    stressed: {
      emoji: '😰',
      name: 'Stressed',
      workout: {
        title: 'Stress-Relief Flow',
        duration: '20 minutes',
        exercises: [
          'Deep Breathing - 3 minutes',
          'Neck & Shoulder Rolls - 2 minutes',
          'Gentle Yoga Flow - 10 minutes',
          'Progressive Muscle Relaxation - 3 minutes',
          'Meditation - 2 minutes'
        ],
        intensity: 'Low-Medium'
      },
      music: {
        genre: 'Nature Sounds & Ambient',
        playlist: 'Stress Relief',
        mood: 'Calming and peaceful'
      },
      motivation: "Stress is temporary. This workout will help release tension and bring clarity. Breathe, move, and let go. You've got this!",
      breathing: {
        technique: '4-7-8 Breathing',
        steps: [
          'Sit with back straight',
          'Exhale completely through mouth',
          'Inhale quietly through nose for 4 counts',
          'Hold breath for 7 counts',
          'Exhale completely through mouth for 8 counts',
          'Repeat 4 cycles'
        ],
        duration: '2 minutes'
      },
      quote: "You can't calm the storm, so stop trying. What you can do is calm yourself. The storm will pass. 🌊🧘"
    },
    anxious: {
      emoji: '😟',
      name: 'Anxious',
      workout: {
        title: 'Grounding & Calming Routine',
        duration: '20 minutes',
        exercises: [
          'Grounding Meditation - 3 minutes',
          'Gentle Walking - 5 minutes',
          'Slow Stretching - 5 minutes',
          'Wall Push-ups - 2 sets × 10 reps',
          'Seated Forward Bend - 3 minutes',
          'Body Scan Relaxation - 4 minutes'
        ],
        intensity: 'Low'
      },
      music: {
        genre: 'Binaural Beats & Meditation',
        playlist: 'Anxiety Relief',
        mood: 'Grounding and centering'
      },
      motivation: "Anxiety lies. You are safe. This moment is all that exists. Let's ground your energy and find your center through gentle movement.",
      breathing: {
        technique: 'Alternate Nostril Breathing',
        steps: [
          'Sit comfortably with spine straight',
          'Close right nostril with thumb',
          'Inhale through left nostril for 4 counts',
          'Close both nostrils, hold for 4 counts',
          'Release right nostril, exhale for 4 counts',
          'Inhale through right, repeat on other side',
          'Complete 5 full cycles'
        ],
        duration: '3 minutes'
      },
      quote: "Anxiety is not your enemy. It's your body trying to protect you. Thank it, then show it you're safe. 🌿💚"
    },
    angry: {
      emoji: '😠',
      name: 'Angry',
      workout: {
        title: 'Anger Release Power Workout',
        duration: '25 minutes',
        exercises: [
          'Shadow Boxing - 5 minutes',
          'Punching Bag Work - 5 minutes',
          'High-Intensity Sprints - 3 sets × 30 seconds',
          'Plank Hold - 3 sets × 30 seconds',
          'Kickboxing Combos - 5 minutes',
          'Cool Down Stretching - 5 minutes'
        ],
        intensity: 'High'
      },
      music: {
        genre: 'Rock & Heavy Beats',
        playlist: 'Power Release',
        mood: 'Intense and empowering'
      },
      motivation: "Channel that fire into power! Anger is energy - let's transform it into strength. Hit hard, breathe deep, release it all!",
      breathing: {
        technique: 'Lion\'s Breath',
        steps: [
          'Kneel or sit comfortably',
          'Inhale deeply through nose',
          'Open mouth wide, stick out tongue',
          'Exhale forcefully with "HA" sound',
          'Make fierce face, release tension',
          'Repeat 5-7 times'
        ],
        duration: '2 minutes'
      },
      quote: "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured. Release it wisely. 🔥💪"
    },
    tired: {
      emoji: '😴',
      name: 'Tired',
      workout: {
        title: 'Gentle Energy Boost',
        duration: '15 minutes',
        exercises: [
          'Gentle Wake-Up Stretches - 3 minutes',
          'Slow Walking - 5 minutes',
          'Arm Circles - 2 minutes',
          'Light Squats - 2 sets × 10 reps',
          'Gentle Twists - 2 minutes',
          'Restorative Poses - 3 minutes'
        ],
        intensity: 'Very Low'
      },
      music: {
        genre: 'Soft Instrumental & Nature',
        playlist: 'Gentle Energy',
        mood: 'Soft and uplifting'
      },
      motivation: "Rest is productive too. This gentle movement will wake up your body without draining you. Listen to your body - you know what you need.",
      breathing: {
        technique: 'Energizing Breath (Kapalabhati)',
        steps: [
          'Sit with spine straight',
          'Take a deep breath in',
          'Exhale forcefully through nose in short bursts',
          'Let inhale happen naturally',
          'Do 20 quick exhales',
          'Rest and breathe normally',
          'Repeat 2 more rounds'
        ],
        duration: '2 minutes'
      },
      quote: "Rest when you're weary. Refresh and renew yourself. You deserve a break. Movement can be gentle. 🌙✨"
    },
    motivated: {
      emoji: '🔥',
      name: 'Motivated',
      workout: {
        title: 'Beast Mode Full Body',
        duration: '45 minutes',
        exercises: [
          'Warm-up - 5 minutes',
          'Squats - 4 sets × 15 reps',
          'Push-ups - 4 sets × 12 reps',
          'Deadlifts - 4 sets × 10 reps',
          'Pull-ups - 3 sets × 8 reps',
          'Plank - 3 sets × 60 seconds',
          'HIIT Finisher - 10 minutes',
          'Cool Down - 5 minutes'
        ],
        intensity: 'Very High'
      },
      music: {
        genre: 'EDM & Workout Bangers',
        playlist: 'Beast Mode',
        mood: 'Explosive and powerful'
      },
      motivation: "YES! This is YOUR moment! You're fired up and ready to crush it. Let's turn that motivation into results. Nothing can stop you today!",
      breathing: {
        technique: 'Power Breathing',
        steps: [
          'Stand tall, feet shoulder-width',
          'Inhale deeply, raise arms overhead',
          'Hold for 2 counts at peak',
          'Exhale powerfully, bring arms down',
          'Visualize energy flowing through you',
          'Repeat 10 times with intensity'
        ],
        duration: '2 minutes'
      },
      quote: "The only bad workout is the one that didn't happen. You showed up. You're already winning! 🏆💥"
    }
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowRecommendation(true);
    
    // Trigger AI voice greeting
    const moodInfo = moodData[mood];
    if (moodInfo) {
      // Small delay to let the UI render first
      setTimeout(() => {
        speakMoodGreeting(moodInfo);
      }, 500);
    }
  };

  const handleClose = () => {
    stopSpeaking(); // Stop any ongoing speech
    setShowRecommendation(false);
    setSelectedMood(null);
  };

  const currentMood = selectedMood ? moodData[selectedMood] : null;

  return (
    <div className="mood-adaptive-workout">
      <div className="mood-header">
        <h2 className="mood-title">How are you feeling today?</h2>
        <p className="mood-subtitle">Select your mood for a personalized workout experience</p>
      </div>

      <div className="mood-selector">
        {Object.entries(moodData).map(([key, data]) => (
          <button
            key={key}
            className={`mood-button ${selectedMood === key ? 'selected' : ''}`}
            onClick={() => handleMoodSelect(key)}
          >
            <span className="mood-emoji">{data.emoji}</span>
            <span className="mood-name">{data.name}</span>
          </button>
        ))}
      </div>

      {showRecommendation && currentMood && (
        <div className="mood-recommendation">
          <div className="recommendation-controls">
            <button 
              className={`voice-button ${isSpeaking ? 'speaking' : ''}`}
              onClick={() => isSpeaking ? stopSpeaking() : speakMoodGreeting(currentMood)}
              title={isSpeaking ? 'Stop voice' : 'Play voice greeting'}
            >
              {isSpeaking ? '🔊' : '🔈'}
            </button>
            <button className="close-button" onClick={handleClose}>×</button>
          </div>
          
          <div className="recommendation-header">
            <span className="recommendation-emoji">{currentMood.emoji}</span>
            <h3 className="recommendation-title">Your {currentMood.name} Workout Plan</h3>
            {isSpeaking && <div className="speaking-indicator">🎙️ AI Speaking...</div>}
          </div>

          {/* Quote Section */}
          <div className="recommendation-section quote-section">
            <div className="quote-icon">💭</div>
            <p className="quote-text">{currentMood.quote}</p>
          </div>

          {/* Motivation Section */}
          <div className="recommendation-section motivation-section">
            <h4 className="section-title">💪 Motivation</h4>
            <p className="motivation-text">{currentMood.motivation}</p>
          </div>

          {/* Workout Section */}
          <div className="recommendation-section workout-section">
            <h4 className="section-title">🏋️ Workout: {currentMood.workout.title}</h4>
            <div className="workout-meta">
              <span className="workout-duration">⏱️ {currentMood.workout.duration}</span>
              <span className="workout-intensity">🔥 {currentMood.workout.intensity} Intensity</span>
            </div>
            <ul className="exercise-list">
              {currentMood.workout.exercises.map((exercise, index) => (
                <li key={index} className="exercise-item">{exercise}</li>
              ))}
            </ul>
          </div>

          {/* Music Section */}
          <div className="recommendation-section music-section">
            <h4 className="section-title">🎵 Music Recommendation</h4>
            <div className="music-details">
              <p><strong>Genre:</strong> {currentMood.music.genre}</p>
              <p><strong>Playlist:</strong> {currentMood.music.playlist}</p>
              <p><strong>Mood:</strong> {currentMood.music.mood}</p>
            </div>
          </div>

          {/* Breathing Section */}
          <div className="recommendation-section breathing-section">
            <h4 className="section-title">🧘 Breathing Routine: {currentMood.breathing.technique}</h4>
            <p className="breathing-duration">Duration: {currentMood.breathing.duration}</p>
            <ol className="breathing-steps">
              {currentMood.breathing.steps.map((step, index) => (
                <li key={index} className="breathing-step">{step}</li>
              ))}
            </ol>
          </div>

          <button className="start-workout-button" onClick={handleClose}>
            Start Your Workout 🚀
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodAdaptiveWorkout;
