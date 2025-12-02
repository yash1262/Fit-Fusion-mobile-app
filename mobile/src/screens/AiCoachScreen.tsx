import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { generateAIResponse } from '../services/aiCoachService';
import { getTodayActivity } from '../services/activityTrackingService';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import ScreenHeader from '../components/ScreenHeader';
import { getApiUrl, API_ENDPOINTS } from '../config/apiConfig';
// Voice service disabled for Expo Go compatibility
// import { voiceService } from '../services/voiceService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AiCoachScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userCtx, setUserCtx] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickPrompts = [
    { icon: '💪', title: 'Workout Plan', prompt: 'Create a beginner workout plan for me' },
    { icon: '🥗', title: 'Meal Ideas', prompt: 'Suggest healthy meal ideas for weight loss' },
    { icon: '🎯', title: 'Set Goals', prompt: 'Help me set realistic fitness goals' },
    { icon: '📊', title: 'Track Progress', prompt: 'How should I track my fitness progress?' },
  ];

  useEffect(() => {
    loadUserContext();
    
    // Speak welcome greeting when screen loads
    const speakWelcome = async () => {
      // Voice disabled for Expo Go
      // if (voiceEnabled && userName) {
      //   await voiceService.speakCoachGreeting(userName);
      // }
    };
    
    if (userName && messages.length === 0) {
      setTimeout(speakWelcome, 1000);
    }
  }, [userName]);

  useEffect(() => {
    return () => {
      // Stop speech when component unmounts - disabled for Expo Go
      // voiceService.stop();
    };
  }, []);

  const loadUserContext = async () => {
    const activity = await getTodayActivity();
    
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      
      try {
        const snap = await getDoc(doc(db, 'users', u.uid));
        const data = snap.exists() ? snap.data() : {};
        
        const ctx = {
          displayName: data?.displayName || u.displayName || u.email?.split('@')[0] || 'User',
          goal: data?.goals?.primary || '',
          todaySteps: activity.steps,
          todayCalories: activity.calories,
          todayActiveMinutes: activity.activeMinutes,
          todayHydration: activity.hydration,
          todayWorkouts: activity.workoutsCompleted,
        };
        
        setUserCtx(ctx);
        setUserName(ctx.displayName);
      } catch (err) {
        console.error('Error loading user context:', err);
      }
    });

    return () => unsub();
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      let response;
      
      // Start thinking animation and API call in parallel
      const thinkingPromise = new Promise((resolve) => setTimeout(resolve, 1000)); // Reduced to 1 second
      
      // Try Gemini server with short timeout (use local AI if fails)
      const geminiPromise = (async () => {
        try {
          // Use API config to get correct URL
          const apiUrl = getApiUrl(API_ENDPOINTS.GEMINI_CHAT);
          console.log('🤖 Calling Gemini API:', apiUrl);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for network
          
          const geminiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text,
              conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (geminiResponse.ok) {
            const data = await geminiResponse.json();
            if (data.success && data.data?.message) {
              console.log('✅ Gemini server connected');
              return data.data.message;
            }
          }
          throw new Error('Gemini response invalid');
        } catch (err) {
          console.log('📱 Using local AI (Gemini unavailable)');
          // Immediately use local AI
          return generateAIResponse({
            userMessage: text,
            userCtx: userCtx,
            conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
          });
        }
      })();

      // Wait for both thinking animation and response
      const [, aiResponse] = await Promise.all([thinkingPromise, geminiPromise]);
      response = aiResponse;

      // Type out the response with fast animation
      await typeMessage(response);
      
      // Speak the response if voice is enabled - disabled for Expo Go
      // if (voiceEnabled && response) {
      //   await voiceService.speakAIResponse(response, {
      //     onStart: () => setIsSpeaking(true),
      //     onDone: () => setIsSpeaking(false),
      //     onError: () => setIsSpeaking(false),
      //   });
      // }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMsg = "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
      await typeMessage(errorMsg);
      
      // Voice disabled for Expo Go
      // if (voiceEnabled) {
      //   await voiceService.speak(errorMsg, {
      //     onStart: () => setIsSpeaking(true),
      //     onDone: () => setIsSpeaking(false),
      //   });
      // }
    } finally {
      setLoading(false);
    }
  };

  // Super fast typing animation (0.5-1 second total)
  const typeMessage = async (text: string) => {
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    // Add empty message and get its index
    let messageIndex = 0;
    setMessages((prev) => {
      messageIndex = prev.length; // Get index before adding
      return [...prev, assistantMessage];
    });

    // Very fast typing - 0.5-1 second total
    const targetDuration = 500 + Math.random() * 500; // 0.5-1 second
    const chunkSize = Math.max(1, Math.floor(text.length / 50)); // Type in chunks for speed
    const delay = targetDuration / (text.length / chunkSize);

    for (let i = 0; i <= text.length; i += chunkSize) {
      const currentText = text.substring(0, Math.min(i + chunkSize, text.length));
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[messageIndex]) {
          newMessages[messageIndex] = {
            ...newMessages[messageIndex],
            content: currentText,
          };
        }
        return newMessages;
      });

      if (i < text.length) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Ensure full text is shown
    setMessages((prev) => {
      const newMessages = [...prev];
      if (newMessages[messageIndex]) {
        newMessages[messageIndex] = {
          ...newMessages[messageIndex],
          content: text,
        };
      }
      return newMessages;
    });

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const toggleVoice = async () => {
    if (isSpeaking) {
      // await voiceService.stop(); // Disabled for Expo Go
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const stopSpeaking = async () => {
    // await voiceService.stop(); // Disabled for Expo Go
    setIsSpeaking(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <ScreenHeader title="🤖 AI Fitness Coach" subtitle="Your 24/7 fitness expert" />
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.voiceButton, voiceEnabled && styles.voiceButtonActive]}
            onPress={toggleVoice}
          >
            <Icon 
              name={voiceEnabled ? "volume-high" : "volume-off"} 
              size={24} 
              color={voiceEnabled ? "#708d50" : "#999"} 
            />
          </TouchableOpacity>
          {isSpeaking && (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopSpeaking}
            >
              <Icon name="stop-circle" size={24} color="#ff6b6b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 ? (
          <View style={styles.welcomeScreen}>
            <Text style={styles.welcomeIcon}>💪</Text>
            <Text style={styles.welcomeTitle}>Welcome to Your AI Coach!</Text>
            <Text style={styles.welcomeText}>
              I'm here to help you achieve your fitness goals. Ask me anything about workouts,
              nutrition, or goal setting!
            </Text>

            <View style={styles.quickPromptsContainer}>
              <Text style={styles.quickPromptsLabel}>Quick Start:</Text>
              <View style={styles.quickPromptsGrid}>
                {quickPrompts.map((prompt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.promptButton}
                    onPress={() => handleQuickPrompt(prompt.prompt)}
                  >
                    <Text style={styles.promptIcon}>{prompt.icon}</Text>
                    <Text style={styles.promptTitle}>{prompt.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          messages.map((message, idx) => (
            <View
              key={idx}
              style={[
                styles.messageContainer,
                message.role === 'user' ? styles.userMessage : styles.assistantMessage,
              ]}
            >
              <View style={styles.messageAvatar}>
                <Text style={styles.messageAvatarText}>
                  {message.role === 'user' ? userName.charAt(0) || 'U' : '🤖'}
                </Text>
              </View>
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageAuthor}>
                    {message.role === 'user' ? userName || 'You' : 'AI Coach'}
                  </Text>
                  <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
                </View>
                <Text style={styles.messageText}>{message.content}</Text>
              </View>
            </View>
          ))
        )}
        {loading && (
          <View style={[styles.messageContainer, styles.assistantMessage]}>
            <View style={styles.messageAvatar}>
              <Text style={styles.messageAvatarText}>🤖</Text>
            </View>
            <View style={styles.messageContent}>
              <View style={styles.loadingContainer}>
                <View style={styles.loadingDot} />
                <View style={styles.loadingDot} />
                <View style={styles.loadingDot} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything about fitness..."
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <LinearGradient colors={['#708d50', '#5a7340']} style={styles.sendButtonGradient}>
            <Icon name="send" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    position: 'relative',
  },
  headerActions: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#e8f5e9',
  },
  stopButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#708d50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  welcomeScreen: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  welcomeIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  quickPromptsContainer: {
    width: '100%',
  },
  quickPromptsLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  quickPromptsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  promptButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#708d50',
  },
  promptIcon: {
    fontSize: 32,
  },
  promptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#708d50',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  userMessage: {
    flexDirection: 'row-reverse',
  },
  assistantMessage: {},
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#708d50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageAvatarText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  messageContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageAuthor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#708d50',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AiCoachScreen;
