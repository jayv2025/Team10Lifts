import AsyncStorage from '@react-native-async-storage/async-storage';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type FilterType = 'All' | 'Favorites' | Difficulty;

export type WorkoutDay = {
  id: string;
  day: string;
  focus: string;
  exercises: string[];
  difficulty: Difficulty;
  favorite: boolean;
  estimatedTime: string;
};

const WORKOUTS_STORAGE_KEY = 'team10lifts.workouts';

export const defaultWorkouts: WorkoutDay[] = [
  {
    id: '1',
    day: 'Monday',
    focus: 'Upper Body',
    exercises: [
      'Bench Press - 3x8',
      'Shoulder Press - 3x10',
      'Tricep Pushdowns - 3x12',
    ],
    difficulty: 'Beginner',
    favorite: true,
    estimatedTime: '35 min',
  },
  {
    id: '2',
    day: 'Tuesday',
    focus: 'Lower Body',
    exercises: [
      'Squats - 3x8',
      'Romanian Deadlifts - 3x10',
      'Calf Raises - 3x12',
    ],
    difficulty: 'Intermediate',
    favorite: false,
    estimatedTime: '45 min',
  },
  {
    id: '3',
    day: 'Wednesday',
    focus: 'Rest / Recovery',
    exercises: ['Light walk', 'Stretching', 'Mobility work'],
    difficulty: 'Beginner',
    favorite: false,
    estimatedTime: '20 min',
  },
];

export async function loadWorkouts() {
  const stored = await AsyncStorage.getItem(WORKOUTS_STORAGE_KEY);

  if (!stored) {
    return defaultWorkouts;
  }

  try {
    const parsed = JSON.parse(stored) as WorkoutDay[];
    return parsed.length > 0 ? parsed : defaultWorkouts;
  } catch {
    return defaultWorkouts;
  }
}

export async function saveWorkouts(workouts: WorkoutDay[]) {
  await AsyncStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(workouts));
}

export async function appendWorkouts(workoutsToAdd: WorkoutDay[]) {
  const existingWorkouts = await loadWorkouts();
  const updatedWorkouts = [...existingWorkouts, ...workoutsToAdd];
  await saveWorkouts(updatedWorkouts);
  return updatedWorkouts;
}
