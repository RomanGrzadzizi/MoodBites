export type Mood = {
  id: string;
  name: string;
  emoji: string;
  color: string;
};

export type FoodSuggestion = {
  id: string;
  moodId: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number; // in minutes
  isFavorite: boolean;
  image?: string;
  tags?: string[];
};
