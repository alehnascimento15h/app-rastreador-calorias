// Tipos do AI BR - Rastreador de Calorias

export type Language = 'pt' | 'en' | 'hi';

export type Sex = 'male' | 'female' | 'other' | 'preferNotToSay';

export type WorkoutFrequency = '2' | '3-5' | '6+';

export type Goal = 'lose' | 'gain' | 'maintain';

export type Obstacle = 
  | 'lackOfConsistency'
  | 'badEatingHabits'
  | 'lackOfSupport'
  | 'busySchedule'
  | 'lackOfMealInspiration';

export type Achievement = 
  | 'eatHealthier'
  | 'increaseEnergy'
  | 'stayMotivated'
  | 'feelBetter';

export interface UserProfile {
  // Personal Info
  name: string;
  email: string;
  password: string;
  birthDate: string;
  sex?: Sex;
  
  // Fitness Info
  workoutsPerWeek: WorkoutFrequency;
  goal: Goal;
  currentWeight: number;
  desiredWeight: number;
  obstacles: Obstacle[];
  achievements: Achievement[];
  
  // System
  language: Language;
  createdAt: Date;
}

export interface OnboardingStep {
  step: number;
  totalSteps: number;
  isValid: boolean;
}
