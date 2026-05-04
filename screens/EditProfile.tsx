import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { getDemoAdminSession } from '../lib/demoAuth';

const FITNESS_GOALS = [
  { label: 'Build Strength', icon: '🏋️' },
  { label: 'Lose Weight', icon: '🔥' },
  { label: 'Improve Cardio', icon: '🏃' },
  { label: 'Build Muscle', icon: '💪' },
  { label: 'Increase Flexibility', icon: '🧘' },
  { label: 'Stay Active', icon: '⚡' },
];

export default function EditProfile() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const isDemo = await getDemoAdminSession();
      if (isDemo) {
        setName('Admin');
        setBio('Demo administrator account.');
        setFitnessGoal('Stay Active');
        setFetching(false);
        return;
      }
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('profiles')
          .select('username, bio, fitness_goal, avatar_url')
          .eq('id', user.id)
          .single();

        if (data) {
          setName(data.username || '');
          setBio(data.bio || '');
          setFitnessGoal(data.fitness_goal || '');
          setProfilePicture(data.avatar_url || null);
        }
      } catch (err) {
        console.log('Error loading profile:', err);
      } finally {
        setFetching(false);
      }
    }

    loadProfile();
  }, []);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please allow access to your photo library to change your profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfilePicture(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      setMessage('Name cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const isDemo = await getDemoAdminSession();
        if (isDemo) {
        setMessage('Profile editing is not available for the demo admin account.');
        return;
        }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage('Not logged in.');
        return;
      }

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username: name.trim(),
        bio: bio.trim(),
        fitness_goal: fitnessGoal,
        avatar_url: profilePicture,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage('Profile saved!');
      setTimeout(() => navigation.goBack(), 800);
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
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
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Edit Profile</Text>
          <View style={{ width: 60 }} />
        </View>

        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper} activeOpacity={0.85}>
          <LinearGradient colors={['#5D00FF', '#A55FFF']} style={styles.avatarRing}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {name ? name[0].toUpperCase() : '?'}
                </Text>
              </View>
            )}
          </LinearGradient>
          <View style={styles.cameraOverlay}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Tap to change photo</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#B0A8C8"
            autoCapitalize="words"
            style={styles.input}
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us a bit about yourself..."
            placeholderTextColor="#B0A8C8"
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea]}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Fitness Goal</Text>
          <View style={styles.goalGrid}>
            {FITNESS_GOALS.map((goal) => {
              const isSelected = fitnessGoal === goal.label;
              return (
                <TouchableOpacity
                  key={goal.label}
                  onPress={() => setFitnessGoal(goal.label)}
                  style={[styles.goalChip, isSelected && styles.goalChipSelected]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.goalChipIcon}>{goal.icon}</Text>
                  <Text style={[styles.goalChipText, isSelected && styles.goalChipTextSelected]}>
                    {goal.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {message ? (
          <Text style={[styles.message, message === 'Profile saved!' && styles.messageSuccess]}>
            {message}
          </Text>
        ) : null}

        {loading ? (
          <ActivityIndicator color="#5D00FF" style={{ marginTop: 24 }} />
        ) : (
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <LinearGradient
              colors={['#5D00FF', '#8A3FFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
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
    paddingBottom: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 28,
  },
  backButton: { width: 60 },
  backButtonText: {
    color: '#5D00FF',
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    color: '#1A0040',
    fontSize: 20,
    fontWeight: '800',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 8,
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
  cameraOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraIcon: { fontSize: 16 },
  avatarHint: {
    color: '#B0A8C8',
    fontSize: 12,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#5D00FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    color: '#5D00FF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#F8F5FF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5DCFF',
    padding: 13,
    fontSize: 15,
    color: '#1A0040',
    marginBottom: 16,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    marginBottom: 0,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#E5DCFF',
    backgroundColor: '#F8F5FF',
  },
  goalChipSelected: {
    borderColor: '#5D00FF',
    backgroundColor: '#EDE8FF',
  },
  goalChipIcon: { fontSize: 16 },
  goalChipText: {
    color: '#9B8FB8',
    fontSize: 13,
    fontWeight: '600',
  },
  goalChipTextSelected: {
    color: '#5D00FF',
  },
  message: {
    color: '#FF4444',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  messageSuccess: {
    color: '#22C55E',
  },
  saveButton: {
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
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});