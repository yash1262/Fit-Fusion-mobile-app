import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import FitFusionLogo from "./FitFusionLogo";
import { generateAIResponse } from "../services/aiCoachService";

type Role = "user" | "assistant" | "system";

interface Message {
  role: Role;
  content: string;
  timestamp: Date;
}

interface QuickPrompt {
  icon: string;
  title: string;
  prompt: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const AiCoach: React.FC = () => {
  // Load all chat sessions from localStorage
  const loadChatSessions = (): ChatSession[] => {
    try {
      const saved = localStorage.getItem('aiCoachChatSessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
    return [];
  };

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(loadChatSessions());
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Comprehensive user context from Firebase and localStorage
  const [userCtx, setUserCtx] = useState<{
    displayName?: string;
    email?: string;
    goal?: string;
    height?: string;
    currentWeight?: string;
    targetWeight?: string;
    gender?: string;
    age?: number;
    // Activity data
    todaySteps?: number;
    todayCalories?: number;
    todayActiveMinutes?: number;
    todayHydration?: number;
    todayWorkouts?: number;
    streak?: number;
    // Historical data
    weeklyAvgSteps?: number;
    weeklyWorkouts?: number;
    totalWorkouts?: number;
    memberSince?: string;
  } | null>(null);

  const quickPrompts: QuickPrompt[] = [
    { icon: "💪", title: "Workout Plan", prompt: "Create a beginner-friendly workout plan for me" },
    { icon: "🥗", title: "Meal Ideas", prompt: "Suggest healthy meal ideas for weight loss" },
    { icon: "🎯", title: "Set Goals", prompt: "Help me set realistic fitness goals" },
    { icon: "📊", title: "Track Progress", prompt: "How should I track my fitness progress?" },
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { 
        setUserCtx(null); 
        setUserName('');
        return; 
      }
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        const data = snap.exists() ? (snap.data() as any) : {};
        
        // Get activity data from localStorage (simulating real-time tracking)
        const activityData = JSON.parse(localStorage.getItem('fitfusion_activity') || '{}');
        const userActivityKey = `user_${u.uid}`;
        const userActivity = activityData[userActivityKey] || {};
        
        // Calculate age from DOB
        let age = undefined;
        if (data?.dob) {
          const birthDate = new Date(data.dob);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
        }

        // Calculate member duration
        let memberSince = "recently";
        if (data?.createdAt) {
          const created = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          const daysSince = Math.floor((new Date().getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSince < 7) memberSince = `${daysSince} days ago`;
          else if (daysSince < 30) memberSince = `${Math.floor(daysSince / 7)} weeks ago`;
          else if (daysSince < 365) memberSince = `${Math.floor(daysSince / 30)} months ago`;
          else memberSince = `${Math.floor(daysSince / 365)} years ago`;
        }
        
        const ctx = {
          displayName: data?.displayName || u.displayName || (u.email?.split("@")[0] ?? ""),
          email: u.email || "",
          goal: data?.goals?.primary || "",
          height: data?.metrics?.height || "",
          currentWeight: data?.metrics?.currentWeight || "",
          targetWeight: data?.metrics?.targetWeight || "",
          gender: data?.gender || "",
          age,
          // Today's activity
          todaySteps: userActivity.steps || 0,
          todayCalories: userActivity.calories || 0,
          todayActiveMinutes: userActivity.activeMinutes || 0,
          todayHydration: userActivity.hydration || 0,
          todayWorkouts: userActivity.workoutsCompleted || 0,
          streak: userActivity.streak || 1,
          // Historical data
          weeklyAvgSteps: userActivity.weeklyAvgSteps || 0,
          weeklyWorkouts: userActivity.weeklyWorkouts || 0,
          totalWorkouts: userActivity.totalWorkouts || 0,
          memberSince,
        };
        setUserCtx(ctx);
        setUserName(ctx.displayName || '');
      } catch (err) {
        console.error("Error loading user context:", err);
        const fallback = u.displayName || (u.email?.split("@")[0] ?? "");
        setUserCtx({ displayName: fallback, email: u.email || "" });
        setUserName(fallback);
      }
    });
    return () => unsub();
  }, []);

  // Auto-save current session when messages change
  useEffect(() => {
    if (messages.length > 0 && currentSessionId) {
      // Update existing session
      const updatedSessions = chatSessions.map(session =>
        session.id === currentSessionId
          ? { ...session, messages, timestamp: new Date() }
          : session
      );
      setChatSessions(updatedSessions);
      
      try {
        localStorage.setItem('aiCoachChatSessions', JSON.stringify(updatedSessions));
      } catch (error) {
        console.error('Error auto-saving session:', error);
      }
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = (messageText || input).trim();
    if (!text || loading) return;
    setError("");

    // Build a comprehensive, context-aware system prompt
    const sysBase = `You are Fit Fusion AI Coach - a world-class fitness and nutrition expert with the conversational ability of ChatGPT, combined with deep expertise in exercise science, nutrition, behavioral psychology, and personalized coaching.

CORE IDENTITY:
You are warm, knowledgeable, and genuinely invested in helping users achieve their fitness goals. You understand that fitness is a journey, not a destination, and you meet users where they are with empathy and expertise.

RESPONSE PHILOSOPHY:
1. UNDERSTAND FIRST: Carefully analyze what the user is really asking
2. PERSONALIZE: Use their actual data, name, and context naturally
3. EDUCATE: Explain the "why" behind your recommendations
4. ACTIONABLE: Provide clear, specific next steps
5. MOTIVATE: Encourage without being preachy
6. FOLLOW-UP: Suggest related topics or ask clarifying questions

COMMUNICATION STYLE (Like ChatGPT):
- Natural, conversational tone - talk like a knowledgeable friend
- Use their name organically (not in every sentence)
- Break down complex topics into digestible pieces
- Use analogies and examples to clarify concepts
- Acknowledge uncertainty when appropriate
- Ask clarifying questions to better help
- Adapt your language to match their question style
- Use emojis sparingly and purposefully
- Format for readability: headers, bullets, spacing

EXPERTISE DOMAINS:
🏋️ TRAINING: Strength, hypertrophy, endurance, HIIT, flexibility, mobility, sport-specific
🥗 NUTRITION: Macros, meal timing, supplements, diets (keto, IF, etc), meal prep
📊 PROGRESS: Tracking methods, analytics, plateau breaking, body composition
🎯 GOALS: Weight loss, muscle gain, recomp, performance, health markers
🧠 PSYCHOLOGY: Motivation, habit formation, consistency, overcoming barriers
💪 RECOVERY: Sleep, rest days, active recovery, injury prevention, stress management
📐 SCIENCE: Exercise physiology, nutrition science, evidence-based practices

RESPONSE STRUCTURE:
1. Acknowledge their question/situation
2. Reference relevant personal data if applicable
3. Provide comprehensive answer with reasoning
4. Give specific, actionable recommendations
5. Offer encouragement or next steps
6. Invite follow-up questions

CRITICAL RULES:
✓ Answer the ACTUAL question asked (don't go off-topic)
✓ Use their real data (steps, workouts, goals, etc.) when relevant
✓ Provide specific numbers (reps, sets, calories, timing)
✓ Explain WHY, not just WHAT
✓ Be realistic about timelines and expectations
✓ Prioritize safety and sustainable practices
✓ Celebrate their wins and progress
✓ Adapt advice to their fitness level and goal
✓ If you don't have enough info, ask for it
✓ Keep responses focused and well-organized

NEVER:
✗ Give generic, cookie-cutter responses
✗ Ignore the user's context and data
✗ Recommend unsafe or extreme practices
✗ Make unrealistic promises
✗ Be condescending or judgmental
✗ Provide medical diagnoses (suggest doctor visits)
✗ Ramble or go off-topic
✗ Use overly technical jargon without explanation`;

    // Build comprehensive user context
    let ctxLine = "";
    if (userCtx) {
      const profileParts = [
        `👤 USER PROFILE:`,
        `Name: ${userCtx.displayName || "User"}`,
        userCtx.age ? `Age: ${userCtx.age} years` : null,
        userCtx.gender ? `Gender: ${userCtx.gender}` : null,
        userCtx.memberSince ? `Member since: ${userCtx.memberSince}` : null,
      ].filter(Boolean);

      const goalsParts = [
        `\n🎯 FITNESS GOALS:`,
        userCtx.goal ? `Primary Goal: ${userCtx.goal}` : "Primary Goal: Not specified",
        userCtx.currentWeight ? `Current Weight: ${userCtx.currentWeight} kg` : null,
        userCtx.targetWeight ? `Target Weight: ${userCtx.targetWeight} kg` : null,
        userCtx.height ? `Height: ${userCtx.height} cm` : null,
      ].filter(Boolean);

      const activityParts = [
        `\n📊 TODAY'S ACTIVITY:`,
        `Steps: ${userCtx.todaySteps?.toLocaleString() || 0} (Goal: 10,000)`,
        `Active Minutes: ${userCtx.todayActiveMinutes || 0} min (Goal: 60)`,
        `Calories Burned: ${userCtx.todayCalories?.toLocaleString() || 0} cal`,
        `Water Intake: ${userCtx.todayHydration || 0}/8 glasses`,
        `Workouts Completed: ${userCtx.todayWorkouts || 0}`,
        `Current Streak: ${userCtx.streak || 1} days 🔥`,
      ];

      const progressParts = [
        `\n📈 PROGRESS SUMMARY:`,
        userCtx.weeklyAvgSteps ? `Weekly Avg Steps: ${userCtx.weeklyAvgSteps.toLocaleString()}` : null,
        userCtx.weeklyWorkouts ? `Workouts This Week: ${userCtx.weeklyWorkouts}` : null,
        userCtx.totalWorkouts ? `Total Workouts: ${userCtx.totalWorkouts}` : null,
      ].filter(Boolean);

      ctxLine = [
        ...profileParts,
        ...goalsParts,
        ...activityParts,
        ...(progressParts.length > 1 ? progressParts : []),
      ].join("\n");
    }

    const systemMessage: Message = { 
      role: "system", 
      content: [sysBase, ctxLine].filter(Boolean).join("\n\n"),
      timestamp: new Date()
    };

    const userMessage: Message = { 
      role: "user", 
      content: text,
      timestamp: new Date()
    };

    const hadSystem = messages.some(m => m.role === "system");
    const nextMessages: Message[] = hadSystem
      ? [...messages, userMessage]
      : [systemMessage, ...messages, userMessage];
    
    setInput("");
    
    // Clear image after sending
    const imageToSend = selectedImage;
    removeImage();
    
    // Show user message first
    setMessages(nextMessages);
    
    // Small delay to ensure user message renders
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setThinking(true);

    // Simulate thinking time (2-4 seconds) with heart logo beating
    const thinkingTime = 2000 + Math.random() * 2000; // 2-4 seconds
    await new Promise(resolve => setTimeout(resolve, thinkingTime));
    
    setThinking(false);
    setLoading(true);

    try {
      const tryOnce = async (url: string) => {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 60000); // 60s timeout for AI responses
        
        // Prepare conversation history (exclude system message for API)
        const conversationHistory = messages
          .filter(m => m.role !== 'system')
          .map(m => ({ role: m.role, content: m.content }));
        
        // Convert image to base64 if present
        let imageBase64 = null;
        if (selectedImage) {
          imageBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(selectedImage);
          });
        }
        
        const res = await fetch(url, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            message: text,
            conversationHistory: conversationHistory,
            image: imageBase64
          }),
          signal: controller.signal
        }).finally(() => clearTimeout(t));
        
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const txt = await res.text();
          throw new Error(txt.slice(0, 120) || "Non-JSON response");
        }
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data?.message || data?.error || "API request failed");
        }
        
        // Backend returns { success: true, data: { message: "...", suggestions: [...] } }
        if (data?.success && data?.data?.message) {
          return data.data.message as string;
        } else if (data?.message) {
          return data.message as string;
        }
        
        throw new Error("Unexpected response format");
      };

      let reply: string = "";
      try {
        reply = await tryOnce("/api/chatbot/message");
      } catch (err1) {
        try {
          reply = await tryOnce("http://localhost:5000/api/chatbot/message");
        } catch (err2) {
          // Fallback to intelligent AI response
          reply = generateAIResponse({
            userMessage: text,
            userCtx: userCtx,
            conversationHistory: messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }))
          });
        }
      }

      // Add typing animation
      await typeMessage(reply);
    } catch (e: any) {
      const errorMsg = e?.message || "Error contacting AI Coach.";
      setError(errorMsg);
      await typeMessage("I apologize, but I'm having trouble connecting right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  // Typing animation function - 2-4 seconds total
  const typeMessage = async (text: string) => {
    setIsTyping(true);
    setTypingText("");
    
    // Add empty message that will be filled with typing animation
    // Use callback to get the current state
    let messageIndex = 0;
    setMessages((prev) => {
      messageIndex = prev.length; // Get index from current state
      return [...prev, {
        role: "assistant",
        content: "",
        timestamp: new Date()
      }];
    });

    // Calculate delay to make typing take 2-4 seconds total
    const targetDuration = 2000 + Math.random() * 2000; // 2-4 seconds
    const baseDelay = targetDuration / text.length;
    
    // Type out the message character by character
    for (let i = 0; i <= text.length; i++) {
      const currentText = text.substring(0, i);
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[messageIndex]) {
          newMessages[messageIndex] = {
            role: "assistant",
            content: currentText,
            timestamp: newMessages[messageIndex].timestamp
          };
        }
        return newMessages;
      });
      
      // Adjust speed: faster for spaces, slower for punctuation
      const char = text[i];
      let delay = baseDelay;
      if (char === ' ') delay = baseDelay * 0.5;
      else if (char === '.' || char === '!' || char === '?') delay = baseDelay * 2;
      else if (char === ',' || char === ';') delay = baseDelay * 1.5;
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    setIsTyping(false);
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Old generateMockResponse function removed - now using aiCoachService.ts
  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Save current chat as a session
  const saveCurrentSession = () => {
    if (messages.length === 0) return;

    const sessionTitle = messages[0]?.content.substring(0, 50) + (messages[0]?.content.length > 50 ? '...' : '');
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: sessionTitle,
      messages: messages,
      timestamp: new Date()
    };

    const updatedSessions = [newSession, ...chatSessions];
    setChatSessions(updatedSessions);
    
    try {
      localStorage.setItem('aiCoachChatSessions', JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  // Load a saved session
  const loadSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
      setShowHistory(false);
    }
  };

  // Delete a session
  const deleteSession = (sessionId: string) => {
    const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(updatedSessions);
    
    try {
      localStorage.setItem('aiCoachChatSessions', JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error deleting session:', error);
    }

    if (currentSessionId === sessionId) {
      setMessages([]);
      setCurrentSessionId(null);
    }
  };

  // Start new chat
  const startNewChat = () => {
    if (messages.length > 0) {
      saveCurrentSession();
    }
    setMessages([]);
    setCurrentSessionId(null);
    setError("");
    setShowHistory(false);
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setError("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-coach-page">
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
              <li><Link to="/progress" className="nav-link">Progress</Link></li>
              <li><Link to="/ai-coach" className="nav-link active">AI Coach</Link></li>
              <li className="nav-profile">
                <Link to="/profile" className="profile-avatar" title="View Profile">
                  <span>{userName.charAt(0) || 'U'}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="coach-container">
        <div className="container">
          {/* Header */}
          <div className="coach-header">
            <div className="header-content">
              <div className="coach-avatar">
                <span className="avatar-icon">🤖</span>
              </div>
              <div className="header-text">
                <h1 className="coach-title">AI Fitness Coach</h1>
                <p className="coach-subtitle">
                  Your personal AI-powered fitness and nutrition expert, available 24/7
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button className="history-btn" onClick={() => setShowHistory(!showHistory)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                History ({chatSessions.length})
              </button>
              <button className="new-chat-btn" onClick={startNewChat}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Chat
              </button>
              {messages.length > 0 && (
                <button className="clear-btn" onClick={clearChat}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Chat History Sidebar */}
          {showHistory && (
            <div className="history-sidebar">
              <div className="history-header">
                <h3>Chat History</h3>
                <button className="close-history" onClick={() => setShowHistory(false)}>×</button>
              </div>
              <div className="history-list">
                {chatSessions.length === 0 ? (
                  <div className="no-history">
                    <p>No saved chats yet</p>
                    <p className="no-history-sub">Start a conversation to save it</p>
                  </div>
                ) : (
                  chatSessions.map(session => (
                    <div key={session.id} className={`history-item ${currentSessionId === session.id ? 'active' : ''}`}>
                      <div className="history-item-content" onClick={() => loadSession(session.id)}>
                        <div className="history-title">{session.title}</div>
                        <div className="history-meta">
                          <span>{session.messages.length} messages</span>
                          <span>•</span>
                          <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button className="delete-session" onClick={() => deleteSession(session.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <div className="chat-wrapper">
            <div className="chat-container">
              {messages.length === 0 ? (
                <div className="welcome-screen">
                  <div className="welcome-icon">💪</div>
                  <h2 className="welcome-title">Welcome to Your AI Coach!</h2>
                  <p className="welcome-text">
                    I'm here to help you achieve your fitness goals. Ask me anything about:
                  </p>
                  <div className="features-grid">
                    <div className="feature-item">
                      <span className="feature-icon">🏋️</span>
                      <span className="feature-text">Workout Plans</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🥗</span>
                      <span className="feature-text">Nutrition Advice</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🎯</span>
                      <span className="feature-text">Goal Setting</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📊</span>
                      <span className="feature-text">Progress Tracking</span>
                    </div>
                  </div>
                  
                  <div className="quick-prompts">
                    <p className="prompts-label">Quick Start:</p>
                    <div className="prompts-grid">
                      {quickPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          className="prompt-btn"
                          onClick={() => handleQuickPrompt(prompt.prompt)}
                        >
                          <span className="prompt-icon">{prompt.icon}</span>
                          <span className="prompt-title">{prompt.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="messages-container">
                  {messages.filter(m => m.role !== 'system').map((m, idx) => (
                    <div key={idx} className={`message ${m.role}`}>
                      <div className="message-avatar">
                        {m.role === 'user' ? (
                          <span>{userName.charAt(0) || 'U'}</span>
                        ) : (
                          <span>🤖</span>
                        )}
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          <span className="message-author">
                            {m.role === 'user' ? (userName || 'You') : 'AI Coach'}
                          </span>
                          <span className="message-time">{formatTime(m.timestamp)}</span>
                        </div>
                        <div className="message-text">{m.content}</div>
                      </div>
                    </div>
                  ))}
                  {thinking && (
                    <div className="message assistant">
                      <div className="message-avatar">
                        <span>🤖</span>
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          <span className="message-author">AI Coach</span>
                        </div>
                        <div className="thinking-container">
                          <div className="thinking-logo">
                            <FitFusionLogo width={60} height={60} />
                          </div>
                          <div className="thinking-text">Thinking...</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {loading && !thinking && (
                    <div className="message assistant">
                      <div className="message-avatar">
                        <span>🤖</span>
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          <span className="message-author">AI Coach</span>
                        </div>
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="input-container">
              {error && (
                <div className="error-banner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <span>{error}</span>
                  <button onClick={() => setError('')}>×</button>
                </div>
              )}
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button className="remove-image-btn" onClick={removeImage}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              )}
              <div className="input-wrapper">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <button 
                  className="image-btn" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading || thinking}
                  title="Upload image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Ask me anything about fitness, nutrition, or wellness..."
                  className="message-input"
                  disabled={loading || thinking}
                />
                <button 
                  className="send-btn" 
                  onClick={() => sendMessage()} 
                  disabled={loading || thinking || !input.trim()}
                >
                  {(loading || thinking) ? (
                    <svg className="spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  )}
                </button>
              </div>
              <p className="input-hint">
                📷 Upload images • 💡 Be specific for better advice
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ai-coach-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
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
        }

        /* Coach Container */
        .coach-container {
          padding: 2rem 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .coach-header {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .coach-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #8aa665, #708d50);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
        }

        .coach-title {
          font-size: 2rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .coach-subtitle {
          font-size: 1.125rem;
          color: #6a6a6a;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .save-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .save-indicator svg {
          flex-shrink: 0;
        }

        .history-btn {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .history-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(112, 141, 80, 0.3);
        }

        .new-chat-btn {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .new-chat-btn:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .clear-btn {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .clear-btn:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        /* History Sidebar */
        .history-sidebar {
          position: fixed;
          top: 80px;
          right: 2rem;
          width: 350px;
          max-height: calc(100vh - 120px);
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .history-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .close-history {
          background: none;
          border: none;
          font-size: 2rem;
          color: #6a6a6a;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .close-history:hover {
          background: #f0f0f0;
          color: #1a1a1a;
        }

        .history-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .no-history {
          text-align: center;
          padding: 3rem 1rem;
          color: #6a6a6a;
        }

        .no-history p {
          margin: 0.5rem 0;
        }

        .no-history-sub {
          font-size: 0.875rem;
          color: #9a9a9a;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 0.75rem;
          border: 2px solid #f0f0f0;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .history-item:hover {
          border-color: #708d50;
          background: rgba(112, 141, 80, 0.05);
        }

        .history-item.active {
          border-color: #708d50;
          background: rgba(112, 141, 80, 0.1);
        }

        .history-item-content {
          flex: 1;
        }

        .history-title {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .history-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #6a6a6a;
        }

        .delete-session {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .delete-session:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        /* Chat Wrapper - BIGGER SCREEN */
        .chat-wrapper {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 140px);
          min-height: 750px;
        }

        .chat-container {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
        }

        /* Welcome Screen */
        .welcome-screen {
          text-align: center;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .welcome-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .welcome-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .welcome-text {
          font-size: 1.125rem;
          color: #6a6a6a;
          margin-bottom: 2rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .feature-item {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .feature-icon {
          font-size: 2rem;
        }

        .feature-text {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .quick-prompts {
          margin-top: 2rem;
        }

        .prompts-label {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .prompts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .prompt-btn {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .prompt-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(112, 141, 80, 0.4);
        }

        .prompt-icon {
          font-size: 1.5rem;
        }

        /* Messages */
        .messages-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .message {
          display: flex;
          gap: 1rem;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .message.user .message-avatar {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
        }

        .message.assistant .message-avatar {
          background: linear-gradient(135deg, #8aa665, #708d50);
          font-size: 1.25rem;
        }

        .message-content {
          flex: 1;
          max-width: 70%;
        }

        .message.user .message-content {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .message.user .message-header {
          flex-direction: row-reverse;
        }

        .message-author {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .message-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .message-text {
          background: #f8fafc;
          padding: 1rem 1.25rem;
          border-radius: 16px;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #1a1a1a;
          white-space: pre-wrap;
        }

        .message.user .message-text {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
        }

        /* Thinking Animation */
        .thinking-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem 3rem;
          background: linear-gradient(135deg, rgba(138, 166, 101, 0.1), rgba(112, 141, 80, 0.1));
          border-radius: 16px;
          width: fit-content;
        }

        .thinking-logo {
          animation: heartbeat 1.2s ease-in-out infinite;
          filter: drop-shadow(0 4px 12px rgba(112, 141, 80, 0.3));
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          10%, 30% {
            transform: scale(1.1);
          }
          20%, 40% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
          60% {
            transform: scale(1);
          }
        }

        .thinking-text {
          font-size: 1rem;
          font-weight: 600;
          color: #708d50;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.25rem;
          background: #f8fafc;
          border-radius: 16px;
          width: fit-content;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #708d50;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        /* Input Container */
        .input-container {
          border-top: 1px solid #e5e7eb;
          padding: 1.5rem 2rem;
          background: #fafafa;
        }

        .error-banner {
          background: #fee2e2;
          border: 1px solid #ef4444;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #dc2626;
          font-size: 0.875rem;
        }

        .error-banner button {
          margin-left: auto;
          background: none;
          border: none;
          color: #dc2626;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .input-wrapper {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .message-input {
          flex: 1;
          padding: 1rem 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .message-input:focus {
          outline: none;
          border-color: #708d50;
          box-shadow: 0 0 0 3px rgba(112, 141, 80, 0.1);
        }

        .message-input:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
        }

        /* Image Upload Button */
        .image-btn {
          background: #f8fafc;
          color: #708d50;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-btn:hover:not(:disabled) {
          background: #708d50;
          color: white;
          border-color: #708d50;
        }

        .image-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Image Preview */
        .image-preview-container {
          position: relative;
          margin-bottom: 1rem;
          display: inline-block;
        }

        .image-preview {
          max-width: 200px;
          max-height: 200px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
        }

        .remove-image-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .remove-image-btn:hover {
          background: #dc2626;
        }

        .send-btn {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(112, 141, 80, 0.4);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .input-hint {
          font-size: 0.875rem;
          color: #6a6a6a;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .coach-header {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .coach-title {
            font-size: 1.5rem;
          }

          .chat-wrapper {
            height: calc(100vh - 400px);
          }

          .message-content {
            max-width: 85%;
          }

          .prompts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AiCoach;
