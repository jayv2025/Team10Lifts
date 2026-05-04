export type Recipe = {
  id: string;
  name: string;
  category: string;
  description: string;
};

export const recipes: Recipe[] = [
  {
    id: '1',
    name: 'High Protein Breakfast Bowl',
    category: 'Breakfast',
    description: 'Eggs, turkey sausage, potatoes, and fruit.',
  },
  {
    id: '2',
    name: 'Chicken and Rice Recipe Prep',
    category: 'Lunch',
    description: 'Grilled chicken, rice, vegetables, and light sauce.',
  },
  {
    id: '3',
    name: 'Greek Yogurt Protein Snack',
    category: 'Snack',
    description: 'Greek yogurt, berries, granola, and honey.',
  },
  {
    id: '4',
    name: 'Post Workout Smoothie',
    category: 'Post-Workout',
    description: 'Protein powder, banana, milk, and peanut butter.',
  },
];
