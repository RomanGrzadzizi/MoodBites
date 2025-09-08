import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Mood } from '../types';
import { moods } from '../data/moods';
import { colors } from '../theme/colors';

type RootStackParamList = {
  MoodSelection: undefined;
  FoodSuggestion: { mood: Mood };
  Favorites: undefined;
  GroceryList: undefined;
};

type MoodSelectionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MoodSelection'>;

const MoodSelectionScreen = () => {
  const navigation = useNavigation<MoodSelectionScreenNavigationProp>();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleMoodSelect = (mood: Mood) => {
    navigation.navigate('FoodSuggestion', { mood });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>MoodBites 🍽️</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('GroceryList')} style={[styles.iconButton, { marginRight: 8 }]}>
            <Ionicons name="cart-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')} style={styles.iconButton}>
            <Ionicons name="heart-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>How are you feeling today?</Text>
        <Text style={styles.subtitle}>Select your mood to get a delicious suggestion</Text>
      </View>

      <View style={styles.moodsContainer}>
        {moods.map((mood) => {
          const isHovered = hoveredId === mood.id;
          return (
            <Pressable
              key={mood.id}
              onPress={() => handleMoodSelect(mood)}
              onHoverIn={() => setHoveredId(mood.id)}
              onHoverOut={() => setHoveredId(null)}
              style={[
                styles.moodItem,
                { backgroundColor: `${mood.color}1A` },
                isHovered && styles.moodItemHover,
                Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null,
              ]}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodName}>{mood.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  moodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 0,
  },
  moodItem: {
    width: '31%',
    minWidth: 96,
    height: 88,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: 'transparent',
  },
  moodItemHover: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    borderColor: colors.primary,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  moodName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});

export default MoodSelectionScreen;
