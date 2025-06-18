import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard as Edit, Target, Activity, Calendar, CircleAlert as AlertCircle } from 'lucide-react-native';
import { mockUserProfile } from '@/data/mockData';
import { calculateBMI, getBMICategory, calculateTDEE } from '@/utils/healthCalculations';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockUserProfile);

  const bmi = calculateBMI(profile.weight, profile.height);
  const bmiCategory = getBMICategory(bmi);
  const tdee = calculateTDEE(profile);

  const getGoalText = (goalType: string) => {
    switch (goalType) {
      case 'lose_weight': return 'Lose Weight';
      case 'gain_weight': return 'Gain Weight';
      case 'maintain_weight': return 'Maintain Weight';
      case 'build_muscle': return 'Build Muscle';
      default: return 'Unknown Goal';
    }
  };

  const getActivityText = (level: string) => {
    switch (level) {
      case 'sedentary': return 'Sedentary (little/no exercise)';
      case 'light': return 'Light (light exercise 1-3 days/week)';
      case 'moderate': return 'Moderate (moderate exercise 3-5 days/week)';
      case 'active': return 'Active (hard exercise 6-7 days/week)';
      case 'very_active': return 'Very Active (very hard exercise & physical job)';
      default: return 'Unknown Level';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Edit size={20} color="#22C55E" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
            </View>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.goal}>{getGoalText(profile.goals.type)}</Text>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Age</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={profile.age.toString()}
                  onChangeText={(text) => setProfile({...profile, age: parseInt(text) || 0})}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.age} years</Text>
              )}
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Height</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={profile.height.toString()}
                  onChangeText={(text) => setProfile({...profile, height: parseInt(text) || 0})}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.height} cm</Text>
              )}
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Weight</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={profile.weight.toString()}
                  onChangeText={(text) => setProfile({...profile, weight: parseFloat(text) || 0})}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.weight} kg</Text>
              )}
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{profile.gender}</Text>
            </View>
          </View>
        </View>

        {/* Health Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Metrics</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Target size={24} color="#3B82F6" />
              <Text style={styles.metricValue}>BMI {bmi}</Text>
              <Text style={styles.metricCategory}>{bmiCategory}</Text>
            </View>
            <View style={styles.metricCard}>
              <Activity size={24} color="#22C55E" />
              <Text style={styles.metricValue}>{tdee}</Text>
              <Text style={styles.metricCategory}>Daily Calories</Text>
            </View>
          </View>
        </View>

        {/* Activity Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Level</Text>
          <View style={styles.activityCard}>
            <Activity size={20} color="#F59E0B" />
            <View style={styles.activityInfo}>
              <Text style={styles.activityLevel}>{profile.activityLevel.toUpperCase()}</Text>
              <Text style={styles.activityDescription}>
                {getActivityText(profile.activityLevel)}
              </Text>
            </View>
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Target size={20} color="#22C55E" />
              <Text style={styles.goalTitle}>{getGoalText(profile.goals.type)}</Text>
            </View>
            {profile.goals.targetWeight && (
              <Text style={styles.goalDetail}>
                Target Weight: {profile.goals.targetWeight} kg
              </Text>
            )}
            {profile.goals.timeline && (
              <Text style={styles.goalDetail}>
                Timeline: {profile.goals.timeline} weeks
              </Text>
            )}
            <View style={styles.calorieGoal}>
              <Text style={styles.calorieGoalLabel}>Daily Calorie Goal</Text>
              <Text style={styles.calorieGoalValue}>{profile.dailyCalories} kcal</Text>
            </View>
          </View>
        </View>

        {/* Medical Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Conditions</Text>
          <View style={styles.medicalCard}>
            <AlertCircle size={20} color="#F59E0B" />
            <View style={styles.medicalInfo}>
              <Text style={styles.medicalText}>
                {profile.medicalConditions.join(', ')}
              </Text>
            </View>
          </View>
        </View>

        {/* Macro Targets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Macro Targets</Text>
          <View style={styles.macroTargets}>
            <View style={styles.macroTarget}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>{profile.macroTargets.protein}g</Text>
            </View>
            <View style={styles.macroTarget}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>{profile.macroTargets.carbs}g</Text>
            </View>
            <View style={styles.macroTarget}>
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroValue}>{profile.macroTargets.fat}g</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  goal: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#22C55E',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  infoInput: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  metricCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityInfo: {
    flex: 1,
  },
  activityLevel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  goalDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  calorieGoal: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  calorieGoalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  calorieGoalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#22C55E',
  },
  medicalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medicalInfo: {
    flex: 1,
  },
  medicalText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  macroTargets: {
    flexDirection: 'row',
    gap: 12,
  },
  macroTarget: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  macroLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  macroValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
});