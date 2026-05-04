import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

const FITNESS_GOALS = [
  { label: 'Build Strength', icon: '🏋️', desc: 'Lift heavier, get stronger' },
  { label: 'Lose Weight', icon: '🔥', desc: 'Burn fat, feel lighter' },
  { label: 'Improve Cardio', icon: '🏃', desc: 'Boost endurance & stamina' },
  { label: 'Build Muscle', icon: '💪', desc: 'Gain size and definition' },
  { label: 'Increase Flexibility', icon: '🧘', desc: 'Move better, feel better' },
  { label: 'Stay Active', icon: '⚡', desc: 'Keep a healthy lifestyle' },
];

export default function SelectGoal({ navigation, route }: any) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleContinue() {
    if (!selected) {
      setMessage('Please pick a goal to continue.');
      return;
    }

    try {
      setLoading(true);
      const userId = route?.params?.userId;

      if (userId) {
        // Save goal to the profiles table in Supabase
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: userId, fitness_goal: selected });

        if (error) {
          setMessage('Could not save your goal. You can update it in your profile.');
        }
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F3EEFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.emoji}>🎯</Text>
          <Text style={styles.title}>What's your goal?</Text>
          <Text style={styles.subtitle}>
            We'll personalise your experience around what matters most to you.
          </Text>
        </View>

        {/* Goal Options */}
        <View style={styles.goalGrid}>
          {FITNESS_GOALS.map((goal) => {
            const isSelected = selected === goal.label;
            return (
              <TouchableOpacity
                key={goal.label}
                onPress={() => setSelected(goal.label)}
                style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                activeOpacity={0.8}
              >
                <Text style={styles.goalCardIcon}>{goal.icon}</Text>
                <Text
                  style={[
                    styles.goalCardLabel,
                    isSelected && styles.goalCardLabelSelected,
                  ]}
                >
                  {goal.label}
                </Text>
                <Text
                  style={[
                    styles.goalCardDesc,
                    isSelected && styles.goalCardDescSelected,
                  ]}
                >
                  {goal.desc}
                </Text>
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        {/* Continue Button */}
        {loading ? (
          <ActivityIndicator color="#5D00FF" style={{ marginTop: 24 }} />
        ) : (
          <TouchableOpacity
            onPress={handleContinue}
            style={[styles.button, !selected && styles.buttonDisabled]}
            activeOpacity={selected ? 0.85 : 1}
          >
            <LinearGradient
              colors={selected ? ['#5D00FF', '#8A3FFF'] : ['#D0C8E8', '#D0C8E8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Let's Go →</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          style={styles.skipLink}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  /* Header */
  headerBlock: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    color: '#1A0040',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A89FC4',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 16,
  },

  /* Goal Grid */
  goalGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  goalCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: '#EDE8FF',
    shadowColor: '#5D00FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  goalCardSelected: {
    borderColor: '#5D00FF',
    backgroundColor: '#F3EEFF',
    shadowOpacity: 0.18,
  },
  goalCardIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  goalCardLabel: {
    color: '#1A0040',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  goalCardLabelSelected: {
    color: '#5D00FF',
  },
  goalCardDesc: {
    color: '#B0A8C8',
    fontSize: 12,
    lineHeight: 17,
  },
  goalCardDescSelected: {
    color: '#8A6FBB',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#5D00FF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  /* Button */
  button: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
    shadowColor: '#5D00FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  message: {
    color: '#5D00FF',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
  },
  skipLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  skipText: {
    color: '#B0A8C8',
    fontSize: 13,
  },
});