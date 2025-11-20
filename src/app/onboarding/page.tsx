'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, User, Activity, Target, CheckCircle2 } from 'lucide-react';
import { Language, UserProfile, Sex, WorkoutFrequency, Goal, Obstacle, Achievement } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<Language>('pt');
  
  // Form data
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    sex: undefined,
    workoutsPerWeek: undefined,
    goal: undefined,
    currentWeight: 0,
    desiredWeight: 0,
    obstacles: [],
    achievements: [],
  });

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const t = (key: string) => getTranslation(language, key as any);

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save user data and go to testimonials
      localStorage.setItem('userProfile', JSON.stringify(formData));
      router.push('/testimonials');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  const updateFormData = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = <T,>(field: 'obstacles' | 'achievements', item: T) => {
    const currentArray = (formData[field] || []) as T[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateFormData(field, newArray);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.password && formData.birthDate;
      case 2:
        return formData.workoutsPerWeek;
      case 3:
        return formData.goal;
      case 4:
        return formData.currentWeight && formData.currentWeight > 0;
      case 5:
        return formData.obstacles && formData.obstacles.length > 0;
      case 6:
        return formData.achievements && formData.achievements.length > 0;
      default:
        return false;
    }
  };

  const renderStepIcon = (step: number) => {
    const icons = [User, Activity, Target, Activity, Target, CheckCircle2];
    const Icon = icons[step - 1];
    return <Icon className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      {/* Header with Progress */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="text-white text-sm font-medium">
              {t('step')} {currentStep} {t('of')} {totalSteps}
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-2xl">
                    {renderStepIcon(1)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('personalInfo')}</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="João Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="joao@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('password')}</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('birthDate')}</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => updateFormData('birthDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('sex')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['male', 'female', 'other', 'preferNotToSay'] as Sex[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => updateFormData('sex', option)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.sex === option
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        {t(option)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Workouts per week */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-2xl">
                    {renderStepIcon(2)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('fitnessInfo')}</h2>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-4">{t('workoutsPerWeek')}</label>
                  <div className="space-y-3">
                    {(['2', '3-5', '6+'] as WorkoutFrequency[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => updateFormData('workoutsPerWeek', option)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          formData.workoutsPerWeek === option
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <span className="font-semibold">{t(option === '2' ? 'twoTimes' : option === '3-5' ? 'threeToFive' : 'sixPlus')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goal */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-2xl">
                    {renderStepIcon(3)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('currentGoal')}</h2>
                </div>

                <div className="space-y-3">
                  {(['lose', 'gain', 'maintain'] as Goal[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => updateFormData('goal', option)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        formData.goal === option
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <span className="font-semibold">{t(option === 'lose' ? 'loseWeight' : option === 'gain' ? 'gainWeight' : 'maintainWeight')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Weight */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-2xl">
                    {renderStepIcon(4)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Peso</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('currentWeight')}</label>
                  <input
                    type="number"
                    value={formData.currentWeight || ''}
                    onChange={(e) => updateFormData('currentWeight', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="70"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('desiredWeight')}</label>
                  <input
                    type="number"
                    value={formData.desiredWeight || ''}
                    onChange={(e) => updateFormData('desiredWeight', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="65"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Obstacles */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-2xl">
                    {renderStepIcon(5)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('obstacles')}</h2>
                </div>

                <div className="space-y-3">
                  {(['lackOfConsistency', 'badEatingHabits', 'lackOfSupport', 'busySchedule', 'lackOfMealInspiration'] as Obstacle[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleArrayItem('obstacles', option)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        formData.obstacles?.includes(option)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <span className="font-semibold">{t(option)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Achievements */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-2xl">
                    {renderStepIcon(6)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('achievements')}</h2>
                </div>

                <div className="space-y-3">
                  {(['eatHealthier', 'increaseEnergy', 'stayMotivated', 'feelBetter'] as Achievement[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleArrayItem('achievements', option)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        formData.achievements?.includes(option)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <span className="font-semibold">{t(option)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Button */}
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              isStepValid()
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-xl hover:shadow-2xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps ? t('finish') : t('next')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
