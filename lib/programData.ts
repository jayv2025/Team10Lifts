import type { WorkoutDay } from './workoutData';

export type Program = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  goal: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  workouts: WorkoutDay[];
};

export const programs: Program[] = [
  {
    id: 'beginner-strength',
    name: 'Beginner Strength Program',
    subtitle: 'Three efficient sessions to build confidence and full-body strength.',
    description:
      'A simple weekly structure built around the main lifts, steady progression, and enough recovery to keep beginners consistent.',
    goal: 'Learn the basics, get stronger, and recover well between sessions.',
    difficulty: 'Beginner',
    workouts: [
      {
        id: 'beginner-strength-1',
        day: 'Monday',
        focus: 'Full Body A',
        exercises: [
          'Back Squat - 3x5',
          'Bench Press - 3x5',
          'Seated Cable Row - 3x10',
          'Walking Lunges - 2x12',
          'Plank - 3x30 sec',
        ],
        difficulty: 'Beginner',
        favorite: false,
        estimatedTime: '50 min',
      },
      {
        id: 'beginner-strength-2',
        day: 'Wednesday',
        focus: 'Full Body B',
        exercises: [
          'Romanian Deadlift - 3x8',
          'Overhead Press - 3x6',
          'Lat Pulldown - 3x10',
          'Goblet Squat - 3x10',
          'Dead Bug - 3x10 each side',
        ],
        difficulty: 'Beginner',
        favorite: false,
        estimatedTime: '45 min',
      },
      {
        id: 'beginner-strength-3',
        day: 'Friday',
        focus: 'Full Body C',
        exercises: [
          'Trap Bar Deadlift - 3x5',
          'Incline Dumbbell Press - 3x8',
          'Leg Press - 3x10',
          'Assisted Pull-Ups - 3x8',
          'Farmer Carry - 3x30 sec',
        ],
        difficulty: 'Beginner',
        favorite: false,
        estimatedTime: '50 min',
      },
    ],
  },
  {
    id: 'fat-loss',
    name: 'Fat Loss Program',
    subtitle: 'Four sessions built around calorie burn, muscle retention, and pace.',
    description:
      'This split combines strength-focused compound lifts with circuits and conditioning so you can train hard without spending hours in the gym.',
    goal: 'Increase weekly activity, preserve muscle, and improve conditioning.',
    difficulty: 'Intermediate',
    workouts: [
      {
        id: 'fat-loss-1',
        day: 'Monday',
        focus: 'Lower Body + Conditioning',
        exercises: [
          'Front Squat - 4x6',
          'Romanian Deadlift - 3x8',
          'Walking Lunges - 3x12 each leg',
          'Sled Push - 6 rounds',
          'Bike Sprint - 10 min intervals',
        ],
        difficulty: 'Intermediate',
        favorite: false,
        estimatedTime: '60 min',
      },
      {
        id: 'fat-loss-2',
        day: 'Tuesday',
        focus: 'Upper Body Circuit',
        exercises: [
          'Incline Dumbbell Press - 3x10',
          'Chest-Supported Row - 3x10',
          'Arnold Press - 3x12',
          'Battle Ropes - 6x30 sec',
          'Treadmill Incline Walk - 15 min',
        ],
        difficulty: 'Intermediate',
        favorite: false,
        estimatedTime: '55 min',
      },
      {
        id: 'fat-loss-3',
        day: 'Thursday',
        focus: 'Full Body Metabolic Day',
        exercises: [
          'Kettlebell Swing - 4x15',
          'Goblet Squat - 4x12',
          'Push-Ups - 4xAMRAP',
          'TRX Row - 4x12',
          'Row Erg - 12 min intervals',
        ],
        difficulty: 'Intermediate',
        favorite: false,
        estimatedTime: '50 min',
      },
      {
        id: 'fat-loss-4',
        day: 'Saturday',
        focus: 'Core + Cardio Finish',
        exercises: [
          'Step-Ups - 3x12 each leg',
          'Cable Woodchop - 3x15 each side',
          'Hanging Knee Raise - 3x12',
          'Farmer Carry - 4x40 sec',
          'Outdoor Walk - 30 min brisk pace',
        ],
        difficulty: 'Intermediate',
        favorite: false,
        estimatedTime: '45 min',
      },
    ],
  },
  {
    id: 'upper-body-focus',
    name: 'Upper Body Focus Program',
    subtitle: 'A push-pull dominant week for more size and pressing strength.',
    description:
      'Built for lifters who want extra upper-body volume while still keeping enough lower-body work to stay balanced.',
    goal: 'Improve chest, back, shoulder, and arm development with structured volume.',
    difficulty: 'Advanced',
    workouts: [
      {
        id: 'upper-body-focus-1',
        day: 'Monday',
        focus: 'Push Strength',
        exercises: [
          'Barbell Bench Press - 5x5',
          'Seated Dumbbell Shoulder Press - 4x8',
          'Weighted Dips - 3x8',
          'Cable Lateral Raise - 3x15',
          'Rope Pushdown - 3x15',
        ],
        difficulty: 'Advanced',
        favorite: false,
        estimatedTime: '65 min',
      },
      {
        id: 'upper-body-focus-2',
        day: 'Wednesday',
        focus: 'Pull Strength',
        exercises: [
          'Weighted Pull-Ups - 5x5',
          'Barbell Row - 4x8',
          'Single-Arm Dumbbell Row - 3x10',
          'Face Pull - 3x15',
          'EZ-Bar Curl - 3x12',
        ],
        difficulty: 'Advanced',
        favorite: false,
        estimatedTime: '60 min',
      },
      {
        id: 'upper-body-focus-3',
        day: 'Friday',
        focus: 'Upper Hypertrophy',
        exercises: [
          'Incline Bench Press - 4x8',
          'Machine Chest Press - 3x12',
          'Lat Pulldown - 4x10',
          'Rear Delt Fly - 3x15',
          'Hammer Curl Superset Skull Crusher - 3x12',
        ],
        difficulty: 'Advanced',
        favorite: false,
        estimatedTime: '60 min',
      },
      {
        id: 'upper-body-focus-4',
        day: 'Saturday',
        focus: 'Lower Body Maintenance',
        exercises: [
          'Back Squat - 3x5',
          'Romanian Deadlift - 3x8',
          'Leg Curl - 3x12',
          'Standing Calf Raise - 3x15',
          'Ab Wheel Rollout - 3x10',
        ],
        difficulty: 'Advanced',
        favorite: false,
        estimatedTime: '50 min',
      },
    ],
  },
];
