import { UserProfile } from '@/types/health';

export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile;
  
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  return Math.round(bmr * activityMultipliers[profile.activityLevel]);
}

export function calculateBMI(weight: number, height: number): number {
  return Number((weight / Math.pow(height / 100, 2)).toFixed(1));
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function calculateMacroTargets(dailyCalories: number, goalType: string) {
  let proteinPercent = 0.25;
  let fatPercent = 0.25;
  let carbPercent = 0.5;

  switch (goalType) {
    case 'lose_weight':
      proteinPercent = 0.3;
      fatPercent = 0.25;
      carbPercent = 0.45;
      break;
    case 'build_muscle':
      proteinPercent = 0.35;
      fatPercent = 0.25;
      carbPercent = 0.4;
      break;
    case 'gain_weight':
      proteinPercent = 0.2;
      fatPercent = 0.3;
      carbPercent = 0.5;
      break;
  }

  return {
    protein: Math.round((dailyCalories * proteinPercent) / 4),
    carbs: Math.round((dailyCalories * carbPercent) / 4),
    fat: Math.round((dailyCalories * fatPercent) / 9),
  };
}

export function getCalorieAdjustment(goalType: string, tdee: number): number {
  switch (goalType) {
    case 'lose_weight':
      return tdee - 500; // 1 lb per week
    case 'gain_weight':
      return tdee + 300; // 0.6 lb per week
    case 'build_muscle':
      return tdee + 200; // Slight surplus
    default:
      return tdee;
  }
}