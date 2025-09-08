import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Mood, FoodSuggestion } from '../types';
import { foodSuggestions } from '../data/foodSuggestions';
import { colors } from '../theme/colors';
import { useFavorites } from '../hooks/useFavorites';
import { useGroceryList } from '../hooks/useGroceryList';

type RootStackParamList = {
  MoodSelection: undefined;
  FoodSuggestion: { mood: Mood };
};

type FoodSuggestionScreenRouteProp = RouteProp<RootStackParamList, 'FoodSuggestion'>;
type FoodSuggestionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FoodSuggestion'>;

const FoodSuggestionScreen = () => {
  const route = useRoute<FoodSuggestionScreenRouteProp>();
  const navigation = useNavigation<FoodSuggestionScreenNavigationProp>();
  const { mood } = route.params;
  
  const [suggestion, setSuggestion] = useState<FoodSuggestion | null>(null);
  const { isFavorite, toggle } = useFavorites();
  const { addMany } = useGroceryList();

  useEffect(() => {
    // Filter suggestions by mood and pick a random one
    const moodSuggestions = foodSuggestions.filter(food => food.moodId === mood.id);
    if (moodSuggestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * moodSuggestions.length);
      setSuggestion(moodSuggestions[randomIndex]);
    }
  }, [mood]);

  const handleNewSuggestion = () => {
    const moodSuggestions = foodSuggestions.filter(food => food.moodId === mood.id);
    if (moodSuggestions.length > 0) {
      const currentIndex = suggestion ? moodSuggestions.findIndex(s => s.id === suggestion.id) : -1;
      let newIndex;
      
      // Get a different random suggestion
      do {
        newIndex = Math.floor(Math.random() * moodSuggestions.length);
      } while (moodSuggestions.length > 1 && newIndex === currentIndex);
      
      setSuggestion(moodSuggestions[newIndex]);
    }
  };

  const addIngredientsToGrocery = () => {
    if (!suggestion) return;
    addMany(suggestion.ingredients, suggestion.id);
    try {
      Alert.alert('Added to Grocery List', 'Ingredients were added to your grocery list.');
    } catch {}
  };

  const toggleFavorite = () => {
    if (!suggestion) return;
    toggle(suggestion.id);
  };

  const shareSuggestion = async () => {
    if (!suggestion) return;
    
    try {
      await Share.share({
        message: `I'm feeling ${mood.name.toLowerCase()} today, so I'm making ${suggestion.name}! ${suggestion.description}`,
        title: `${suggestion.name} for when you're feeling ${mood.name.toLowerCase()}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!suggestion) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading suggestion...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>For when you're {mood.name.toLowerCase()}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.moodBanner, { backgroundColor: `${mood.color}20` }]}>
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
          <Text style={styles.moodName}>{mood.name}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.foodName}>{suggestion.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={toggleFavorite} style={styles.actionButton}>
                <Ionicons 
                  name={suggestion && isFavorite(suggestion.id) ? 'heart' : 'heart-outline'} 
                  size={24} 
                  color={suggestion && isFavorite(suggestion.id) ? colors.primary : colors.textLight} 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={shareSuggestion} style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={22} color={colors.textLight} />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.description}>{suggestion.description}</Text>
          
          <View style={styles.prepTime}>
            <Ionicons name="time-outline" size={16} color={colors.textLight} />
            <Text style={styles.prepTimeText}>{suggestion.prepTime} min</Text>
          </View>

          {suggestion.tags && suggestion.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {suggestion.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {suggestion.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.listItemText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {suggestion.instructions.map((instruction, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.stepNumber}>{index + 1}.</Text>
                <Text style={styles.listItemText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.secondary }]} 
          onPress={addIngredientsToGrocery}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Add ingredients to Grocery List</Text>
        </TouchableOpacity>
        <View style={{ height: 10 }} />
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]} 
          onPress={handleNewSuggestion}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.buttonText}>Try another suggestion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  moodBanner: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  moodName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 24,
  },
  prepTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  prepTimeText: {
    marginLeft: 4,
    color: colors.textLight,
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: `${colors.primary}20`,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: 8,
  },
  stepNumber: {
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
    minWidth: 20,
  },
  listItemText: {
    flex: 1,
    color: colors.text,
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default FoodSuggestionScreen;
