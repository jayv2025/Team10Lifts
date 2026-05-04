import React, { useState } from 'react';
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { appendWorkouts, type Difficulty, type WorkoutDay } from '../lib/workoutData';
import { programs, type Program } from '../lib/programData';

function cloneProgram(program: Program) {
  return {
    ...program,
    workouts: program.workouts.map((workout) => ({
      ...workout,
      exercises: [...workout.exercises],
    })),
  };
}

export default function Team10Programs({ navigation }: any) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [message, setMessage] = useState('');

  function openProgram(program: Program) {
    setSelectedProgram(cloneProgram(program));
    setMessage('');
  }

  function updateSelectedWorkout(
    workoutIndex: number,
    updater: (workout: WorkoutDay) => WorkoutDay
  ) {
    setSelectedProgram((currentProgram) => {
      if (!currentProgram) {
        return currentProgram;
      }

      return {
        ...currentProgram,
        workouts: currentProgram.workouts.map((workout, index) =>
          index === workoutIndex ? updater(workout) : workout
        ),
      };
    });
  }

  function updateWorkoutField(
    workoutIndex: number,
    field: 'day' | 'focus' | 'estimatedTime',
    value: string
  ) {
    updateSelectedWorkout(workoutIndex, (workout) => ({
      ...workout,
      [field]: value,
    }));
  }

  function updateWorkoutDifficulty(workoutIndex: number, difficulty: Difficulty) {
    updateSelectedWorkout(workoutIndex, (workout) => ({
      ...workout,
      difficulty,
    }));
  }

  function updateWorkoutExercises(workoutIndex: number, value: string) {
    updateSelectedWorkout(workoutIndex, (workout) => ({
      ...workout,
      exercises: value
        .split('\n')
        .map((exercise) => exercise.trim())
        .filter((exercise) => exercise.length > 0),
    }));
  }

  async function handleAddProgramToWorkouts() {
    if (!selectedProgram) {
      return;
    }

    const workoutsToAdd: WorkoutDay[] = selectedProgram.workouts.map((workout, index) => ({
      ...workout,
      id: `${Date.now()}-${index}`,
      favorite: false,
      day: workout.day.trim(),
      focus: workout.focus.trim(),
      estimatedTime: workout.estimatedTime.trim() || '45 min',
      exercises: workout.exercises
        .map((exercise) => exercise.trim())
        .filter((exercise) => exercise.length > 0),
    }));

    const hasInvalidWorkout = workoutsToAdd.some(
      (workout) =>
        !workout.day || !workout.focus || workout.exercises.length === 0
    );

    if (hasInvalidWorkout) {
      setMessage('Each workout needs a day, focus, and at least one exercise before adding it.');
      return;
    }

    await appendWorkouts(workoutsToAdd);
    setMessage(`${selectedProgram.name} was added to My Workouts.`);
  }

  if (selectedProgram) {
    return (
      <LinearGradient
        colors={['#F6F0FF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.page}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            onPress={() => {
              setSelectedProgram(null);
              setMessage('');
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to Programs</Text>
          </TouchableOpacity>

          <View style={styles.heroCard}>
            <Text style={styles.heroEyebrow}>Program Builder</Text>
            <Text style={styles.heroTitle}>{selectedProgram.name}</Text>
            <Text style={styles.heroText}>
              Open the template, customize any field, and drop the entire plan
              straight into My Workouts.
            </Text>
          </View>

          <View style={styles.editorCard}>
            <Text style={styles.sectionTitle}>Program Overview</Text>
            <Text style={styles.overviewLabel}>Goal</Text>
            <Text style={styles.overviewText}>{selectedProgram.goal}</Text>
            <Text style={styles.overviewLabel}>Description</Text>
            <Text style={styles.overviewText}>{selectedProgram.description}</Text>
          </View>

          {selectedProgram.workouts.map((workout, index) => (
            <View key={`${selectedProgram.id}-${index}`} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutTitle}>
                  Session {index + 1}
                </Text>
                <View style={styles.difficultyPill}>
                  <Text style={styles.difficultyPillText}>{workout.difficulty}</Text>
                </View>
              </View>

              <Text style={styles.label}>Day</Text>
              <TextInput
                value={workout.day}
                onChangeText={(value) => updateWorkoutField(index, 'day', value)}
                style={styles.input}
                placeholder="Example: Monday"
                placeholderTextColor="#8A819A"
              />

              <Text style={styles.label}>Focus</Text>
              <TextInput
                value={workout.focus}
                onChangeText={(value) => updateWorkoutField(index, 'focus', value)}
                style={styles.input}
                placeholder="Example: Lower Body"
                placeholderTextColor="#8A819A"
              />

              <Text style={styles.label}>Estimated Time</Text>
              <TextInput
                value={workout.estimatedTime}
                onChangeText={(value) => updateWorkoutField(index, 'estimatedTime', value)}
                style={styles.input}
                placeholder="Example: 45 min"
                placeholderTextColor="#8A819A"
              />

              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.segmentRow}>
                {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map(
                  (level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => updateWorkoutDifficulty(index, level)}
                      style={[
                        styles.segmentButton,
                        workout.difficulty === level && styles.segmentButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          workout.difficulty === level && styles.segmentTextActive,
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
                value={workout.exercises.join('\n')}
                onChangeText={(value) => updateWorkoutExercises(index, value)}
                style={[styles.input, styles.exerciseInput]}
                placeholder={'One exercise per line\nExample:\nSquat - 3x8\nLeg Press - 3x12'}
                placeholderTextColor="#8A819A"
                multiline
              />
            </View>
          ))}

          <View style={styles.ctaCard}>
            <TouchableOpacity
              onPress={handleAddProgramToWorkouts}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Add Program to My Workouts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('My Workouts')}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Open My Workouts</Text>
            </TouchableOpacity>

            {message ? <Text style={styles.message}>{message}</Text> : null}
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F6F0FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.page}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Programs</Text>
          <Text style={styles.heroTitle}>Pick a Real Training Plan</Text>
          <Text style={styles.heroText}>
            Each program now includes full workouts. Open one to edit the plan
            and send it straight to My Workouts.
          </Text>
        </View>

        {programs.map((program) => (
          <TouchableOpacity
            key={program.id}
            onPress={() => openProgram(program)}
            style={styles.programCard}
          >
            <View style={styles.programTopRow}>
              <Text style={styles.programName}>{program.name}</Text>
              <View style={styles.programBadge}>
                <Text style={styles.programBadgeText}>{program.difficulty}</Text>
              </View>
            </View>

            <Text style={styles.programSubtitle}>{program.subtitle}</Text>
            <Text style={styles.programDescription}>{program.description}</Text>

            <View style={styles.programFooter}>
              <Text style={styles.programMeta}>
                {program.workouts.length} sessions
              </Text>
              <Text style={styles.programCta}>Open Program</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingTop: 56,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E4D8F7',
    marginBottom: 14,
  },
  backButtonText: {
    color: '#5D00FF',
    fontWeight: '800',
  },
  heroCard: {
    backgroundColor: '#1E1230',
    borderRadius: 28,
    padding: 24,
    marginBottom: 18,
  },
  heroEyebrow: {
    color: '#C8B4FF',
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 10,
  },
  heroText: {
    color: '#E9DFFF',
    fontSize: 15,
    lineHeight: 24,
  },
  programCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEE7FA',
    shadowColor: '#3B1A6E',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 2,
  },
  programTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  programName: {
    flex: 1,
    color: '#23113B',
    fontSize: 24,
    fontWeight: '900',
  },
  programBadge: {
    backgroundColor: '#F1E9FF',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  programBadgeText: {
    color: '#5D00FF',
    fontWeight: '800',
    fontSize: 12,
  },
  programSubtitle: {
    color: '#5D00FF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  programDescription: {
    color: '#54426F',
    fontSize: 15,
    lineHeight: 22,
  },
  programFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    alignItems: 'center',
  },
  programMeta: {
    color: '#6D5A80',
    fontWeight: '700',
  },
  programCta: {
    color: '#5D00FF',
    fontWeight: '900',
  },
  editorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEE7FA',
  },
  sectionTitle: {
    color: '#23113B',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 16,
  },
  overviewLabel: {
    color: '#5D00FF',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  overviewText: {
    color: '#54426F',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  workoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEE7FA',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutTitle: {
    color: '#23113B',
    fontSize: 22,
    fontWeight: '900',
  },
  difficultyPill: {
    backgroundColor: '#F7F3FF',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  difficultyPillText: {
    color: '#5D00FF',
    fontSize: 12,
    fontWeight: '800',
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
    minHeight: 130,
    textAlignVertical: 'top',
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  segmentButton: {
    backgroundColor: '#F7F3FF',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E4D8F7',
  },
  segmentButtonActive: {
    backgroundColor: '#5D00FF',
    borderColor: '#5D00FF',
  },
  segmentText: {
    color: '#5D00FF',
    fontWeight: '800',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  ctaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEE7FA',
  },
  primaryButton: {
    backgroundColor: '#5D00FF',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: '#F1E9FF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
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
