import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NutritionCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export default function NutritionCard({ 
  title, 
  current, 
  target, 
  unit, 
  color 
}: NutritionCardProps) {
  const percentage = (current / target) * 100;
  const isComplete = percentage >= 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.indicator, { backgroundColor: color }]} />
      </View>
      <Text style={styles.current}>
        {Math.round(current)}<Text style={styles.unit}>{unit}</Text>
      </Text>
      <Text style={styles.target}>
        of {Math.round(target)}{unit}
      </Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${Math.min(percentage, 100)}%`, 
                backgroundColor: color 
              }
            ]} 
          />
        </View>
        <Text style={[styles.percentage, isComplete && styles.complete]}>
          {Math.round(percentage)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
    minWidth: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  current: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  unit: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  target: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  percentage: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    minWidth: 32,
    textAlign: 'right',
  },
  complete: {
    color: '#22C55E',
  },
});