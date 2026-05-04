import React, { useState } from 'react';
import {
  Text,
  TextInput,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import { Button } from 'react-native-paper';
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

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage('Logged in successfully!');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong while logging in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.formCard}>
        <Text style={styles.title}>Log In</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {loading ? (
          <ActivityIndicator color="#5D00FF" />
        ) : (
          <Button
            mode="contained"
            buttonColor="#5D00FF"
            textColor="white"
            onPress={handleLogIn}
            style={styles.button}
          >
            Log In
          </Button>
        )}

        {message ? <Text style={styles.message}>{message}</Text> : null}

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
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 20,
    padding: 24,
  },

  title: {
    color: '#5D00FF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#000000',
    marginBottom: 14,
  },

  button: {
    borderRadius: 25,
    marginTop: 6,
  },

  message: {
    color: '#5D00FF',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '700',
  },

  demoHint: {
    color: '#4B4B4B',
    marginTop: 16,
    textAlign: 'center',
    fontSize: 12,
  },
});
