import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from './Routes';
import LoginScreen from '../screens/Auth/Login';
import SignupScreen from '../screens/Auth/Signup';

export type AuthStackParamList = {
  [Routes.LOGIN]: undefined;
  [Routes.SIGNUP]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.LOGIN} component={LoginScreen} />
      <Stack.Screen name={Routes.SIGNUP} component={SignupScreen} />
    </Stack.Navigator>
  );
}