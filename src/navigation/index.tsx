import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { Session } from '@supabase/supabase-js';
import { Routes } from './Routes';
import DrawerNavigator from './DrawerNavigator';
import AuthStack from './AuthStack';
import SplashScreen from '../screens/Auth/SplashScreen';

const Stack = createNativeStackNavigator();
const SPLASH_DURATION_MS = 2000;

export default function AppNavigator() {
  // undefined = loading, null = no session, Session = authenticated
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [splashReady, setSplashReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    const splashTimer = setTimeout(() => {
      setSplashReady(true);
    }, SPLASH_DURATION_MS);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(splashTimer);
    };
  }, []);

  if (session === undefined || !splashReady) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Routes.MAIN_APP}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name={Routes.MAIN_APP}
          component={session ? DrawerNavigator : AuthStack}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}