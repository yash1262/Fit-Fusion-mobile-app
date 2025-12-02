// src/components/Signup.tsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const SignUp: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Step 1: Personal Details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Step 2: Fitness Goals
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [goalIntensity, setGoalIntensity] = useState("5");
  const [targetWeight, setTargetWeight] = useState("");

  // Step 3: Workout Experience
  const [activityLevel, setActivityLevel] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [workoutLocation, setWorkoutLocation] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [timeAvailable, setTimeAvailable] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [exerciseStyles, setExerciseStyles] = useState<string[]>([]);
  const [intensityPreference, setIntensityPreference] = useState("");
  const [trainingBackground, setTrainingBackground] = useState("");
  const [workoutStyle, setWorkoutStyle] = useState("");

  // Step 4: Lifestyle Factors
  const [sleepHours, setSleepHours] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [stressLevel, setStressLevel] = useState("5");
  const [dailySteps, setDailySteps] = useState("");
  const [smoking, setSmoking] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [caffeine, setCaffeine] = useState("");
  const [dietBudget, setDietBudget] = useState("");
  const [workType, setWorkType] = useState("");
  const [travelFrequency, setTravelFrequency] = useState("");
  const [eatingRoutine, setEatingRoutine] = useState("");
  const [screenTime, setScreenTime] = useState("");
  const [cookingHabit, setCookingHabit] = useState("");

  // Step 5: Diet Preferences
  const [dietType, setDietType] = useState("");
  const [proteinSources, setProteinSources] = useState<string[]>([]);
  const [spicePreference, setSpicePreference] = useState("");
  const [sweetTooth, setSweetTooth] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [cravingTimes, setCravingTimes] = useState<string[]>([]);
  const [favoriteFoods, setFavoriteFoods] = useState("");
  const [macroPreference, setMacroPreference] = useState("");

  // Step 6: Dietary Restrictions
  const [restrictions, setRestrictions] = useState<string[]>([]);

  // Step 7: Health Conditions
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [injuries, setInjuries] = useState<string[]>([]);

  // Step 8: Motivation & Psychology
  const [motivationLevel, setMotivationLevel] = useState("5");
  const [reminderFrequency, setReminderFrequency] = useState("");
  const [trainerStyle, setTrainerStyle] = useState("");
  const [biggestStruggle, setBiggestStruggle] = useState("");
  const [rewardPreference, setRewardPreference] = useState("");

  // Terms
  const [agreeTos, setAgreeTos] = useState(false);

  const totalSteps = 8;

  const nextStep = () => {
    if (step === 1) {
      if (!firstName || !email || !password || !age || !gender || !height || !weight) {
        setError("Please fill all required fields");
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("Please enter a valid email address (e.g., user@example.com)");
        return;
      }
      
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
      
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    if (step === 2 && fitnessGoals.length === 0) {
      setError("Please select at least one fitness goal");
      return;
    }
    setError("");
    setStep((s) => Math.min(totalSteps, s + 1));
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const toggleArrayItem = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setArr(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      nextStep();
      return;
    }
    if (!agreeTos) {
      setError("Please agree to Terms of Service");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError(""); // Clear any previous errors
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      const displayName = `${firstName} ${lastName}`.trim();
      
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName,
        lastName,
        displayName,
        personalDetails: {
          age: parseInt(age),
          gender,
          height: parseFloat(height),
          weight: parseFloat(weight),
        },
        fitnessGoals: {
          goals: fitnessGoals,
          intensity: parseInt(goalIntensity),
          targetWeight: targetWeight ? parseFloat(targetWeight) : null,
        },
        workoutExperience: {
          activityLevel,
          experienceLevel,
          workoutLocation,
          equipment,
          timeAvailable,
          preferredTime,
          exerciseStyles,
          intensityPreference,
          trainingBackground,
          workoutStyle,
        },
        lifestyle: {
          sleepHours: parseFloat(sleepHours),
          wakeTime,
          sleepTime,
          waterIntake: parseFloat(waterIntake),
          stressLevel: parseInt(stressLevel),
          dailySteps: dailySteps ? parseInt(dailySteps) : null,
          smoking,
          alcohol,
          caffeine,
          dietBudget,
          workType,
          travelFrequency,
          eatingRoutine,
          screenTime,
          cookingHabit,
        },
        dietPreferences: {
          dietType,
          proteinSources,
          spicePreference,
          sweetTooth,
          mealsPerDay: parseInt(mealsPerDay),
          cravingTimes,
          favoriteFoods,
          macroPreference,
        },
        dietaryRestrictions: restrictions,
        healthConditions: {
          conditions: healthConditions,
          injuries,
        },
        motivation: {
          level: parseInt(motivationLevel),
          reminderFrequency,
          trainerStyle,
          biggestStruggle,
          rewardPreference,
        },
        createdAt: serverTimestamp(),
        onboardingCompleted: true,
      });

      alert("✅ Account created successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Join Fit Fusion</h2>
        <p className="signup-subtitle">Complete your profile to get personalized fitness & nutrition plans</p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
        <p className="step-indicator">Step {step} of {totalSteps}</p>

        <form className="signup-form" onSubmit={handleSignup}>
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="step-content">
              <h3 className="section-title">📋 Personal Details</h3>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">First Name *</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Password *</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Confirm Password *</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" required />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Age *</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Gender *</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Height (cm) *</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Weight (kg) *</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" required />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Fitness Goals */}
          {step === 2 && (
            <div className="step-content">
              <h3 className="section-title">🎯 Fitness Goals</h3>
              <label className="input-label">Select Your Goals (multiple allowed) *</label>
              <div className="goals-grid">
                {["Lose weight", "Gain weight", "Muscle building", "Toning", "Endurance", "Flexibility", "Maintain body", "Abs"].map(goal => (
                  <button type="button" key={goal} className={`goal-pill ${fitnessGoals.includes(goal) ? "selected" : ""}`} onClick={() => toggleArrayItem(fitnessGoals, setFitnessGoals, goal)}>
                    {goal}
                  </button>
                ))}
              </div>
              <div className="input-group">
                <label className="input-label">Goal Intensity (1-10): {goalIntensity}</label>
                <input type="range" min="1" max="10" value={goalIntensity} onChange={(e) => setGoalIntensity(e.target.value)} className="slider" />
              </div>
              <div className="input-group">
                <label className="input-label">Target Weight (kg) - Optional</label>
                <input type="number" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} placeholder="65" />
              </div>
            </div>
          )}

          {/* STEP 3: Workout Experience */}
          {step === 3 && (
            <div className="step-content">
              <h3 className="section-title">💪 Workout Experience</h3>
              <div className="input-group">
                <label className="input-label">Activity Level</label>
                <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                  <option value="">Select</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly Active</option>
                  <option value="moderately_active">Moderately Active</option>
                  <option value="very_active">Very Active</option>
                  <option value="athlete">Athlete</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Experience Level</label>
                <div className="radio-group">
                  {["Beginner", "Intermediate", "Advanced"].map(level => (
                    <label key={level} className="radio-label">
                      <input type="radio" name="experience" value={level} checked={experienceLevel === level} onChange={(e) => setExperienceLevel(e.target.value)} />
                      {level}
                    </label>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Workout Location</label>
                <div className="radio-group">
                  {["Gym", "Home", "Both"].map(loc => (
                    <label key={loc} className="radio-label">
                      <input type="radio" name="location" value={loc} checked={workoutLocation === loc} onChange={(e) => setWorkoutLocation(e.target.value)} />
                      {loc}
                    </label>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Equipment Available</label>
                <div className="checkbox-grid">
                  {["Dumbbells", "Barbell", "Resistance bands", "Treadmill", "Yoga mat", "None"].map(eq => (
                    <label key={eq} className="checkbox-label">
                      <input type="checkbox" checked={equipment.includes(eq)} onChange={() => toggleArrayItem(equipment, setEquipment, eq)} />
                      {eq}
                    </label>
                  ))}
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Time Available (min/day)</label>
                  <input type="number" value={timeAvailable} onChange={(e) => setTimeAvailable(e.target.value)} placeholder="30" />
                </div>
                <div className="input-group">
                  <label className="input-label">Preferred Time</label>
                  <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}>
                    <option value="">Select</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Preferred Exercise Styles</label>
                <div className="checkbox-grid">
                  {["Strength", "HIIT", "Cardio", "Yoga", "Pilates", "Sports"].map(style => (
                    <label key={style} className="checkbox-label">
                      <input type="checkbox" checked={exerciseStyles.includes(style)} onChange={() => toggleArrayItem(exerciseStyles, setExerciseStyles, style)} />
                      {style}
                    </label>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Intensity Preference</label>
                <select value={intensityPreference} onChange={(e) => setIntensityPreference(e.target.value)}>
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Past Training Background</label>
                <input type="text" value={trainingBackground} onChange={(e) => setTrainingBackground(e.target.value)} placeholder="e.g., Played football in college" />
              </div>
              <div className="input-group">
                <label className="input-label">Workout Style</label>
                <div className="radio-group">
                  {["Solo", "Guided"].map(style => (
                    <label key={style} className="radio-label">
                      <input type="radio" name="workoutStyle" value={style} checked={workoutStyle === style} onChange={(e) => setWorkoutStyle(e.target.value)} />
                      {style}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Lifestyle Factors */}
          {step === 4 && (
            <div className="step-content">
              <h3 className="section-title">🌟 Lifestyle Factors</h3>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Sleep Hours/Night</label>
                  <input type="number" step="0.5" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} placeholder="7" />
                </div>
                <div className="input-group">
                  <label className="input-label">Wake Time</label>
                  <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Sleep Time</label>
                  <input type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Water Intake (L/day)</label>
                  <input type="number" step="0.1" value={waterIntake} onChange={(e) => setWaterIntake(e.target.value)} placeholder="2.5" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Stress Level (1-10): {stressLevel}</label>
                <input type="range" min="1" max="10" value={stressLevel} onChange={(e) => setStressLevel(e.target.value)} className="slider" />
              </div>
              <div className="input-group">
                <label className="input-label">Daily Steps (average)</label>
                <input type="number" value={dailySteps} onChange={(e) => setDailySteps(e.target.value)} placeholder="5000" />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Smoking Habits</label>
                  <select value={smoking} onChange={(e) => setSmoking(e.target.value)}>
                    <option value="">Select</option>
                    <option value="never">Never</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="regularly">Regularly</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Alcohol Habits</label>
                  <select value={alcohol} onChange={(e) => setAlcohol(e.target.value)}>
                    <option value="">Select</option>
                    <option value="never">Never</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="regularly">Regularly</option>
                  </select>
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Caffeine Intake</label>
                  <select value={caffeine} onChange={(e) => setCaffeine(e.target.value)}>
                    <option value="">Select</option>
                    <option value="none">None</option>
                    <option value="1-2_cups">1-2 cups/day</option>
                    <option value="3+_cups">3+ cups/day</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Monthly Diet Budget ($)</label>
                  <input type="number" value={dietBudget} onChange={(e) => setDietBudget(e.target.value)} placeholder="300" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Work Type</label>
                <select value={workType} onChange={(e) => setWorkType(e.target.value)}>
                  <option value="">Select</option>
                  <option value="desk">Desk Job</option>
                  <option value="field">Field Work</option>
                  <option value="student">Student</option>
                  <option value="shifts">Shift Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Travel Frequency</label>
                  <select value={travelFrequency} onChange={(e) => setTravelFrequency(e.target.value)}>
                    <option value="">Select</option>
                    <option value="rarely">Rarely</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Screen Time (hrs/day)</label>
                  <input type="number" value={screenTime} onChange={(e) => setScreenTime(e.target.value)} placeholder="6" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Eating Routine</label>
                <select value={eatingRoutine} onChange={(e) => setEatingRoutine(e.target.value)}>
                  <option value="">Select</option>
                  <option value="early_bird">Early Bird</option>
                  <option value="late_eater">Late Eater</option>
                  <option value="skips_breakfast">Skips Breakfast</option>
                  <option value="regular">Regular</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Cooking Habit</label>
                <div className="radio-group">
                  {["Home cooking", "Ordering food", "Mix of both"].map(habit => (
                    <label key={habit} className="radio-label">
                      <input type="radio" name="cooking" value={habit} checked={cookingHabit === habit} onChange={(e) => setCookingHabit(e.target.value)} />
                      {habit}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Diet Preferences */}
          {step === 5 && (
            <div className="step-content">
              <h3 className="section-title">🥗 Diet Preferences</h3>
              <div className="input-group">
                <label className="input-label">Diet Type</label>
                <select value={dietType} onChange={(e) => setDietType(e.target.value)}>
                  <option value="">Select</option>
                  <option value="veg">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="eggetarian">Eggetarian</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Favorite Protein Sources</label>
                <div className="checkbox-grid">
                  {["Chicken", "Fish", "Eggs", "Tofu", "Lentils", "Paneer", "Protein powder"].map(protein => (
                    <label key={protein} className="checkbox-label">
                      <input type="checkbox" checked={proteinSources.includes(protein)} onChange={() => toggleArrayItem(proteinSources, setProteinSources, protein)} />
                      {protein}
                    </label>
                  ))}
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Spice Preference</label>
                  <select value={spicePreference} onChange={(e) => setSpicePreference(e.target.value)}>
                    <option value="">Select</option>
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="spicy">Spicy</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Sweet Tooth?</label>
                  <select value={sweetTooth} onChange={(e) => setSweetTooth(e.target.value)}>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="moderate">Moderate</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Meals Per Day</label>
                <input type="number" value={mealsPerDay} onChange={(e) => setMealsPerDay(e.target.value)} placeholder="3" />
              </div>
              <div className="input-group">
                <label className="input-label">Craving Times</label>
                <div className="checkbox-grid">
                  {["Morning", "Afternoon", "Evening", "Late night"].map(time => (
                    <label key={time} className="checkbox-label">
                      <input type="checkbox" checked={cravingTimes.includes(time)} onChange={() => toggleArrayItem(cravingTimes, setCravingTimes, time)} />
                      {time}
                    </label>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Favorite Foods</label>
                <input type="text" value={favoriteFoods} onChange={(e) => setFavoriteFoods(e.target.value)} placeholder="Pizza, Pasta, Salad..." />
              </div>
              <div className="input-group">
                <label className="input-label">Macro Preference</label>
                <select value={macroPreference} onChange={(e) => setMacroPreference(e.target.value)}>
                  <option value="">Select</option>
                  <option value="high_protein">High Protein</option>
                  <option value="balanced">Balanced</option>
                  <option value="low_carb">Low Carb</option>
                  <option value="low_fat">Low Fat</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 6: Dietary Restrictions */}
          {step === 6 && (
            <div className="step-content">
              <h3 className="section-title">🚫 Dietary Restrictions</h3>
              <div className="checkbox-grid">
                {["Lactose intolerance", "Gluten-free", "Nut allergy", "Seafood allergy", "Low sugar", "Low sodium", "Diabetic-friendly"].map(restriction => (
                  <label key={restriction} className="checkbox-label">
                    <input type="checkbox" checked={restrictions.includes(restriction)} onChange={() => toggleArrayItem(restrictions, setRestrictions, restriction)} />
                    {restriction}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Health Conditions */}
          {step === 7 && (
            <div className="step-content">
              <h3 className="section-title">🏥 Health Conditions (Optional)</h3>
              <div className="input-group">
                <label className="input-label">Medical Conditions</label>
                <div className="checkbox-grid">
                  {["Thyroid", "PCOS", "High BP", "High Cholesterol", "Diabetes", "Asthma"].map(condition => (
                    <label key={condition} className="checkbox-label">
                      <input type="checkbox" checked={healthConditions.includes(condition)} onChange={() => toggleArrayItem(healthConditions, setHealthConditions, condition)} />
                      {condition}
                    </label>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Injuries/Pain Areas</label>
                <div className="checkbox-grid">
                  {["Knee", "Back", "Shoulder", "Ankle", "Wrist", "Neck"].map(injury => (
                    <label key={injury} className="checkbox-label">
                      <input type="checkbox" checked={injuries.includes(injury)} onChange={() => toggleArrayItem(injuries, setInjuries, injury)} />
                      {injury}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Motivation & Psychology */}
          {step === 8 && (
            <div className="step-content">
              <h3 className="section-title">🔥 Motivation & Psychology</h3>
              <div className="input-group">
                <label className="input-label">Motivation Level (1-10): {motivationLevel}</label>
                <input type="range" min="1" max="10" value={motivationLevel} onChange={(e) => setMotivationLevel(e.target.value)} className="slider" />
              </div>
              <div className="input-group">
                <label className="input-label">Reminder Frequency</label>
                <select value={reminderFrequency} onChange={(e) => setReminderFrequency(e.target.value)}>
                  <option value="">Select</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="none">No Reminders</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Preferred Trainer Style</label>
                <select value={trainerStyle} onChange={(e) => setTrainerStyle(e.target.value)}>
                  <option value="">Select</option>
                  <option value="strict">Strict</option>
                  <option value="friendly">Friendly</option>
                  <option value="chill">Chill</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Biggest Struggle</label>
                <select value={biggestStruggle} onChange={(e) => setBiggestStruggle(e.target.value)}>
                  <option value="">Select</option>
                  <option value="consistency">Consistency</option>
                  <option value="time">Time Management</option>
                  <option value="laziness">Laziness</option>
                  <option value="cravings">Food Cravings</option>
                  <option value="motivation">Motivation</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Reward Preference</label>
                <select value={rewardPreference} onChange={(e) => setRewardPreference(e.target.value)}>
                  <option value="">Select</option>
                  <option value="badges">Badges & Achievements</option>
                  <option value="cheat_meal">Cheat Meal Suggestions</option>
                  <option value="quotes">Motivation Quotes</option>
                  <option value="progress_charts">Progress Charts</option>
                </select>
              </div>
              <label className="tos-check">
                <input type="checkbox" checked={agreeTos} onChange={(e) => setAgreeTos(e.target.checked)} />
                <span>I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a> *</span>
              </label>
            </div>
          )}

          {error && <p className="error-text">{error}</p>}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={prevStep} disabled={loading}>
                ← Back
              </button>
            )}
            <button className="signup-btn" type={step === totalSteps ? "submit" : "button"} onClick={step === totalSteps ? undefined : nextStep} disabled={loading}>
              {loading ? "Creating..." : step === totalSteps ? "Create Account 🚀" : "Next →"}
            </button>
          </div>
        </form>

        <p className="signin-link">
          Already have an account? <span onClick={() => navigate("/signin")}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
