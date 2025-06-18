import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Calendar, Target, Award, ChevronDown } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [showPeriodSelector, setShowPeriodSelector] = useState(false);

  const periods = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
    { key: '1y', label: '1 Year' },
  ];

  const weeklyData = [
    { day: 'Mon', calories: 2100, target: 2200 },
    { day: 'Tue', calories: 2250, target: 2200 },
    { day: 'Wed', calories: 1950, target: 2200 },
    { day: 'Thu', calories: 2300, target: 2200 },
    { day: 'Fri', calories: 2150, target: 2200 },
    { day: 'Sat', calories: 2400, target: 2200 },
    { day: 'Sun', calories: 2050, target: 2200 },
  ];

  const achievements = [
    { title: '7-Day Streak', icon: '🔥', description: 'Logged food for 7 days in a row' },
    { title: 'Protein Goal', icon: '💪', description: 'Hit protein target 5 days this week' },
    { title: 'Hydration Hero', icon: '💧', description: 'Stayed hydrated for 3 days' },
    { title: 'Balanced Meals', icon: '⚖️', description: 'Maintained macro balance' },
  ];

  const renderChart = () => {
    const maxCalories = Math.max(...weeklyData.map(d => d.calories));
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Daily Calories</Text>
          <TouchableOpacity 
            style={styles.periodSelector}
            onPress={() => setShowPeriodSelector(!showPeriodSelector)}
          >
            <Text style={styles.periodText}>
              {periods.find(p => p.key === selectedPeriod)?.label}
            </Text>
            <ChevronDown size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        {showPeriodSelector && (
          <View style={styles.periodDropdown}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={styles.periodOption}
                onPress={() => {
                  setSelectedPeriod(period.key);
                  setShowPeriodSelector(false);
                }}
              >
                <Text style={[
                  styles.periodOptionText,
                  selectedPeriod === period.key && styles.periodOptionActive
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.chart}>
          {weeklyData.map((data, index) => {
            const height = (data.calories / maxCalories) * 120;
            const targetHeight = (data.target / maxCalories) * 120;
            const isOverTarget = data.calories > data.target;
            
            return (
              <View key={index} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <View style={[styles.targetLine, { bottom: targetHeight }]} />
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height, 
                        backgroundColor: isOverTarget ? '#EF4444' : '#22C55E' 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.dayLabel}>{data.day}</Text>
                <Text style={styles.calorieLabel}>{data.calories}</Text>
              </View>
            );
          })}
        </View>
        
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#22C55E' }]} />
            <Text style={styles.legendText}>Calories</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine]} />
            <Text style={styles.legendText}>Target</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#22C55E" />
              <Text style={styles.statValue}>2,157</Text>
              <Text style={styles.statLabel}>Avg Daily Calories</Text>
              <Text style={styles.statChange}>+2.3% from last week</Text>
            </View>
            <View style={styles.statCard}>
              <Target size={24} color="#3B82F6" />
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Goal Achievement</Text>
              <Text style={styles.statChange}>5 out of 7 days</Text>
            </View>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.section}>
          {renderChart()}
        </View>

        {/* Macro Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Average Macro Breakdown</Text>
          <View style={styles.macroChart}>
            <View style={styles.macroVisual}>
              <View style={styles.macroRing}>
                <Text style={styles.macroCenter}>Weekly{'\n'}Average</Text>
              </View>
            </View>
            <View style={styles.macroStats}>
              <View style={styles.macroStat}>
                <View style={[styles.macroDot, { backgroundColor: '#3B82F6' }]} />
                <Text style={styles.macroLabel}>Protein</Text>
                <Text style={styles.macroValue}>28%</Text>
              </View>
              <View style={styles.macroStat}>
                <View style={[styles.macroDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.macroLabel}>Carbs</Text>
                <Text style={styles.macroValue}>45%</Text>
              </View>
              <View style={styles.macroStat}>
                <View style={[styles.macroDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.macroLabel}>Fat</Text>
                <Text style={styles.macroValue}>27%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
                <Award size={20} color="#F59E0B" />
              </View>
            ))}
          </View>
        </View>

        {/* Progress Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Trends</Text>
          <View style={styles.trendsContainer}>
            <View style={styles.trendCard}>
              <Text style={styles.trendLabel}>Weight Progress</Text>
              <Text style={styles.trendValue}>-1.2 kg</Text>
              <Text style={styles.trendPeriod}>Last 30 days</Text>
              <View style={styles.trendIndicator}>
                <TrendingUp size={16} color="#22C55E" />
                <Text style={styles.trendChange}>On track</Text>
              </View>
            </View>
            <View style={styles.trendCard}>
              <Text style={styles.trendLabel}>Consistency</Text>
              <Text style={styles.trendValue}>89%</Text>
              <Text style={styles.trendPeriod}>Logging rate</Text>
              <View style={styles.trendIndicator}>
                <TrendingUp size={16} color="#22C55E" />
                <Text style={styles.trendChange}>Excellent</Text>
              </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
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
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 4,
  },
  statChange: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#22C55E',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  periodDropdown: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  periodOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  periodOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  periodOptionActive: {
    color: '#22C55E',
    fontFamily: 'Inter-Medium',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '70%',
    borderRadius: 4,
  },
  targetLine: {
    position: 'absolute',
    width: '80%',
    height: 2,
    backgroundColor: '#6B7280',
    left: '10%',
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
  },
  calorieLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLine: {
    width: 12,
    height: 2,
    backgroundColor: '#6B7280',
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  macroChart: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  macroVisual: {
    alignItems: 'center',
    marginBottom: 20,
  },
  macroRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroCenter: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  macroStats: {
    gap: 12,
  },
  macroStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  macroDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  macroLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  macroValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
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
  achievementIcon: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  trendsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  trendCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trendLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
  },
  trendPeriod: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  trendChange: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#22C55E',
  },
});