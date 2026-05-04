import React, { useState } from 'react';
import {
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

export default function SignUp({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSignUp() {
    setMessage('');

    if (!email.trim() || !password.trim()) {
      setMessage('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data.user) {
        setMessage('Account was not created. Please try again.');
        return;
      }

      if (!data.session) {
        setMessage('Check your email to confirm your account, then log in.');
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Log In' }],
          });
        }, 3000);
        return;
      }

      setMessage('Account created and logged in!');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong while creating the account.');
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
        <Text style={styles.title}>Sign Up</Text>

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
            onPress={handleSignUp}
            style={styles.button}
          >
            Create Account
          </Button>
        )}

        {message ? <Text style={styles.message}>{message}</Text> : null}
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
});