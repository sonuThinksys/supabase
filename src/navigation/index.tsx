import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { Session } from '@supabase/supabase-js';
import { Routes } from './Routes';
import DrawerNavigator from './DrawerNavigator';
import AuthStack from './AuthStack';
import SplashScreen from '../screens/Auth/SplashScreen';
import { useAppDispatch } from '../store/hooks';
import { setUser, clearUser, UserRole } from '../store/slices/userSlice';

const Stack = createNativeStackNavigator();
const SPLASH_DURATION_MS = 2000;

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  // undefined = loading, null = no session, Session = authenticated
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [splashReady, setSplashReady] = useState(false);

  const loadUserRole = async (currentSession: Session) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentSession.user.id)
      .single();
    const role: UserRole = (!error && data?.role) ? data.role as UserRole : 'user';
    dispatch(setUser({
      userId: currentSession.user.id,
      email: currentSession.user.email ?? '',
      role,
    }));
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        loadUserRole(data.session);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        loadUserRole(newSession);
      } else {
        dispatch(clearUser());
      }
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <Stack.Screen name={Routes.MAIN_APP} component={DrawerNavigator} />
        ) : (
          <Stack.Screen name={Routes.AUTH} component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}