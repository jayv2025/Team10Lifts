import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { supabase } from '../lib/supabase';
import {
  appendWorkouts,
  defaultWorkouts,
  loadWorkouts,
  saveWorkouts,
  type Difficulty,
  type FilterType,
  type WorkoutDay,
} from '../lib/workoutData';

type Workout = WorkoutDay;

type GeneratedWorkout = {
  day: string;
  focus: string;
  exercises: string[];
  difficulty: Difficulty;
  estimatedTime: string;
};

type GeneratedProgram = {
  title: string;
  summary: string;
  workouts: GeneratedWorkout[];
};

const CHAT_PLACEHOLDER =
  'Build me a program for a 3 day a week full body split';

export default function Team10Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>(defaultWorkouts);
  const [day, setDay] = useState('');
  const [focus, setFocus] = useState('');
  const [exerciseText, setExerciseText] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [chatPrompt, setChatPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProgram, setGeneratedProgram] =
    useState<GeneratedProgram | null>(null);
  const [hasLoadedWorkouts, setHasLoadedWorkouts] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      loadWorkouts().then((storedWorkouts) => {
        if (isActive) {
          setWorkouts(storedWorkouts);
          setHasLoadedWorkouts(true);
        }
      });

      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (!hasLoadedWorkouts) {
      return;
    }

    saveWorkouts(workouts);
  }, [hasLoadedWorkouts, workouts]);

  const filteredWorkouts = workouts.filter((workout) => {
    if (filter === 'All') {
      return true;
    }

    if (filter === 'Favorites') {
      return workout.favorite;
    }

    return workout.difficulty === filter;
  });

  function resetForm() {
    setDay('');
    setFocus('');
    setExerciseText('');
    setDifficulty('Beginner');
    setEstimatedTime('');
    setEditingId(null);
  }

  function editWorkout(workout: Workout) {
    setEditingId(workout.id);
    setDay(workout.day);
    setFocus(workout.focus);
    setExerciseText(workout.exercises.join('\n'));
    setDifficulty(workout.difficulty);
    setEstimatedTime(workout.estimatedTime);
    setMessage('Editing selected workout.');
  }

  function saveWorkout() {
    setMessage('');

    if (!day.trim() || !focus.trim() || !exerciseText.trim()) {
      setMessage('Please enter a day, focus, and at least one exercise.');
      return;
    }

    const exercises = exerciseText
      .split('\n')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    if (editingId) {
      setWorkouts((current) =>
        current.map((workout) =>
          workout.id === editingId
            ? {
                ...workout,
                day: day.trim(),
                focus: focus.trim(),
                exercises,
                difficulty,
                estimatedTime: estimatedTime.trim() || '30 min',
              }
            : workout
        )
      );
      setMessage('Workout updated successfully.');
    } else {
      const nextWorkout: Workout = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        day: day.trim(),
        focus: focus.trim(),
        exercises,
        difficulty,
        favorite: false,
        estimatedTime: estimatedTime.trim() || '30 min',
      };

      setWorkouts((current) => [...current, nextWorkout]);
      setMessage('Workout added to your weekly split.');
    }

    resetForm();
  }

  async function generateProgram() {
    const prompt = chatPrompt.trim();

    if (!prompt) {
      setMessage('Enter a prompt to generate a workout program.');
      return;
    }

    setIsGenerating(true);
    setMessage('');

    try {
      const { data, error } = await supabase.functions.invoke(
        'generate-workout-program',
        {
          body: {
            prompt,
          },
        }
      );

      if (error) {
        throw new Error(error.message || 'Failed to generate program.');
      }

      if (!data?.program || !Array.isArray(data.program.workouts)) {
        throw new Error('The AI response was missing workout data.');
      }

      setGeneratedProgram(data.program as GeneratedProgram);
      setMessage('Program generated. Review it below and import when ready.');
    } catch (error) {
      setGeneratedProgram(null);
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to generate a workout program right now.'
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function importGeneratedProgram() {
    if (!generatedProgram) {
      return;
    }

    const importedWorkouts: WorkoutDay[] = generatedProgram.workouts.map(
      (workout, index) => ({
        id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
        day: workout.day,
        focus: workout.focus,
        exercises: workout.exercises,
        difficulty: workout.difficulty,
        estimatedTime: workout.estimatedTime,
        favorite: false,
      })
    );

    appendWorkouts(importedWorkouts)
      .then((updatedWorkouts) => {
        setWorkouts(updatedWorkouts);
        setGeneratedProgram(null);
        setChatPrompt('');
        setMessage(
          `"${generatedProgram.title}" was imported into My Workouts successfully.`
        );
      })
      .catch(() => {
        setMessage('Unable to import the generated program right now.');
      });
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
            Build your weekly split, favorite workouts, and generate a full
            program with AI.
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

        <View style={styles.chatCard}>
          <Text style={styles.formTitle}>AI Program Builder</Text>
          <Text style={styles.chatHint}>
            Ask for a split like "{CHAT_PLACEHOLDER}" and import the generated
            workouts directly into your list.
          </Text>

          <TextInput
            placeholder={CHAT_PLACEHOLDER}
            value={chatPrompt}
            onChangeText={setChatPrompt}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.chatInput]}
            placeholderTextColor="#8A819A"
          />

          <Pressable
            onPress={generateProgram}
            style={[
              styles.saveButton,
              isGenerating && styles.disabledButton,
            ]}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Generate Program</Text>
            )}
          </Pressable>

          {generatedProgram ? (
            <View style={styles.generatedCard}>
              <Text style={styles.generatedTitle}>{generatedProgram.title}</Text>
              <Text style={styles.generatedSummary}>
                {generatedProgram.summary}
              </Text>

              {generatedProgram.workouts.map((workout, index) => (
                <View key={`${workout.day}-${index}`} style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <Text style={styles.workoutDay}>{workout.day}</Text>
                    <Text style={styles.timeText}>{workout.estimatedTime}</Text>
                  </View>

                  <Text style={styles.workoutFocus}>{workout.focus}</Text>
                  <View
                    style={[
                      styles.badge,
                      workout.difficulty === 'Beginner'
                        ? styles.beginnerBadge
                        : workout.difficulty === 'Intermediate'
                        ? styles.intermediateBadge
                        : styles.advancedBadge,
                    ]}
                  >
                    <Text style={styles.badgeText}>{workout.difficulty}</Text>
                  </View>

                  <View style={styles.exerciseList}>
                    {workout.exercises.map((exercise, exerciseIndex) => (
                      <Text
                        key={`${exercise}-${exerciseIndex}`}
                        style={styles.exerciseText}
                      >
                        • {exercise}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}

              <View style={styles.generatedActions}>
                <Pressable
                  onPress={importGeneratedProgram}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>Import Program</Text>
                </Pressable>

                <Pressable
                  onPress={() => setGeneratedProgram(null)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Dismiss Preview</Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {(
            ['All', 'Favorites', 'Beginner', 'Intermediate', 'Advanced'] as FilterType[]
          ).map((option) => (
              <Pressable
                key={option}
                onPress={() => setFilter(option)}
                style={[
                  styles.filterButton,
                  filter === option && styles.activeFilterButton,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === option && styles.activeFilterText,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            )
          )}
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

                <Pressable
                  onPress={() =>
                    setWorkouts((current) =>
                      current.map((entry) =>
                        entry.id === workout.id
                          ? { ...entry, favorite: !entry.favorite }
                          : entry
                      )
                    )
                  }
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
                </Pressable>
              </View>

              <View style={styles.metaRow}>
                <View
                  style={[
                    styles.badge,
                    workout.difficulty === 'Beginner'
                      ? styles.beginnerBadge
                      : workout.difficulty === 'Intermediate'
                      ? styles.intermediateBadge
                      : styles.advancedBadge,
                  ]}
                >
                  <Text style={styles.badgeText}>{workout.difficulty}</Text>
                </View>

                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{workout.estimatedTime}</Text>
                </View>
              </View>

              <View style={styles.exerciseList}>
                {workout.exercises.map((exercise, index) => (
                  <Text key={`${exercise}-${index}`} style={styles.exerciseText}>
                    • {exercise}
                  </Text>
                ))}
              </View>

              <View style={styles.actionRow}>
                <Pressable
                  onPress={() => editWorkout(workout)}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Edit Workout</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setWorkouts((current) =>
                      current.filter((entry) => entry.id !== workout.id)
                    );

                    if (editingId === workout.id) {
                      resetForm();
                    }

                    setMessage('Workout removed from your weekly split.');
                  }}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
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
              (option) => (
                <Pressable
                  key={option}
                  onPress={() => setDifficulty(option)}
                  style={[
                    styles.difficultyButton,
                    difficulty === option && styles.difficultyButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      difficulty === option && styles.difficultyTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              )
            )}
          </View>

          <Text style={styles.label}>Exercises</Text>
          <TextInput
            placeholder={
              'One exercise per line\nExample:\nDeadlift - 3x5\nLat Pulldown - 3x10'
            }
            value={exerciseText}
            onChangeText={setExerciseText}
            multiline
            numberOfLines={5}
            style={[styles.input, styles.exerciseInput]}
            placeholderTextColor="#8A819A"
          />

          <Pressable onPress={saveWorkout} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>
              {editingId ? 'Save Changes' : 'Add Workout'}
            </Text>
          </Pressable>

          {editingId ? (
            <Pressable onPress={resetForm} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel Edit</Text>
            </Pressable>
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
  chatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#EEE7FA',
    shadowColor: '#3B1A6E',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 4,
  },
  chatHint: {
    color: '#6D5A80',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  chatInput: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  generatedCard: {
    marginTop: 18,
    backgroundColor: '#FAF8FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9E0FB',
  },
  generatedTitle: {
    color: '#32115F',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  generatedSummary: {
    color: '#5C4B70',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE7FA',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  generatedActions: {
    marginTop: 6,
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
    marginBottom: 8,
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
    alignSelf: 'flex-start',
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
  disabledButton: {
    opacity: 0.7,
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
