import { UserProfile, NutritionEntry, Recommendation } from '@/types/health';

export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Alex Johnson',
  age: 28,
  weight: 70,
  height: 175,
  gender: 'male',
  activityLevel: 'moderate',
  medicalConditions: ['None'],
  goals: {
    type: 'lose_weight',
    targetWeight: 65,
    timeline: 12
  },
  dailyCalories: 2200,
  macroTargets: {
    protein: 165,
    carbs: 248,
    fat: 61
  }
};

export const mockNutritionEntries: NutritionEntry[] = [
  {
    id: '1',
    date: '2025-01-27',
    foodName: 'Greek Yogurt with Berries',
    brand: 'Organic Valley',
    quantity: 150,
    unit: 'g',
    calories: 180,
    protein: 15,
    carbs: 20,
    fat: 6,
    fiber: 3,
    sugar: 16,
    sodium: 65,
    mealType: 'breakfast'
  },
  {
    id: '2',
    date: '2025-01-27',
    foodName: 'Grilled Chicken Salad',
    quantity: 300,
    unit: 'g',
    calories: 350,
    protein: 35,
    carbs: 15,
    fat: 18,
    fiber: 8,
    sugar: 8,
    sodium: 420,
    mealType: 'lunch'
  },
  {
    id: '3',
    date: '2025-01-27',
    foodName: 'Salmon with Quinoa',
    quantity: 250,
    unit: 'g',
    calories: 420,
    protein: 32,
    carbs: 35,
    fat: 16,
    fiber: 4,
    sugar: 2,
    sodium: 380,
    mealType: 'dinner'
  }
];

export const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'nutrition',
    title: 'Increase Fiber Intake',
    description: 'You\'re currently at 60% of your daily fiber goal. Try adding more vegetables, fruits, and whole grains to your meals.',
    priority: 'medium',
    category: 'Daily Nutrition',
    actionable: true
  },
  {
    id: '2',
    type: 'goal',
    title: 'On Track for Weight Loss',
    description: 'Great progress! You\'re maintaining a healthy calorie deficit. Keep up the consistent eating patterns.',
    priority: 'high',
    category: 'Weight Management',
    actionable: false
  },
  {
    id: '3',
    type: 'health',
    title: 'Stay Hydrated',
    description: 'Remember to drink at least 8 glasses of water daily to support your metabolism and overall health.',
    priority: 'low',
    category: 'General Health',
    actionable: true
  },
  {
    id: '4',
    type: 'nutrition',
    title: 'Protein Distribution',
    description: 'Try to spread your protein intake throughout the day for better muscle protein synthesis.',
    priority: 'medium',
    category: 'Macronutrients',
    actionable: true
  }
];

export const foodDatabase = [
  {
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    sugar: 14,
    sodium: 1,
    servingSize: '1 medium (118g)'
  },
  {
    name: 'Chicken Breast (Grilled)',
    calories: 231,
    protein: 43.5,
    carbs: 0,
    fat: 5,
    fiber: 0,
    sugar: 0,
    sodium: 104,
    servingSize: '100g'
  },
  {
    name: 'Brown Rice (Cooked)',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    sugar: 0.4,
    sodium: 5,
    servingSize: '100g'
  },
  {
    name: 'Avocado',
    calories: 234,
    protein: 2.9,
    carbs: 12,
    fat: 21,
    fiber: 10,
    sugar: 1,
    sodium: 11,
    servingSize: '1 medium (150g)'
  },
  {
    name: 'Greek Yogurt (Plain)',
    calories: 100,
    protein: 17,
    carbs: 9,
    fat: 0.4,
    fiber: 0,
    sugar: 9,
    sodium: 56,
    servingSize: '150g'
  }
];