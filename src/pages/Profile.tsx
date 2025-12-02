import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import FitFusionLogo from '../components/FitFusionLogo';

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/signin');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData({ uid: user.uid, ...userDoc.data() });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSave = async () => {
    if (!userData?.uid) return;
    setSaving(true);

    try {
      const { uid, ...dataToSave } = userData;
      await updateDoc(doc(db, 'users', uid), dataToSave);
      alert('✅ Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('❌ Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ fontSize: '20px', color: '#708d50' }}>Loading profile...</div>
      </div>
    );
  }

  if (!userData) {
    return <div>No profile data found</div>;
  }

  const tabs = [
    { id: 'personal', label: '👤 Personal', icon: '👤' },
    { id: 'fitness', label: '🎯 Fitness Goals', icon: '🎯' },
    { id: 'workout', label: '💪 Workout', icon: '💪' },
    { id: 'lifestyle', label: '🌟 Lifestyle', icon: '🌟' },
    { id: 'diet', label: '🥗 Diet', icon: '🥗' },
    { id: 'health', label: '🏥 Health', icon: '🏥' },
    { id: 'motivation', label: '🔥 Motivation', icon: '🔥' },
  ];

  return (
    <div className="profile-page">
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
              <li><Link to="/ai-coach" className="nav-link">AI Coach</Link></li>
              <li><Link to="/profile" className="nav-link active">Profile</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="profile-container">
        <div className="container">
          {/* Header */}
          <div className="profile-header">
            <div className="header-left">
              <div className="profile-avatar-large">
                <span>{userData.displayName?.charAt(0) || 'U'}</span>
              </div>
              <div>
                <h1 className="profile-name">{userData.displayName || 'User'}</h1>
                <p className="profile-email">{userData.email}</p>
                <p className="profile-member">Member since {new Date(userData.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="header-actions">
              {editMode ? (
                <>
                  <button className="btn-save" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : '💾 Save Changes'}
                  </button>
                  <button className="btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
                </>
              ) : (
                <button className="btn-edit" onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
              )}
              <button className="btn-logout" onClick={handleLogout}>🚪 Logout</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="profile-content">
            {/* Personal Details */}
            {activeTab === 'personal' && (
              <div className="content-section">
                <h2 className="section-title">👤 Personal Details</h2>
                <div className="info-grid">
                  <InfoItem label="First Name" value={userData.firstName} editable={editMode} onChange={(v) => setUserData({...userData, firstName: v})} />
                  <InfoItem label="Last Name" value={userData.lastName} editable={editMode} onChange={(v) => setUserData({...userData, lastName: v})} />
                  <InfoItem label="Age" value={userData.personalDetails?.age} editable={editMode} onChange={(v) => setUserData({...userData, personalDetails: {...userData.personalDetails, age: v}})} />
                  <InfoItem label="Gender" value={userData.personalDetails?.gender} editable={editMode} onChange={(v) => setUserData({...userData, personalDetails: {...userData.personalDetails, gender: v}})} />
                  <InfoItem label="Height (cm)" value={userData.personalDetails?.height} editable={editMode} onChange={(v) => setUserData({...userData, personalDetails: {...userData.personalDetails, height: v}})} />
                  <InfoItem label="Weight (kg)" value={userData.personalDetails?.weight} editable={editMode} onChange={(v) => setUserData({...userData, personalDetails: {...userData.personalDetails, weight: v}})} />
                </div>
              </div>
            )}

            {/* Fitness Goals */}
            {activeTab === 'fitness' && (
              <div className="content-section">
                <h2 className="section-title">🎯 Fitness Goals</h2>
                <div className="info-grid">
                  <InfoItem label="Goals" value={userData.fitnessGoals?.goals?.join(', ')} fullWidth editable={editMode} onChange={(v) => setUserData({...userData, fitnessGoals: {...userData.fitnessGoals, goals: v.split(',').map((g: string) => g.trim())}})} />
                  <InfoItem label="Goal Intensity (1-10)" value={userData.fitnessGoals?.intensity} editable={editMode} onChange={(v) => setUserData({...userData, fitnessGoals: {...userData.fitnessGoals, intensity: v}})} />
                  <InfoItem label="Target Weight (kg)" value={userData.fitnessGoals?.targetWeight} editable={editMode} onChange={(v) => setUserData({...userData, fitnessGoals: {...userData.fitnessGoals, targetWeight: v}})} />
                </div>
              </div>
            )}

            {/* Workout Experience */}
            {activeTab === 'workout' && (
              <div className="content-section">
                <h2 className="section-title">💪 Workout Experience</h2>
                <div className="info-grid">
                  <InfoItem label="Activity Level" value={userData.workoutExperience?.activityLevel} editable={editMode} onChange={(v) => setUserData({...userData, workoutExperience: {...userData.workoutExperience, activityLevel: v}})} />
                  <InfoItem label="Experience Level" value={userData.workoutExperience?.experienceLevel} editable={editMode} onChange={(v) => setUserData({...userData, workoutExperience: {...userData.workoutExperience, experienceLevel: v}})} />
                  <InfoItem label="Workout Location" value={userData.workoutExperience?.workoutLocation} editable={editMode} onChange={(v) => setUserData({...userData, workoutExperience: {...userData.workoutExperience, workoutLocation: v}})} />
                  <InfoItem label="Equipment" value={userData.workoutExperience?.equipment?.join(', ')} fullWidth editable={editMode} onChange={(v) => setUserData({...userData, workoutExperience: {...userData.workoutExperience, equipment: v.split(',').map((e: string) => e.trim())}})} />
                  <InfoItem label="Time Available (min/day)" value={userData.workoutExperience?.timeAvailable} editable={editMode} onChange={(v) => setUserData({...userData, workoutExperience: {...userData.workoutExperience, timeAvailable: v}})} />
                  <InfoItem label="Preferred Time" value={userData.workoutExperience?.preferredTime} editable={editMode} onChange={(v) => setUserData({...userData, workoutExperience: {...userData.workoutExperience, preferredTime: v}})} />
                  <InfoItem label="Exercise Styles" value={userData.workoutExperience?.exerciseStyles?.join(', ')} fullWidth editable={editMode} onChange={(v) => setUserData({...userData, workoutExperience: {...userData.workoutExperience, exerciseStyles: v.split(',').map((s: string) => s.trim())}})} />
                  <InfoItem label="Intensity Preference" value={userData.workoutExperience?.intensityPreference} editable={editMode} onChange={(v) => setUserData({...userData, workoutExperience: {...userData.workoutExperience, intensityPreference: v}})} />
                  <InfoItem label="Training Background" value={userData.workoutExperience?.trainingBackground} fullWidth editable={editMode} onChange={(v) => setUserData({...userData, workoutExperience: {...userData.workoutExperience, trainingBackground: v}})} />
                  <InfoItem label="Workout Style" value={userData.workoutExperience?.workoutStyle} editable={editMode} onChange={(v) => setUserData({...userData, workoutExperience: {...userData.workoutExperience, workoutStyle: v}})} />
                </div>
              </div>
            )}

            {/* Lifestyle */}
            {activeTab === 'lifestyle' && (
              <div className="content-section">
                <h2 className="section-title">🌟 Lifestyle Factors</h2>
                <div className="info-grid">
                  <InfoItem label="Sleep Hours/Night" value={userData.lifestyle?.sleepHours} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, sleepHours: v}})} />
                  <InfoItem label="Wake Time" value={userData.lifestyle?.wakeTime} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, wakeTime: v}})} />
                  <InfoItem label="Sleep Time" value={userData.lifestyle?.sleepTime} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, sleepTime: v}})} />
                  <InfoItem label="Water Intake (L/day)" value={userData.lifestyle?.waterIntake} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, waterIntake: v}})} />
                  <InfoItem label="Stress Level (1-10)" value={userData.lifestyle?.stressLevel} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, stressLevel: v}})} />
                  <InfoItem label="Daily Steps" value={userData.lifestyle?.dailySteps} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, dailySteps: v}})} />
                  <InfoItem label="Smoking Habits" value={userData.lifestyle?.smoking} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, smoking: v}})} />
                  <InfoItem label="Alcohol Habits" value={userData.lifestyle?.alcohol} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, alcohol: v}})} />
                  <InfoItem label="Caffeine Intake" value={userData.lifestyle?.caffeine} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, caffeine: v}})} />
                  <InfoItem label="Monthly Diet Budget ($)" value={userData.lifestyle?.dietBudget} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, dietBudget: v}})} />
                  <InfoItem label="Work Type" value={userData.lifestyle?.workType} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, workType: v}})} />
                  <InfoItem label="Travel Frequency" value={userData.lifestyle?.travelFrequency} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, travelFrequency: v}})} />
                  <InfoItem label="Eating Routine" value={userData.lifestyle?.eatingRoutine} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, eatingRoutine: v}})} />
                  <InfoItem label="Screen Time (hrs/day)" value={userData.lifestyle?.screenTime} editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, screenTime: v}})} />
                  <InfoItem label="Cooking Habit" value={userData.lifestyle?.cookingHabit} fullWidth editable={editMode} onChange={(v) => setUserData({...userData, lifestyle: {...userData.lifestyle, cookingHabit: v}})} />
                </div>
              </div>
            )}

            {/* Diet Preferences */}
            {activeTab === 'diet' && (
              <div className="content-section">
                <h2 className="section-title">🥗 Diet Preferences</h2>
                <div className="info-grid">
                  <InfoItem label="Diet Type" value={userData.dietPreferences?.dietType} editable={editMode} onChange={(v) => setUserData({...userData, dietPreferences: {...userData.dietPreferences, dietType: v}})} />
                  <InfoItem label="Protein Sources" value={userData.dietPreferences?.proteinSources?.join(', ')} fullWidth editable={editMode} onChange={(v) => setUserData({...userData, dietPreferences: {...userData.dietPreferences, proteinSources: v.split(',').map((s: string) => s.trim())}})} />
                  <InfoItem label="Spice Preference" value={userData.dietPreferences?.spicePreference} editable={editMode} onChange={(v) => setUserData({...userData, dietPreferences: {...userData.dietPreferences, spicePreference: v}})} />
                  <InfoItem label="Sweet Tooth" value={userData.dietPreferences?.sweetTooth} editable={editMode} onChange={(v) => setUserData({...userData, dietPreferences: {...userData.dietPreferences, sweetTooth: v}})} />
                  <InfoItem label="Meals Per Day" value={userData.dietPreferences?.mealsPerDay} editable={editMode} onChange={(v) => setUserData({...userData, dietPreferences: {...userData.dietPreferences, mealsPerDay: v}})} />
                  <InfoItem label="Craving Times" value={userData.dietPreferences?.cravingTimes?.join(', ')} fullWidth editable={editMode} onChange={(v) => setUserData({...userData, dietPreferences: {...userData.dietPreferences, cravingTimes: v.split(',').map((t: string) => t.trim())}})} />
                  <InfoItem label="Favorite Foods" value={userData.dietPreferences?.favoriteFoods} fullWidth editable={editMode} onChange={(v) => setUserData({...userData, dietPreferences: {...userData.dietPreferences, favoriteFoods: v}})} />
                  <InfoItem label="Macro Preference" value={userData.dietPreferences?.macroPreference} editable={editMode} onChange={(v) => setUserData({...userData, dietPreferences: {...userData.dietPreferences, macroPreference: v}})} />
                  <InfoItem label="Dietary Restrictions" value={userData.dietaryRestrictions?.join(', ')} fullWidth editable={editMode} onChange={(v) => setUserData({...userData, dietaryRestrictions: v.split(',').map((r: string) => r.trim())})} />
                </div>
              </div>
            )}

            {/* Health Conditions */}
            {activeTab === 'health' && (
              <div className="content-section">
                <h2 className="section-title">🏥 Health Conditions</h2>
                <div className="info-grid">
                  <InfoItem label="Medical Conditions" value={userData.healthConditions?.conditions?.join(', ') || 'None'} fullWidth editable={editMode} onChange={(v) => setUserData({...userData, healthConditions: {...userData.healthConditions, conditions: v === 'None' ? [] : v.split(',').map((c: string) => c.trim())}})} />
                  <InfoItem label="Injuries/Pain Areas" value={userData.healthConditions?.injuries?.join(', ') || 'None'} fullWidth editable={editMode} onChange={(v) => setUserData({...userData, healthConditions: {...userData.healthConditions, injuries: v === 'None' ? [] : v.split(',').map((i: string) => i.trim())}})} />
                </div>
              </div>
            )}

            {/* Motivation */}
            {activeTab === 'motivation' && (
              <div className="content-section">
                <h2 className="section-title">🔥 Motivation & Psychology</h2>
                <div className="info-grid">
                  <InfoItem label="Motivation Level (1-10)" value={userData.motivation?.level} editable={editMode} onChange={(v) => setUserData({...userData, motivation: {...userData.motivation, level: v}})} />
                  <InfoItem label="Reminder Frequency" value={userData.motivation?.reminderFrequency} editable={editMode} onChange={(v) => setUserData({...userData, motivation: {...userData.motivation, reminderFrequency: v}})} />
                  <InfoItem label="Preferred Trainer Style" value={userData.motivation?.trainerStyle} editable={editMode} onChange={(v) => setUserData({...userData, motivation: {...userData.motivation, trainerStyle: v}})} />
                  <InfoItem label="Biggest Struggle" value={userData.motivation?.biggestStruggle} editable={editMode} onChange={(v) => setUserData({...userData, motivation: {...userData.motivation, biggestStruggle: v}})} />
                  <InfoItem label="Reward Preference" value={userData.motivation?.rewardPreference} fullWidth editable={editMode} onChange={(v) => setUserData({...userData, motivation: {...userData.motivation, rewardPreference: v}})} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .profile-page {
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

        /* Profile Container */
        .profile-container {
          padding: 2rem 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-header {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .profile-avatar-large {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #708d50, #5a7340);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
        }

        .profile-name {
          font-size: 2rem;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 0.25rem;
        }

        .profile-email {
          font-size: 1rem;
          color: #6a6a6a;
          margin: 0 0 0.25rem;
        }

        .profile-member {
          font-size: 0.875rem;
          color: #9ca3af;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-edit, .btn-save, .btn-cancel, .btn-logout {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-edit {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
        }

        .btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(112, 141, 80, 0.3);
        }

        .btn-save {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        .btn-logout {
          background: #ef4444;
          color: white;
        }

        .btn-logout:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        /* Tabs */
        .profile-tabs {
          display: flex;
          gap: 0.5rem;
          background: white;
          padding: 1rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
          overflow-x: auto;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border: none;
          background: transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          font-size: 0.95rem;
          font-weight: 500;
          color: #6b7280;
        }

        .tab-btn:hover {
          background: rgba(112, 141, 80, 0.08);
          color: #708d50;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #708d50, #5a7340);
          color: white;
        }

        .tab-icon {
          font-size: 1.25rem;
        }

        /* Content */
        .profile-content {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .content-section {
          max-width: 900px;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 1.5rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 1rem;
          font-weight: 500;
          color: #1a1a1a;
          padding: 0.75rem 1rem;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .info-value.empty {
          color: #9ca3af;
          font-style: italic;
        }

        .info-input {
          font-size: 1rem;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .info-input:focus {
          outline: none;
          border-color: #708d50;
          box-shadow: 0 0 0 3px rgba(112, 141, 80, 0.1);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .profile-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-left {
            flex-direction: column;
            align-items: center;
            text-align: center;
            width: 100%;
          }

          .header-actions {
            width: 100%;
            justify-content: center;
          }

          .profile-tabs {
            flex-wrap: nowrap;
            overflow-x: auto;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

// InfoItem Component
const InfoItem: React.FC<{
  label: string;
  value: any;
  fullWidth?: boolean;
  editable?: boolean;
  onChange?: (value: any) => void;
}> = ({ label, value, fullWidth, editable, onChange }) => {
  return (
    <div className={`info-item ${fullWidth ? 'full-width' : ''}`}>
      <div className="info-label">{label}</div>
      {editable && onChange ? (
        <input
          type="text"
          className="info-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className={`info-value ${!value ? 'empty' : ''}`}>
          {value || 'Not provided'}
        </div>
      )}
    </div>
  );
};

export default Profile;
