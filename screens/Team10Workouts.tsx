import React, { useState } from 'react';
import {
  Text,
  TextInput,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
type FilterType = 'All' | 'Favorites' | Difficulty;

type WorkoutDay = {
  id: string;
  day: string;
  focus: string;
  exercises: string[];
  difficulty: Difficulty;
  favorite: boolean;
  estimatedTime: string;
};

export default function Team10Workouts() {
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([
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
  ]);

  const [day, setDay] = useState('');
  const [focus, setFocus] = useState('');
  const [exercisesInput, setExercisesInput] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filters: FilterType[] = [
    'All',
    'Favorites',
    'Beginner',
    'Intermediate',
    'Advanced',
  ];

  const filteredWorkouts = workouts.filter((workout) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Favorites') return workout.favorite;
    return workout.difficulty === activeFilter;
  });

  function clearForm() {
    setDay('');
    setFocus('');
    setExercisesInput('');
    setDifficulty('Beginner');
    setEstimatedTime('');
    setEditingId(null);
  }

  function handleSaveWorkout() {
    setMessage('');

    if (!day.trim() || !focus.trim() || !exercisesInput.trim()) {
      setMessage('Please enter a day, focus, and at least one exercise.');
      return;
    }

    const exerciseList = exercisesInput
      .split('\n')
      .map((exercise) => exercise.trim())
      .filter((exercise) => exercise.length > 0);

    if (editingId) {
      setWorkouts((currentWorkouts) =>
        currentWorkouts.map((workout) =>
          workout.id === editingId
            ? {
                ...workout,
                day: day.trim(),
                focus: focus.trim(),
                exercises: exerciseList,
                difficulty,
                estimatedTime: estimatedTime.trim() || '30 min',
              }
            : workout
        )
      );

      setMessage('Workout updated successfully.');
    } else {
      const newWorkout: WorkoutDay = {
        id: Date.now().toString(),
        day: day.trim(),
        focus: focus.trim(),
        exercises: exerciseList,
        difficulty,
        favorite: false,
        estimatedTime: estimatedTime.trim() || '30 min',
      };

      setWorkouts((currentWorkouts) => [...currentWorkouts, newWorkout]);
      setMessage('Workout added to your weekly split.');
    }

    clearForm();
  }

  function handleEditWorkout(workout: WorkoutDay) {
    setEditingId(workout.id);
    setDay(workout.day);
    setFocus(workout.focus);
    setExercisesInput(workout.exercises.join('\n'));
    setDifficulty(workout.difficulty);
    setEstimatedTime(workout.estimatedTime);
    setMessage('Editing selected workout.');
  }

  function handleDeleteWorkout(id: string) {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.filter((workout) => workout.id !== id)
    );

    if (editingId === id) {
      clearForm();
    }

    setMessage('Workout removed from your weekly split.');
  }

  function toggleFavorite(id: string) {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.map((workout) =>
        workout.id === id
          ? { ...workout, favorite: !workout.favorite }
          : workout
      )
    );
  }

  function getDifficultyStyle(level: Difficulty) {
    if (level === 'Beginner') return styles.beginnerBadge;
    if (level === 'Intermediate') return styles.intermediateBadge;
    return styles.advancedBadge;
  }

  return (
    <LinearGradient
      colors={['#F7F4FF', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.page}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>My Workouts</Text>
          <Text style={styles.subtitle}>
            Build your weekly split, favorite workouts, and organize routines by
            difficulty level.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{workouts.length}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {workouts.filter((workout) => workout.favorite).length}
              </Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredWorkouts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No workouts found</Text>
            <Text style={styles.emptyText}>
              Try changing the filter or create a new workout below.
            </Text>
          </View>
        ) : (
          filteredWorkouts.map((workout) => (
            <View key={workout.id} style={styles.workoutCard}>
              <View style={styles.cardTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.workoutDay}>{workout.day}</Text>
                  <Text style={styles.workoutFocus}>{workout.focus}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => toggleFavorite(workout.id)}
                  style={[
                    styles.favoriteButton,
                    workout.favorite && styles.favoriteButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.favoriteText,
                      workout.favorite && styles.favoriteTextActive,
                    ]}
                  >
                    {workout.favorite ? '♥' : '♡'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.metaRow}>
                <View style={[styles.badge, getDifficultyStyle(workout.difficulty)]}>
                  <Text style={styles.badgeText}>{workout.difficulty}</Text>
                </View>

                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{workout.estimatedTime}</Text>
                </View>
              </View>

              <View style={styles.exerciseList}>
                {workout.exercises.map((exercise, index) => (
                  <Text key={index} style={styles.exerciseText}>
                    • {exercise}
                  </Text>
                ))}
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => handleEditWorkout(workout)}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Edit Workout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteWorkout(workout.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingId ? 'Edit Workout' : 'Create Workout Split'}
          </Text>

          <Text style={styles.label}>Day</Text>
          <TextInput
            placeholder="Example: Thursday"
            value={day}
            onChangeText={setDay}
            style={styles.input}
            placeholderTextColor="#8A819A"
          />

          <Text style={styles.label}>Workout Focus</Text>
          <TextInput
            placeholder="Example: Full Body"
            value={focus}
            onChangeText={setFocus}
            style={styles.input}
            placeholderTextColor="#8A819A"
          />

          <Text style={styles.label}>Estimated Time</Text>
          <TextInput
            placeholder="Example: 40 min"
            value={estimatedTime}
            onChangeText={setEstimatedTime}
            style={styles.input}
            placeholderTextColor="#8A819A"
          />

          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.difficultyRow}>
            {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map(
              (level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setDifficulty(level)}
                  style={[
                    styles.difficultyButton,
                    difficulty === level && styles.difficultyButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      difficulty === level && styles.difficultyTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <Text style={styles.label}>Exercises</Text>
          <TextInput
            placeholder={'One exercise per line\nExample:\nDeadlift - 3x5\nLat Pulldown - 3x10'}
            value={exercisesInput}
            onChangeText={setExercisesInput}
            multiline
            numberOfLines={5}
            style={[styles.input, styles.exerciseInput]}
            placeholderTextColor="#8A819A"
          />

          <TouchableOpacity onPress={handleSaveWorkout} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>
              {editingId ? 'Save Changes' : 'Add Workout'}
            </Text>
          </TouchableOpacity>

          {editingId ? (
            <TouchableOpacity onPress={clearForm} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel Edit</Text>
            </TouchableOpacity>
          ) : null}

          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    shadowColor: '#3B1A6E',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 4,
  },
  title: {
    color: '#32115F',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6D5A80',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F1E9FF',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
  },
  statNumber: {
    color: '#5D00FF',
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: '#6D5A80',
    fontSize: 13,
    marginTop: 2,
  },
  filterScroll: {
    marginBottom: 18,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DDD2F3',
  },
  activeFilterButton: {
    backgroundColor: '#5D00FF',
    borderColor: '#5D00FF',
  },
  filterText: {
    color: '#5D00FF',
    fontWeight: '700',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#32115F',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    color: '#6D5A80',
    textAlign: 'center',
  },
  workoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEE7FA',
    shadowColor: '#3B1A6E',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutDay: {
    color: '#5D00FF',
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  workoutFocus: {
    color: '#221033',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 2,
  },
  favoriteButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1E9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#FFE8F0',
  },
  favoriteText: {
    color: '#5D00FF',
    fontSize: 24,
    fontWeight: '800',
  },
  favoriteTextActive: {
    color: '#D81B60',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  badge: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  beginnerBadge: {
    backgroundColor: '#E6F7EF',
  },
  intermediateBadge: {
    backgroundColor: '#FFF3D9',
  },
  advancedBadge: {
    backgroundColor: '#FFE5E5',
  },
  badgeText: {
    color: '#221033',
    fontSize: 13,
    fontWeight: '800',
  },
  timeBadge: {
    backgroundColor: '#F4F0FA',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  timeText: {
    color: '#5C4B70',
    fontSize: 13,
    fontWeight: '700',
  },
  exerciseList: {
    backgroundColor: '#FAF8FF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  exerciseText: {
    color: '#3A2B4F',
    fontSize: 15,
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#5D00FF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  deleteButton: {
    backgroundColor: '#FFF0F0',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#C62828',
    fontWeight: '800',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EEE7FA',
    shadowColor: '#3B1A6E',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 4,
  },
  formTitle: {
    color: '#32115F',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  label: {
    color: '#3A2B4F',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7F3FF',
    color: '#221033',
    padding: 13,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E4D8F7',
    fontSize: 15,
  },
  exerciseInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  difficultyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  difficultyButton: {
    backgroundColor: '#F7F3FF',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E4D8F7',
  },
  difficultyButtonActive: {
    backgroundColor: '#5D00FF',
    borderColor: '#5D00FF',
  },
  difficultyText: {
    color: '#5D00FF',
    fontWeight: '800',
  },
  difficultyTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#5D00FF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#5D00FF',
    fontWeight: '800',
  },
  message: {
    color: '#32115F',
    backgroundColor: '#F1E9FF',
    padding: 12,
    borderRadius: 14,
    marginTop: 14,
    textAlign: 'center',
    fontWeight: '700',
  },
});