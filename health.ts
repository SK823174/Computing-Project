export interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  medicalConditions: string[];
  goals: {
    type: 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'build_muscle';
    targetWeight?: number;
    timeline?: number; // weeks
  };
  dailyCalories: number;
  macroTargets: {
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
  };
}

export interface NutritionEntry {
  id: string;
  date: string;
  foodName: string;
  brand?: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  entries: NutritionEntry[];
}

export interface Recommendation {
  id: string;
  type: 'nutrition' | 'exercise' | 'health' | 'goal';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
}