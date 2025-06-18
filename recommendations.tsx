import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lightbulb, Target, Heart, Utensils, ChevronRight, Star, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { mockRecommendations } from '@/data/mockData';

export default function RecommendationsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'All', icon: Star },
    { key: 'nutrition', label: 'Nutrition', icon: Utensils },
    { key: 'goal', label: 'Goals', icon: Target },
    { key: 'health', label: 'Health', icon: Heart },
  ];

  const filteredRecommendations = selectedCategory === 'all' 
    ? mockRecommendations 
    : mockRecommendations.filter(rec => rec.type === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#22C55E';
      default: return '#6B7280';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Star;
      case 'low': return CheckCircle;
      default: return Lightbulb;
    }
  };

  const nutritionTips = [
    {
      title: 'Meal Timing',
      content: 'Try to eat your largest meal earlier in the day when your metabolism is most active.',
      category: 'General'
    },
    {
      title: 'Hydration',
      content: 'Drink water before meals to help with satiety and proper digestion.',
      category: 'Hydration'
    },
    {
      title: 'Fiber Intake',
      content: 'Include at least one high-fiber food in each meal to improve digestion and satiety.',
      category: 'Digestion'
    },
    {
      title: 'Protein Distribution',
      content: 'Aim for 20-30g of protein per meal for optimal muscle protein synthesis.',
      category: 'Macronutrients'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Recommendations</Text>
          <View style={styles.subtitle}>
            <Lightbulb size={16} color="#F59E0B" />
            <Text style={styles.subtitleText}>Personalized insights for you</Text>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.section}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.key && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.key)}
                >
                  <IconComponent 
                    size={18} 
                    color={selectedCategory === category.key ? '#FFFFFF' : '#6B7280'} 
                  />
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category.key && styles.categoryTextActive
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Personalized Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For You</Text>
          <View style={styles.recommendationsList}>
            {filteredRecommendations.map((recommendation) => {
              const PriorityIcon = getPriorityIcon(recommendation.priority);
              return (
                <TouchableOpacity key={recommendation.id} style={styles.recommendationCard}>
                  <View style={styles.recommendationHeader}>
                    <View style={styles.recommendationIcon}>
                      <PriorityIcon 
                        size={20} 
                        color={getPriorityColor(recommendation.priority)} 
                      />
                    </View>
                    <View style={styles.recommendationInfo}>
                      <Text style={styles.recommendationTitle}>
                        {recommendation.title}
                      </Text>
                      <Text style={styles.recommendationCategory}>
                        {recommendation.category}
                      </Text>
                    </View>
                    <View style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(recommendation.priority) + '20' }
                    ]}>
                      <Text style={[
                        styles.priorityText,
                        { color: getPriorityColor(recommendation.priority) }
                      ]}>
                        {recommendation.priority}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.recommendationDescription}>
                    {recommendation.description}
                  </Text>
                  {recommendation.actionable && (
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Take Action</Text>
                      <ChevronRight size={16} color="#22C55E" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Nutrition Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Tips</Text>
          <View style={styles.tipsList}>
            {nutritionTips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipCategory}>{tip.category}</Text>
                </View>
                <Text style={styles.tipContent}>{tip.content}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Target size={24} color="#3B82F6" />
              <Text style={styles.quickActionTitle}>Adjust Goals</Text>
              <Text style={styles.quickActionSubtitle}>Update your targets</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Utensils size={24} color="#F59E0B" />
              <Text style={styles.quickActionTitle}>Meal Plan</Text>
              <Text style={styles.quickActionSubtitle}>Get personalized meals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Heart size={24} color="#EF4444" />
              <Text style={styles.quickActionTitle}>Health Check</Text>
              <Text style={styles.quickActionSubtitle}>Review your metrics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Reminder */}
        <View style={styles.section}>
          <View style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
              <Lightbulb size={24} color="#F59E0B" />
              <Text style={styles.reminderTitle}>Daily Reminder</Text>
            </View>
            <Text style={styles.reminderText}>
              Remember to log your dinner and stay consistent with your nutrition goals. 
              Small daily actions lead to big long-term results!
            </Text>
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
    marginBottom: 8,
  },
  subtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
  categoryScroll: {
    marginHorizontal: -20,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#22C55E',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  recommendationsList: {
    gap: 16,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  recommendationCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recommendationDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#22C55E',
  },
  tipsList: {
    gap: 12,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  tipCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  quickActions: {
    gap: 12,
  },
  quickAction: {
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
  quickActionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  quickActionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  reminderCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    borderLeft: '4px solid #F59E0B',
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
  },
  reminderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#78350F',
    lineHeight: 20,
  },
});