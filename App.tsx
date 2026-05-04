import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { Session } from '@supabase/supabase-js';

import { supabase } from './lib/supabase';
import {
  getDemoAdminSession,
  subscribeDemoAdminSession,
} from './lib/demoAuth';

import HomeScreen from './screens/HomeScreen';
import Team10Programs from './screens/Team10Programs';
import Team10Recipes from './screens/Team10Recipes';
import Team10Workouts from './screens/Team10Workouts';
import Team10Meals from './screens/Team10Meals';
import ViewProfile from './screens/ViewProfile';
import LogOut from './screens/LogOut';
import LogIn from './screens/LogIn';
import SignUp from './screens/SignUp';

const Drawer = createDrawerNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([supabase.auth.getSession(), getDemoAdminSession()])
      .then(([{ data }, demoAdminSession]) => {
        if (!isMounted) {
          return;
        }

        setSession(data.session);
        setIsDemoAdmin(demoAdminSession);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    const unsubscribeDemoAdmin = subscribeDemoAdminSession((demoAdminSession) => {
      if (isMounted) {
        setIsDemoAdmin(demoAdminSession);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeDemoAdmin();
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <ActivityIndicator size="large" color="#5D00FF" />
      </View>
    );
  }

  const isLoggedIn = session !== null || isDemoAdmin;

  return (
    <NavigationContainer>
      <Drawer.Navigator
        key={isLoggedIn ? 'logged-in' : 'logged-out'}
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#5D00FF',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerStyle: {
            backgroundColor: '#FFFFFF',
          },
          drawerActiveTintColor: '#5D00FF',
          drawerInactiveTintColor: '#5D00FF',
          drawerLabelStyle: {
            fontSize: 16,
          },
        }}
      >
        {/* Pages everyone can see */}
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />

        <Drawer.Screen
          name="Programs"
          component={Team10Programs}
          options={{ title: 'Programs' }}
        />

        <Drawer.Screen
          name="Recipes"
          component={Team10Recipes}
          options={{ title: 'Recipes' }}
        />

        {/* Pages only logged-in users can see */}
        {isLoggedIn ? (
          <>
            <Drawer.Screen
              name="My Workouts"
              component={Team10Workouts}
              options={{ title: 'My Workouts' }}
            />

            <Drawer.Screen
              name="My Meals"
              component={Team10Meals}
              options={{ title: 'My Meals' }}
            />

            <Drawer.Screen
              name="View Profile"
              component={ViewProfile}
              options={{ title: 'View Profile' }}
            />

            <Drawer.Screen
              name="Log Out"
              component={LogOut}
              options={{ title: 'Log Out' }}
            />
          </>
        ) : (
          <>
            <Drawer.Screen
              name="Sign Up"
              component={SignUp}
              options={{ title: 'Sign Up' }}
            />

            <Drawer.Screen
              name="Log In"
              component={LogIn}
              options={{ title: 'Log In' }}
            />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
