import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/theme/colors';

// Screens
import MoodSelectionScreen from './src/screens/MoodSelectionScreen';
import FoodSuggestionScreen from './src/screens/FoodSuggestionScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import GroceryListScreen from './src/screens/GroceryListScreen';

export type RootStackParamList = {
  MoodSelection: undefined;
  FoodSuggestion: { mood: { id: string; name: string; emoji: string; color: string } };
  Favorites: undefined;
  GroceryList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen 
            name="MoodSelection" 
            component={MoodSelectionScreen} 
          />
          <Stack.Screen 
            name="FoodSuggestion" 
            component={FoodSuggestionScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="Favorites" 
            component={FavoritesScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="GroceryList" 
            component={GroceryListScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
