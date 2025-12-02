import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { initializeNotificationService } from './services/notificationService';

import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import About from './components/About';
import SignIn from './components/SignIn';
import SignUp from './components/Signup';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import DietTracker from './components/DietTracker';
import ProgressAnalytics from './components/ProgressAnalytics';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import AiCoach from "./components/AiCoach";
import DemoVideo from "./pages/DemoVideo";
import MusicPlaylist from "./components/MusicPlaylist";
import SmartWorkoutRecommendation from "./components/SmartWorkoutRecommendation";
import ProtectedRoute from "./components/ProtectedRoute";
import OnboardingGuard from "./components/OnboardingGuard";

// Solution Pages
import PersonalTraining from "./pages/PersonalTraining";
import WeightManagement from "./pages/WeightManagement";
import MuscleBuilding from "./pages/MuscleBuilding";
import EnduranceTraining from "./pages/EnduranceTraining";
import PersonalTrainers from "./pages/PersonalTrainers";
import FitnessCenters from "./pages/FitnessCenters";
import CorporateWellness from "./pages/CorporateWellness";
import HealthcareProviders from "./pages/HealthcareProviders";

// Feature Pages
import GoalManagement from "./pages/GoalManagement";
import AdaptivePrograms from "./pages/AdaptivePrograms";
import HealthInsights from "./pages/HealthInsights";
import MealPlanner from "./pages/MealPlanner";
import Profile from "./pages/Profile";
import NotificationSettings from "./components/NotificationSettings";

import './App.css';

// -----------------------
// Animated Route Wrapper
// -----------------------
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        classNames="page"
        timeout={600}
        unmountOnExit
      >
        <div className="page-wrapper">
          <Routes location={location}>

            {/* Public Routes */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes - Require Authentication & Onboarding */}
            <Route path="/dashboard" element={<ProtectedRoute><OnboardingGuard><Dashboard /></OnboardingGuard></ProtectedRoute>} />
            <Route path="/workout" element={<ProtectedRoute><OnboardingGuard><WorkoutTracker /></OnboardingGuard></ProtectedRoute>} />
            <Route path="/diet" element={<ProtectedRoute><OnboardingGuard><DietTracker /></OnboardingGuard></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><OnboardingGuard><ProgressAnalytics /></OnboardingGuard></ProtectedRoute>} />
            <Route path="/ai-coach" element={<ProtectedRoute><OnboardingGuard><AiCoach /></OnboardingGuard></ProtectedRoute>} />
            <Route path="/music" element={<ProtectedRoute><OnboardingGuard><MusicPlaylist /></OnboardingGuard></ProtectedRoute>} />
            <Route path="/smart-workout" element={<ProtectedRoute><OnboardingGuard><SmartWorkoutRecommendation /></OnboardingGuard></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><OnboardingGuard><Profile /></OnboardingGuard></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><OnboardingGuard><NotificationSettings /></OnboardingGuard></ProtectedRoute>} />

            {/* ⭐ NEW: Demo Video Page */}
            <Route path="/demo" element={<DemoVideo />} />

            {/* Solution Pages - For Individuals */}
            <Route path="/personal" element={<PersonalTraining />} />
            <Route path="/weight-loss" element={<WeightManagement />} />
            <Route path="/muscle-gain" element={<MuscleBuilding />} />
            <Route path="/endurance" element={<EnduranceTraining />} />

            {/* Solution Pages - For Professionals */}
            <Route path="/trainers" element={<PersonalTrainers />} />
            <Route path="/gyms" element={<FitnessCenters />} />
            <Route path="/corporate" element={<CorporateWellness />} />
            <Route path="/healthcare" element={<HealthcareProviders />} />

            {/* Feature Pages - Require Onboarding */}
            <Route path="/goals" element={<ProtectedRoute><OnboardingGuard><GoalManagement /></OnboardingGuard></ProtectedRoute>} />
            <Route path="/adaptive" element={<ProtectedRoute><OnboardingGuard><AdaptivePrograms /></OnboardingGuard></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><OnboardingGuard><HealthInsights /></OnboardingGuard></ProtectedRoute>} />
            <Route path="/meal-planner" element={<ProtectedRoute><OnboardingGuard><MealPlanner /></OnboardingGuard></ProtectedRoute>} />

            {/* Not found */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

// -----------------------
// App Wrapper
// -----------------------
function App() {
  useEffect(() => {
    // Initialize notification service when app loads
    const cleanup = initializeNotificationService();
    
    // Cleanup on unmount
    return cleanup;
  }, []);

  return (
    <Router>
      <div className="App">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
