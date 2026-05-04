import React, { useState } from 'react';
import { Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import { getDemoAdminSession, setDemoAdminSession } from '../lib/demoAuth';

export default function LogOut({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleLogOut() {
    setMessage('');

    try {
      setLoading(true);

      const isDemoAdmin = await getDemoAdminSession();

      if (isDemoAdmin) {
        await setDemoAdminSession(false);
        setMessage('Logged out successfully.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        return;
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage('Logged out successfully.');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong while logging out.');
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
        <Text style={styles.title}>Log Out</Text>

        <Text style={styles.subtitle}>
          Are you sure you want to log out?
        </Text>

        {loading ? (
          <ActivityIndicator color="#5D00FF" />
        ) : (
          <Button
            mode="contained"
            buttonColor="#5D00FF"
            textColor="white"
            onPress={handleLogOut}
            style={styles.button}
          >
            Log Out
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

  subtitle: {
    color: '#5D00FF',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
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
