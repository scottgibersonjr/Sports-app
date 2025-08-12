import React, { useState, useEffect } from 'react';
import { User, Activity, Calendar, TrendingUp, Share2, Target, Clock, Zap } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('onboarding');
  const [userProfile, setUserProfile] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');
    const savedHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const savedPlan = JSON.parse(localStorage.getItem('workoutPlan') || 'null');
    
    if (savedProfile) {
      setUserProfile(savedProfile);
      setCurrentView('dashboard');
    }
    setWorkoutHistory(savedHistory);
    setWorkoutPlan(savedPlan);
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  useEffect(() => {
    if (workoutPlan) {
      localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
    }
  }, [workoutPlan]);

  const workoutDatabase = {
    basketball: {
      cardio: [
        { name: "Suicide Runs", description: "Court sprints touching each line", duration: "3 sets x 30 seconds" },
        { name: "Defensive Slides", description: "Lateral movement staying low", duration: "3 sets x 45 seconds" },
        { name: "Fast Break Sprints", description: "Full court sprints with layup", duration: "5 reps" },
        { name: "Cone Weaving", description: "Agility weaving through cones", duration: "4 sets x 30 seconds" },
        { name: "Jump Rope", description: "Boxer step and double unders", duration: "3 sets x 2 minutes" }
      ],
      strength: [
        { name: "Jump Squats", description: "Explosive squats for vertical leap", duration: "3 sets x 12 reps" },
        { name: "Box Jumps", description: "Jump onto 20-24 inch box", duration: "3 sets x 10 reps" },
        { name: "Single-Leg RDL", description: "Romanian deadlift for stability", duration: "3 sets x 8 each leg" },
        { name: "Medicine Ball Slams", description: "Overhead slams for power", duration: "3 sets x 15 reps" },
        { name: "Push-ups", description: "Standard and diamond variations", duration: "3 sets x 15 reps" },
        { name: "Planks", description: "Core stability hold", duration: "3 sets x 45 seconds" }
      ]
    },
    soccer: {
      cardio: [
        { name: "Field Sprints", description: "40-yard dashes with rest", duration: "6 sets x 40 yards" },
        { name: "Cone Dribbling", description: "Ball control through cones", duration: "4 sets x 45 seconds" },
        { name: "Shuttle Runs", description: "5-10-15 yard shuttle", duration: "4 sets" },
        { name: "Jogger's High Knees", description: "High intensity knee raises", duration: "3 sets x 30 seconds" },
        { name: "Interval Running", description: "Sprint/jog intervals", duration: "20 minutes total" }
      ],
      strength: [
        { name: "Single-Leg Squats", description: "Pistol squats or assisted", duration: "3 sets x 6 each leg" },
        { name: "Lunges", description: "Forward and lateral lunges", duration: "3 sets x 12 each leg" },
        { name: "Calf Raises", description: "Single and double leg", duration: "3 sets x 20 reps" },
        { name: "Core Rotations", description: "Russian twists with ball", duration: "3 sets x 20 reps" },
        { name: "Burpees", description: "Full body explosive movement", duration: "3 sets x 10 reps" },
        { name: "Wall Sits", description: "Leg endurance hold", duration: "3 sets x 45 seconds" }
      ]
    },
    track: {
      cardio: [
        { name: "400m Repeats", description: "Track intervals at 85% effort", duration: "4 sets x 400m" },
        { name: "Hill Sprints", description: "30-second uphill runs", duration: "6 sets x 30 seconds" },
        { name: "Tempo Runs", description: "Sustained comfortable hard pace", duration: "20 minutes" },
        { name: "Fartlek Training", description: "Speed play with varied pace", duration: "25 minutes" },
        { name: "Stair Climbing", description: "Stadium or building stairs", duration: "15 minutes" }
      ],
      strength: [
        { name: "Power Cleans", description: "Olympic lift variation (light weight)", duration: "4 sets x 5 reps" },
        { name: "Plyometric Jumps", description: "Broad jumps and bounds", duration: "3 sets x 8 reps" },
        { name: "Core Circuit", description: "Planks, Russian twists, leg raises", duration: "3 rounds x 45 seconds each" },
        { name: "Single-Leg Deadlifts", description: "Balance and posterior chain", duration: "3 sets x 8 each leg" },
        { name: "Resistance Band Runs", description: "Partner resistance or band", duration: "3 sets x 20 seconds" },
        { name: "Hip Flexor Raises", description: "Hanging or lying leg raises", duration: "3 sets x 12 reps" }
      ]
    }
  };

  const generateWorkoutPlan = (profile) => {
    const { sport, workoutTypes, daysPerWeek, fitnessLevel, experience } = profile;
    
    const difficultyMultiplier = {
      beginner: 0.7,
      intermediate: 1.0,
      advanced: 1.3
    };
    
    const experienceMultiplier = {
      novice: 0.8,
      recreational: 1.0,
      competitive: 1.2
    };
    
    const totalMultiplier = difficultyMultiplier[fitnessLevel] * experienceMultiplier[experience];
    
    const workouts = [];
    const exercises = workoutDatabase[sport];
    
    for (let day = 1; day <= daysPerWeek; day++) {
      const workout = {
        day: day,
        type: workoutTypes[Math.floor(Math.random() * workoutTypes.length)],
        exercises: [],
        estimatedDuration: Math.floor(30 + Math.random() * 30) // 30-60 minutes
      };
      
      const exercisePool = exercises[workout.type];
      const numExercises = Math.floor(4 + Math.random() * 3); // 4-6 exercises
      
      const selectedExercises = [...exercisePool]
        .sort(() => 0.5 - Math.random())
        .slice(0, numExercises);
      
      workout.exercises = selectedExercises.map(exercise => ({
        ...exercise,
        intensity: Math.round(totalMultiplier * 100) / 100
      }));
      
      workouts.push(workout);
    }
    
    return {
      workouts,
      weeklyGoal: `${daysPerWeek} workouts per week`,
      progressionPlan: "Difficulty will increase as you complete workouts and log improvements",
      created: new Date().toISOString()
    };
  };

  const completeOnboarding = (profileData) => {
    const newProfile = { ...profileData, createdAt: new Date().toISOString() };
    setUserProfile(newProfile);
    
    const plan = generateWorkoutPlan(newProfile);
    setWorkoutPlan(plan);
    
    setCurrentView('dashboard');
  };

  const startWorkout = (workout) => {
    setCurrentWorkout(workout);
    setCurrentView('workout');
  };

  const completeWorkout = (workoutData, performance) => {
    const completedWorkout = {
      ...workoutData,
      completedAt: new Date().toISOString(),
      performance,
      rating: performance.difficulty
    };
    
    setWorkoutHistory([completedWorkout, ...workoutHistory]);
    setCurrentWorkout(null);
    setCurrentView('dashboard');
    
    // Simple progression: if workout was too easy, increase difficulty slightly
    if (performance.difficulty < 3) {
      // Could implement more sophisticated progression logic here
    }
  };

  const OnboardingFlow = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
      sport: '',
      experience: '',
      workoutTypes: [],
      daysPerWeek: 3,
      fitnessLevel: ''
    });

    const handleWorkoutTypeToggle = (type) => {
      const updated = formData.workoutTypes.includes(type)
        ? formData.workoutTypes.filter(t => t !== type)
        : [...formData.workoutTypes, type];
      setFormData({...formData, workoutTypes: updated});
    };

    const canProceed = () => {
      switch(step) {
        case 1: return formData.sport !== '';
        case 2: return formData.experience !== '';
        case 3: return formData.workoutTypes.length > 0;
        case 4: return formData.daysPerWeek > 0;
        case 5: return formData.fitnessLevel !== '';
        default: return false;
      }
    };

    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">Athletic Revival</h2>
            <span className="text-sm text-gray-500">Step {step}/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                 style={{width: `${(step/5) * 100}%`}}></div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">What's your sport?</h3>
            <div className="space-y-3">
              {['basketball', 'soccer', 'track'].map(sport => (
                <button
                  key={sport}
                  onClick={() => setFormData({...formData, sport})}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-colors capitalize
                    ${formData.sport === sport 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {sport === 'track' ? 'Track & Field' : sport.charAt(0).toUpperCase() + sport.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">What's your experience level?</h3>
            <div className="space-y-3">
              {[
                {key: 'novice', label: 'Novice', desc: 'New to structured training'},
                {key: 'recreational', label: 'Recreational', desc: 'Some experience with fitness'},
                {key: 'competitive', label: 'Former Athlete', desc: 'Played at high school/college level'}
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => setFormData({...formData, experience: option.key})}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-colors
                    ${formData.experience === option.key 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">What type of workouts?</h3>
            <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
            <div className="space-y-3">
              {[
                {key: 'cardio', label: 'Cardio', desc: 'Endurance and conditioning'},
                {key: 'strength', label: 'Strength', desc: 'Power and muscle building'}
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => handleWorkoutTypeToggle(option.key)}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-colors
                    ${formData.workoutTypes.includes(option.key) 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">How many days per week?</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="2"
                max="6"
                value={formData.daysPerWeek}
                onChange={(e) => setFormData({...formData, daysPerWeek: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600">{formData.daysPerWeek}</span>
                <span className="text-gray-600 ml-2">days per week</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Current fitness level?</h3>
            <div className="space-y-3">
              {[
                {key: 'beginner', label: 'Beginner', desc: 'Just starting or returning after long break'},
                {key: 'intermediate', label: 'Intermediate', desc: 'Some recent fitness activity'},
                {key: 'advanced', label: 'Advanced', desc: 'Currently active and fit'}
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => setFormData({...formData, fitnessLevel: option.key})}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-colors
                    ${formData.fitnessLevel === option.key 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
          )}
          <div className="flex-1"></div>
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => completeOnboarding(formData)}
              disabled={!canProceed()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Create Plan
            </button>
          )}
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    const completedThisWeek = workoutHistory.filter(w => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(w.completedAt) > weekAgo;
    }).length;

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Athlete!</h1>
          <div className="flex items-center space-x-4 text-blue-100">
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>Sport: {userProfile.sport.charAt(0).toUpperCase() + userProfile.sport.slice(1)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{completedThisWeek}/{userProfile.daysPerWeek} this week</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workouts</p>
                <p className="text-2xl font-bold text-gray-800">{workoutHistory.length}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-green-600">{completedThisWeek}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-purple-600">
                  {workoutHistory.length > 0 
                    ? (workoutHistory.reduce((sum, w) => sum + w.rating, 0) / workoutHistory.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Today's Workout */}
        {workoutPlan && (
          <div className="bg-white rounded-lg shadow border">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-orange-500" />
                Your Workouts
              </h2>
              
              <div className="grid gap-4">
                {workoutPlan.workouts.map((workout, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                            Day {workout.day}
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm capitalize">
                            {workout.type}
                          </span>
                          <span className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            ~{workout.estimatedDuration} min
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          {workout.exercises.length} exercises including {workout.exercises.slice(0, 2).map(e => e.name).join(', ')}
                          {workout.exercises.length > 2 && ` and ${workout.exercises.length - 2} more`}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => startWorkout(workout)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Workout
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {workoutHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow border">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {workoutHistory.slice(0, 5).map((workout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium capitalize">{workout.type} workout</span>
                      <span className="text-gray-600 text-sm ml-2">
                        {new Date(workout.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Difficulty:</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <span key={star} className={`text-lg ${star <= workout.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const WorkoutView = () => {
    const [currentExercise, setCurrentExercise] = useState(0);
    const [exerciseComplete, setExerciseComplete] = useState([]);
    const [workoutRating, setWorkoutRating] = useState(3);

    const finishWorkout = () => {
      completeWorkout(currentWorkout, {
        difficulty: workoutRating,
        completedExercises: exerciseComplete.length,
        totalExercises: currentWorkout.exercises.length
      });
    };

    const toggleExerciseComplete = (index) => {
      if (exerciseComplete.includes(index)) {
        setExerciseComplete(exerciseComplete.filter(i => i !== index));
      } else {
        setExerciseComplete([...exerciseComplete, index]);
      }
    };

    if (!currentWorkout) return null;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold flex items-center">
              <Zap className="w-6 h-6 mr-2 text-orange-500" />
              Day {currentWorkout.day} - {currentWorkout.type.charAt(0).toUpperCase() + currentWorkout.type.slice(1)} Workout
            </h1>
            <p className="text-gray-600 mt-1">
              {currentWorkout.exercises.length} exercises • ~{currentWorkout.estimatedDuration} minutes
            </p>
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{exerciseComplete.length}/{currentWorkout.exercises.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{width: `${(exerciseComplete.length / currentWorkout.exercises.length) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {currentWorkout.exercises.map((exercise, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-4 transition-all ${
                  exerciseComplete.includes(index) ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{exercise.name}</h3>
                    <p className="text-gray-600 mt-1">{exercise.description}</p>
                    <p className="text-blue-600 font-medium mt-2">{exercise.duration}</p>
                  </div>
                  <button
                    onClick={() => toggleExerciseComplete(index)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      exerciseComplete.includes(index)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {exerciseComplete.includes(index) ? '✓ Done' : 'Mark Done'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {exerciseComplete.length === currentWorkout.exercises.length && (
            <div className="p-6 border-t bg-gray-50">
              <h3 className="font-semibold mb-3">How was this workout?</h3>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-600">Too Easy</span>
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setWorkoutRating(rating)}
                      className={`text-2xl ${rating <= workoutRating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-600">Too Hard</span>
              </div>
              <button
                onClick={finishWorkout}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Complete Workout
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setCurrentView('dashboard')}
          className="mt-4 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {currentView === 'onboarding' && <OnboardingFlow />}
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'workout' && <WorkoutView />}
    </div>
  );
};

export default App;