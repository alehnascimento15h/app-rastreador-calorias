'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  Activity, 
  TrendingUp, 
  User, 
  Home,
  Utensils,
  Target,
  Menu,
  X,
  Plus,
  Flame,
  Droplet,
  Clock,
  Award
} from 'lucide-react';
import { Language, UserProfile } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface Meal {
  id: string;
  type: MealType;
  name: string;
  calories: number;
  time: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('pt');
  const [userProfile, setUserProfile] = useState<Partial<UserProfile> | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'meals' | 'workouts' | 'progress' | 'profile'>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) setLanguage(savedLang);

    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const t = (key: string) => getTranslation(language, key as any);

  // Cálculo de calorias diárias baseado no objetivo
  const calculateDailyCalories = () => {
    if (!userProfile?.currentWeight || !userProfile?.goal) return 2000;
    
    const baseCalories = userProfile.currentWeight * 30;
    
    if (userProfile.goal === 'lose') return Math.round(baseCalories * 0.8);
    if (userProfile.goal === 'gain') return Math.round(baseCalories * 1.2);
    return Math.round(baseCalories);
  };

  const dailyCalorieGoal = calculateDailyCalories();
  const consumedCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const remainingCalories = dailyCalorieGoal - consumedCalories;
  const calorieProgress = Math.min((consumedCalories / dailyCalorieGoal) * 100, 100);

  const addMeal = (type: MealType) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      type,
      name: 'Refeição',
      calories: 300,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMeals([...meals, newMeal]);
  };

  const addWater = () => {
    setWaterIntake(waterIntake + 250);
  };

  // Home Tab
  const renderHome = () => (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          {language === 'pt' && `Olá, ${userProfile?.name || 'Usuário'}!`}
          {language === 'en' && `Hello, ${userProfile?.name || 'User'}!`}
          {language === 'hi' && `नमस्ते, ${userProfile?.name || 'उपयोगकर्ता'}!`}
        </h2>
        <p className="text-emerald-50">
          {language === 'pt' && 'Vamos alcançar suas metas hoje!'}
          {language === 'en' && "Let's reach your goals today!"}
          {language === 'hi' && 'आज अपने लक्ष्य हासिल करें!'}
        </p>
      </div>

      {/* Calorie Counter */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {language === 'pt' && 'Calorias Hoje'}
            {language === 'en' && 'Calories Today'}
            {language === 'hi' && 'आज की कैलोरी'}
          </h3>
          <Flame className="w-6 h-6 text-orange-500" />
        </div>

        {/* Progress Circle */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${calorieProgress * 5.53} 553`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-900">{consumedCalories}</div>
            <div className="text-sm text-gray-500">/ {dailyCalorieGoal} kcal</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-emerald-50 rounded-xl">
            <div className="text-2xl font-bold text-emerald-600">{remainingCalories}</div>
            <div className="text-xs text-gray-600">
              {language === 'pt' && 'Restantes'}
              {language === 'en' && 'Remaining'}
              {language === 'hi' && 'शेष'}
            </div>
          </div>
          <div className="text-center p-3 bg-cyan-50 rounded-xl">
            <div className="text-2xl font-bold text-cyan-600">{meals.length}</div>
            <div className="text-xs text-gray-600">
              {language === 'pt' && 'Refeições'}
              {language === 'en' && 'Meals'}
              {language === 'hi' && 'भोजन'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => addMeal('snack')}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
        >
          <div className="p-3 bg-emerald-100 rounded-xl w-fit mb-3">
            <Camera className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-left">
            <div className="font-bold text-gray-900 mb-1">
              {language === 'pt' && 'Escanear'}
              {language === 'en' && 'Scan'}
              {language === 'hi' && 'स्कैन'}
            </div>
            <div className="text-xs text-gray-500">
              {language === 'pt' && 'Foto da refeição'}
              {language === 'en' && 'Meal photo'}
              {language === 'hi' && 'भोजन फोटो'}
            </div>
          </div>
        </button>

        <button
          onClick={addWater}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
        >
          <div className="p-3 bg-cyan-100 rounded-xl w-fit mb-3">
            <Droplet className="w-6 h-6 text-cyan-600" />
          </div>
          <div className="text-left">
            <div className="font-bold text-gray-900 mb-1">{waterIntake}ml</div>
            <div className="text-xs text-gray-500">
              {language === 'pt' && 'Água hoje'}
              {language === 'en' && 'Water today'}
              {language === 'hi' && 'आज का पानी'}
            </div>
          </div>
        </button>
      </div>

      {/* Recent Meals */}
      {meals.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {language === 'pt' && 'Refeições Recentes'}
            {language === 'en' && 'Recent Meals'}
            {language === 'hi' && 'हाल के भोजन'}
          </h3>
          <div className="space-y-3">
            {meals.slice(-3).reverse().map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{meal.name}</div>
                    <div className="text-xs text-gray-500">{meal.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">{meal.calories}</div>
                  <div className="text-xs text-gray-500">kcal</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Meals Tab
  const renderMeals = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        {language === 'pt' && 'Refeições'}
        {language === 'en' && 'Meals'}
        {language === 'hi' && 'भोजन'}
      </h2>

      {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => (
        <div key={type} className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 capitalize">
              {language === 'pt' && (
                type === 'breakfast' ? 'Café da Manhã' :
                type === 'lunch' ? 'Almoço' :
                type === 'dinner' ? 'Jantar' : 'Lanche'
              )}
              {language === 'en' && type}
              {language === 'hi' && (
                type === 'breakfast' ? 'नाश्ता' :
                type === 'lunch' ? 'दोपहर का भोजन' :
                type === 'dinner' ? 'रात का खाना' : 'नाश्ता'
              )}
            </h3>
            <button
              onClick={() => addMeal(type)}
              className="p-2 bg-emerald-100 rounded-xl hover:bg-emerald-200 transition-colors"
            >
              <Plus className="w-5 h-5 text-emerald-600" />
            </button>
          </div>

          <div className="space-y-2">
            {meals.filter(m => m.type === type).map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-900">{meal.name}</div>
                  <div className="text-xs text-gray-500">{meal.time}</div>
                </div>
                <div className="font-bold text-emerald-600">{meal.calories} kcal</div>
              </div>
            ))}
            {meals.filter(m => m.type === type).length === 0 && (
              <div className="text-center py-4 text-gray-400 text-sm">
                {language === 'pt' && 'Nenhuma refeição adicionada'}
                {language === 'en' && 'No meals added'}
                {language === 'hi' && 'कोई भोजन नहीं जोड़ा गया'}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Workouts Tab
  const renderWorkouts = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        {language === 'pt' && 'Treinos'}
        {language === 'en' && 'Workouts'}
        {language === 'hi' && 'व्यायाम'}
      </h2>

      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-3xl bg-gradient-to-br from-cyan-100 to-blue-100">
            <Activity className="w-10 h-10 text-cyan-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {language === 'pt' && 'Em Breve'}
            {language === 'en' && 'Coming Soon'}
            {language === 'hi' && 'जल्द आ रहा है'}
          </h3>
          <p className="text-gray-500">
            {language === 'pt' && 'Funcionalidade de treinos em desenvolvimento'}
            {language === 'en' && 'Workout feature under development'}
            {language === 'hi' && 'व्यायाम सुविधा विकास में'}
          </p>
        </div>
      </div>
    </div>
  );

  // Progress Tab
  const renderProgress = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        {language === 'pt' && 'Progresso'}
        {language === 'en' && 'Progress'}
        {language === 'hi' && 'प्रगति'}
      </h2>

      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {language === 'pt' && 'Meta de Peso'}
          {language === 'en' && 'Weight Goal'}
          {language === 'hi' && 'वजन लक्ष्य'}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-500 mb-1">
              {language === 'pt' && 'Atual'}
              {language === 'en' && 'Current'}
              {language === 'hi' && 'वर्तमान'}
            </div>
            <div className="text-3xl font-bold text-gray-900">{userProfile?.currentWeight || 0}</div>
            <div className="text-xs text-gray-500">kg</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-xl">
            <div className="text-sm text-gray-500 mb-1">
              {language === 'pt' && 'Meta'}
              {language === 'en' && 'Goal'}
              {language === 'hi' && 'लक्ष्य'}
            </div>
            <div className="text-3xl font-bold text-emerald-600">{userProfile?.desiredWeight || 0}</div>
            <div className="text-xs text-gray-500">kg</div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-emerald-600" />
            <div>
              <div className="font-bold text-gray-900">
                {language === 'pt' && 'Continue assim!'}
                {language === 'en' && 'Keep it up!'}
                {language === 'hi' && 'ऐसे ही जारी रखें!'}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'pt' && 'Você está no caminho certo'}
                {language === 'en' && "You're on the right track"}
                {language === 'hi' && 'आप सही रास्ते पर हैं'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Profile Tab
  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        {language === 'pt' && 'Perfil'}
        {language === 'en' && 'Profile'}
        {language === 'hi' && 'प्रोफ़ाइल'}
      </h2>

      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-white text-3xl font-bold">
            {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{userProfile?.name || 'Usuário'}</h3>
          <p className="text-gray-500">{userProfile?.email}</p>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-500 mb-1">
              {language === 'pt' && 'Treinos por semana'}
              {language === 'en' && 'Workouts per week'}
              {language === 'hi' && 'सप्ताह में व्यायाम'}
            </div>
            <div className="font-bold text-gray-900">{userProfile?.workoutsPerWeek || '-'}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-sm text-gray-500 mb-1">
              {language === 'pt' && 'Meta'}
              {language === 'en' && 'Goal'}
              {language === 'hi' && 'लक्ष्य'}
            </div>
            <div className="font-bold text-gray-900 capitalize">
              {userProfile?.goal === 'lose' && (language === 'pt' ? 'Perder peso' : language === 'en' ? 'Lose weight' : 'वजन कम करना')}
              {userProfile?.goal === 'gain' && (language === 'pt' ? 'Ganhar peso' : language === 'en' ? 'Gain weight' : 'वजन बढ़ाना')}
              {userProfile?.goal === 'maintain' && (language === 'pt' ? 'Manter peso' : language === 'en' ? 'Maintain weight' : 'वजन बनाए रखना')}
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
          >
            {language === 'pt' && 'Sair'}
            {language === 'en' && 'Logout'}
            {language === 'hi' && 'लॉग आउट'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-24">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI BR</h1>
              <p className="text-xs text-gray-400">
                {language === 'pt' && 'Rastreador de Calorias'}
                {language === 'en' && 'Calorie Tracker'}
                {language === 'hi' && 'कैलोरी ट्रैकर'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {currentTab === 'home' && renderHome()}
        {currentTab === 'meals' && renderMeals()}
        {currentTab === 'workouts' && renderWorkouts()}
        {currentTab === 'progress' && renderProgress()}
        {currentTab === 'profile' && renderProfile()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-around">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              currentTab === 'home' ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setCurrentTab('meals')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              currentTab === 'meals' ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <Utensils className="w-6 h-6" />
            <span className="text-xs font-medium">
              {language === 'pt' && 'Refeições'}
              {language === 'en' && 'Meals'}
              {language === 'hi' && 'भोजन'}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('workouts')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              currentTab === 'workouts' ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <Activity className="w-6 h-6" />
            <span className="text-xs font-medium">
              {language === 'pt' && 'Treinos'}
              {language === 'en' && 'Workouts'}
              {language === 'hi' && 'व्यायाम'}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('progress')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              currentTab === 'progress' ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">
              {language === 'pt' && 'Progresso'}
              {language === 'en' && 'Progress'}
              {language === 'hi' && 'प्रगति'}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              currentTab === 'profile' ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">
              {language === 'pt' && 'Perfil'}
              {language === 'en' && 'Profile'}
              {language === 'hi' && 'प्रोफ़ाइल'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
