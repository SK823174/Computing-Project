import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Search, Plus, Scan, Clock, Star } from 'lucide-react-native';
import { foodDatabase } from '@/data/mockData';

export default function AddFoodScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [quantity, setQuantity] = useState('100');

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBarcodeScan = () => {
    Alert.alert(
      'Barcode Scanner',
      'This feature would open the camera to scan product barcodes and automatically add nutrition information.',
      [{ text: 'OK' }]
    );
  };

  const handleAddFood = (food: any) => {
    const multiplier = parseFloat(quantity) / 100;
    Alert.alert(
      'Food Added',
      `${food.name} (${quantity}g) has been added to your ${selectedMeal}!\n\nCalories: ${Math.round(food.calories * multiplier)}`,
      [{ text: 'OK' }]
    );
  };

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'snack', label: 'Snack' },
  ];

  const recentFoods = [
    'Greek Yogurt',
    'Banana',
    'Chicken Breast',
    'Brown Rice',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Food</Text>
          <TouchableOpacity style={styles.scanButton} onPress={handleBarcodeScan}>
            <Camera size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Meal Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.mealTypeScroll}
          >
            {mealTypes.map((meal) => (
              <TouchableOpacity
                key={meal.key}
                style={[
                  styles.mealTypeButton,
                  selectedMeal === meal.key && styles.mealTypeButtonActive
                ]}
                onPress={() => setSelectedMeal(meal.key as any)}
              >
                <Text style={[
                  styles.mealTypeText,
                  selectedMeal === meal.key && styles.mealTypeTextActive
                ]}>
                  {meal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={handleBarcodeScan}>
              <Scan size={24} color="#22C55E" />
              <Text style={styles.quickActionText}>Scan Barcode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Plus size={24} color="#3B82F6" />
              <Text style={styles.quickActionText}>Create Recipe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Foods</Text>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for food or brand..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Quantity Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity (grams)</Text>
          <TextInput
            style={styles.quantityInput}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="100"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Recent Foods */}
        {searchQuery === '' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#6B7280" />
              <Text style={styles.sectionTitle}>Recent Foods</Text>
            </View>
            <View style={styles.recentFoods}>
              {recentFoods.map((food, index) => (
                <TouchableOpacity key={index} style={styles.recentFoodChip}>
                  <Text style={styles.recentFoodText}>{food}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Food Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'Popular Foods'}
          </Text>
          {filteredFoods.map((food, index) => (
            <View key={index} style={styles.foodCard}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodServing}>{food.servingSize}</Text>
                <View style={styles.foodNutrition}>
                  <Text style={styles.nutritionItem}>{food.calories} kcal</Text>
                  <Text style={styles.nutritionItem}>P: {food.protein}g</Text>
                  <Text style={styles.nutritionItem}>C: {food.carbs}g</Text>
                  <Text style={styles.nutritionItem}>F: {food.fat}g</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => handleAddFood(food)}
              >
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Popular Brands */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Star size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Popular Brands</Text>
          </View>
          <View style={styles.brandGrid}>
            {['McDonald\'s', 'Subway', 'Starbucks', 'KFC'].map((brand, index) => (
              <TouchableOpacity key={index} style={styles.brandCard}>
                <Text style={styles.brandName}>{brand}</Text>
              </TouchableOpacity>
            ))}
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
  scanButton: {
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
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  mealTypeScroll: {
    marginHorizontal: -20,
  },
  mealTypeButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    marginLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mealTypeButtonActive: {
    backgroundColor: '#22C55E',
  },
  mealTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  mealTypeTextActive: {
    color: '#FFFFFF',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
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
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  searchContainer: {
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  quantityInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recentFoods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentFoodChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recentFoodText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  foodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  foodServing: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  foodNutrition: {
    flexDirection: 'row',
    gap: 12,
  },
  nutritionItem: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  addButton: {
    backgroundColor: '#22C55E',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  brandCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  brandName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
});