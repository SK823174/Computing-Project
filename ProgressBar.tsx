import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  current: number;
  target: number;
  label: string;
  unit?: string;
  color?: string;
}

export default function ProgressBar({ 
  current, 
  target, 
  label, 
  unit = '', 
  color = '#22C55E' 
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isOverTarget = current > target;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.values, isOverTarget && styles.overTarget]}>
          {Math.round(current)}{unit} / {Math.round(target)}{unit}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${percentage}%`, 
              backgroundColor: isOverTarget ? '#EF4444' : color 
            }
          ]} 
        />
      </View>
      <Text style={styles.percentage}>
        {Math.round(percentage)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  values: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  overTarget: {
    color: '#EF4444',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
  },
});