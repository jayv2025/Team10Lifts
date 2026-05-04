import React, { useState } from 'react';
import {
  Text,
  TextInput,
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  isDemoAdminCredentials,
  setDemoAdminSession,
} from '../lib/demoAuth';

export default function LogIn({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleLogIn() {
    setMessage('');

    if (!email.trim() || !password.trim()) {
      setMessage('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      if (isDemoAdminCredentials(email, password)) {
        await setDemoAdminSession(true);
        setMessage('Logged in with the demo admin account.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      // Safely check if the user has filled out their profile
      let isProfileComplete = false;
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, fitness_goal')
          .eq('id', data.user.id)
          .single();
        isProfileComplete = !!(profile?.username && profile?.fitness_goal);
      } catch (_) {
        isProfileComplete = false;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: isProfileComplete ? 'Home' : 'View Profile' }],
      });
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong while logging in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F3EEFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      style={styles.container}
    >
      <View style={styles.formCard}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="you@example.com"
          placeholderTextColor="#B0A8C8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Your password"
          placeholderTextColor="#B0A8C8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {loading ? (
          <ActivityIndicator color="#5D00FF" style={{ marginTop: 16 }} />
        ) : (
          <TouchableOpacity onPress={handleLogIn} style={styles.button}>
            <LinearGradient
              colors={['#5D00FF', '#8A3FFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity
          onPress={() => navigation.navigate('Sign Up')}
          style={styles.signUpLink}
        >
          <Text style={styles.signUpLinkText}>
            Don't have an account?{' '}
            <Text style={styles.signUpLinkBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.demoHint}>
          Demo admin: {DEMO_ADMIN_EMAIL} / {DEMO_ADMIN_PASSWORD}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#5D00FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    color: '#1A0040',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A89FC4',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    color: '#5D00FF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    backgroundColor: '#F8F5FF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5DCFF',
    marginBottom: 16,
    color: '#1A0040',
    fontSize: 15,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: '#5D00FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
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
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
  },
  signUpLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpLinkText: {
    color: '#A89FC4',
    fontSize: 13,
  },
  signUpLinkBold: {
    color: '#5D00FF',
    fontWeight: '700',
  },
  demoHint: {
    color: '#B0A8C8',
    marginTop: 16,
    textAlign: 'center',
    fontSize: 11,
  },
});