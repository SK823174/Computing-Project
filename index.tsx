import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Target, Calendar, Plus } from 'lucide-react-native';
import NutritionCard from '@/components/NutritionCard';
import ProgressBar from '@/components/ProgressBar';
import { mockUserProfile, mockNutritionEntries } from '@/data/mockData';
import { calculateBMI, getBMICategory } from '@/utils/healthCalculations';

export default function DashboardScreen() {
  const todayEntries = mockNutritionEntries;
  const totalCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = todayEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = todayEntries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = todayEntries.reduce((sum, entry) => sum + entry.fat, 0);

  const bmi = calculateBMI(mockUserProfile.weight, mockUserProfile.height);
  const bmiCategory = getBMICategory(bmi);

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, {mockUserProfile.name}!</Text>
            <Text style={styles.date}>{getCurrentDate()}</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Today's Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.overviewCard}>
            <View style={styles.calorieSection}>
              <Text style={styles.calorieNumber}>{totalCalories}</Text>
              <Text style={styles.calorieLabel}>calories consumed</Text>
              <Text style={styles.calorieTarget}>
                {mockUserProfile.dailyCalories - totalCalories} remaining
              </Text>
            </View>
            <View style={styles.progressSection}>
              <ProgressBar
                current={totalCalories}
                target={mockUserProfile.dailyCalories}
                label="Daily Goal"
                unit=" kcal"
                color="#22C55E"
              />
            </View>
          </View>
        </View>

        {/* Macronutrients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.macroScroll}
            contentContainerStyle={styles.macroContainer}
          >
            <NutritionCard
              title="Protein"
              current={totalProtein}
              target={mockUserProfile.macroTargets.protein}
              unit="g"
              color="#3B82F6"
            />
            <NutritionCard
              title="Carbs"
              current={totalCarbs}
              target={mockUserProfile.macroTargets.carbs}
              unit="g"
              color="#F59E0B"
            />
            <NutritionCard
              title="Fat"
              current={totalFat}
              target={mockUserProfile.macroTargets.fat}
              unit="g"
              color="#EF4444"
            />
          </ScrollView>
        </View>

        {/* Health Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Target size={24} color="#22C55E" />
              <Text style={styles.metricValue}>BMI {bmi}</Text>
              <Text style={styles.metricLabel}>{bmiCategory}</Text>
            </View>
            <View style={styles.metricCard}>
              <TrendingUp size={24} color="#3B82F6" />
              <Text style={styles.metricValue}>{mockUserProfile.weight}kg</Text>
              <Text style={styles.metricLabel}>Current Weight</Text>
            </View>
            <View style={styles.metricCard}>
              <Calendar size={24} color="#F59E0B" />
              <Text style={styles.metricValue}>12</Text>
              <Text style={styles.metricLabel}>Weeks to Goal</Text>
            </View>
          </View>
        </View>

        {/* Recent Meals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Meals</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {todayEntries.map((entry) => (
            <View key={entry.id} style={styles.mealCard}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{entry.foodName}</Text>
                <Text style={styles.mealDetails}>
                  {entry.quantity}{entry.unit} • {entry.mealType}
                </Text>
              </View>
              <View style={styles.mealCalories}>
                <Text style={styles.caloriesText}>{entry.calories}</Text>
                <Text style={styles.caloriesUnit}>kcal</Text>
              </View>
            </View>
          ))}
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
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#22C55E',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#22C55E',
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  calorieSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  calorieNumber: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  calorieLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  calorieTarget: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#22C55E',
    marginTop: 8,
  },
  progressSection: {
    marginTop: 8,
  },
  macroScroll: {
    marginHorizontal: -20,
  },
  macroContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
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
  metricValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  mealDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  mealCalories: {
    alignItems: 'flex-end',
  },
  caloriesText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  caloriesUnit: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});