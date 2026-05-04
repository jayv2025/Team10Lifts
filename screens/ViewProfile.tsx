import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { getDemoAdminSession } from '../lib/demoAuth';


export default function ViewProfile() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState({
    name: '',
    bio: '',
    fitnessGoal: '',
    profilePicture: null as string | null,
    workoutsCompleted: 12,
  });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadProfile() {
        const isDemo = await getDemoAdminSession();
        if (isDemo) {
          setUser({
            name: 'Admin',
            bio: 'Demo administrator account.',
            fitnessGoal: 'Stay Active',
            profilePicture: null,
            workoutsCompleted: 12,
          });
          setLoading(false);
          return;
        }
        try {
          setLoading(true);
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (!authUser) return;

          const { data } = await supabase
            .from('profiles')
            .select('username, bio, fitness_goal, avatar_url')
            .eq('id', authUser.id)
            .single();

          if (data) {
            setUser((prev) => ({
              ...prev,
              name: data.username || 'Your Name',
              bio: data.bio || 'Add a bio on your profile page.',
              fitnessGoal: data.fitness_goal || 'Not set',
              profilePicture: data.avatar_url || null,
            }));
          }
        } catch (err) {
          console.log('Error loading profile:', err);
        } finally {
          setLoading(false);
        }
      }

      loadProfile();
      
    }, [])
  );

  const goalIcons: Record<string, string> = {
    'Build Strength': '🏋️',
    'Lose Weight': '🔥',
    'Improve Cardio': '🏃',
    'Build Muscle': '💪',
    'Increase Flexibility': '🧘',
    'Stay Active': '⚡',
  };

  const goalIcon = goalIcons[user.fitnessGoal] || '🎯';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#5D00FF" size="large" />
      </View>
    );
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
        <Text style={styles.header}>My Profile</Text>

        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            <LinearGradient colors={['#5D00FF', '#A55FFF']} style={styles.avatarRing}>
              {user.profilePicture ? (
                <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>
                    {user.name ? user.name[0].toUpperCase() : '?'}
                  </Text>
                </View>
              )}
            </LinearGradient>
            <TouchableOpacity
              style={styles.editBadge}
              onPress={() => navigation.navigate('Edit Profile')}
            >
              <Text style={styles.editBadgeText}>✏️</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>FITNESS GOAL</Text>
          <View style={styles.goalRow}>
            <Text style={styles.goalIcon}>{goalIcon}</Text>
            <Text style={styles.goalText}>{user.fitnessGoal}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>STATS</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.workoutsCompleted}</Text>
              <Text style={styles.statDesc}>Workouts{'\n'}Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statDesc}>Week{'\n'}Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.9</Text>
              <Text style={styles.statDesc}>Avg{'\n'}Rating</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('Edit Profile')}
        >
          <LinearGradient
            colors={['#5D00FF', '#8A3FFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.editButtonGradient}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    color: '#5D00FF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 28,
    alignSelf: 'flex-start',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#5D00FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#EDE8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#5D00FF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  editBadgeText: { fontSize: 14 },
  name: {
    color: '#1A0040',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  bio: {
    color: '#6B6B8A',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  sectionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#5D00FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionLabel: {
    color: '#A89FC4',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalIcon: { fontSize: 28 },
  goalText: {
    color: '#5D00FF',
    fontSize: 20,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#5D00FF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statDesc: {
    color: '#9B8FB8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#EDE8FF',
  },
  editButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: '#5D00FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  editButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});