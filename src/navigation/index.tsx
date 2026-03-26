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

export default function AppNavigator() {
  // undefined = loading, null = no session, Session = authenticated
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
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