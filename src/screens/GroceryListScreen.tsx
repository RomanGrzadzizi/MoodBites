import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useGroceryList } from '../hooks/useGroceryList';

 type RootStackParamList = {
  MoodSelection: undefined;
  FoodSuggestion: { mood: { id: string; name: string; emoji: string; color: string } };
  Favorites: undefined;
  GroceryList: undefined;
};

 type GroceryListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GroceryList'>;

const GroceryListScreen = () => {
  const navigation = useNavigation<GroceryListScreenNavigationProp>();
  const { items, toggle, remove, clearChecked } = useGroceryList();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grocery List</Text>
        <TouchableOpacity onPress={clearChecked} style={styles.clearButton}>
          <Ionicons name="checkmark-done-outline" size={22} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cart-outline" size={48} color={colors.textLight} />
          <Text style={styles.emptyTitle}>Your list is empty</Text>
          <Text style={styles.emptySubtitle}>Add ingredients from a suggestion to start your list.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <TouchableOpacity onPress={() => toggle(item.id)} style={styles.checkbox}>
                {item.checked ? (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color={colors.textLight} />
                )}
              </TouchableOpacity>
              <Text style={[styles.itemText, item.checked && styles.itemChecked]}>{item.title}</Text>
              <TouchableOpacity onPress={() => remove(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  clearButton: { padding: 4 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: colors.textLight, marginTop: 6, textAlign: 'center' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  checkbox: { padding: 4, marginRight: 10 },
  itemText: { flex: 1, color: colors.text },
  itemChecked: { textDecorationLine: 'line-through', color: colors.textLight },
  deleteButton: { padding: 6, marginLeft: 8 },
});

export default GroceryListScreen;
