import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '../../../navigation/Routes';
import { RootStackParamList } from '../../../navigation/types';
import { signUpWithEmail } from '../../../services/authService';
import { validateAuthForm, AUTH_COMMON_STRINGS } from '../../../utils/authValidation';
import AuthCard from '../../../components/auth/AuthCard';
import AuthHeader from '../../../components/auth/AuthHeader';
import AuthEmailInput from '../../../components/auth/AuthEmailInput';
import AuthPasswordInput from '../../../components/auth/AuthPasswordInput';
import AuthSubmitButton from '../../../components/auth/AuthSubmitButton';
import AuthFooterLink from '../../../components/auth/AuthFooterLink';
import { SIGNUP_STRINGS } from './Signup.constants';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(() => setShowPassword(p => !p), []);

  // Defined first so signUp can reference it in its dependency array
  const onNavigateLogin = useCallback(
    () => navigation.navigate(Routes.LOGIN),
    [navigation],
  );

  const signUp = useCallback(async () => {
    const validationError = validateAuthForm(email, password);
    if (validationError) {
      Alert.alert(AUTH_COMMON_STRINGS.ALERT_VALIDATION_TITLE, validationError);
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email.trim(), password);
      // Navigate to Login after user acknowledges — email confirmation required
      Alert.alert(
        SIGNUP_STRINGS.ALERT_SIGNUP_SUCCESS_TITLE,
        SIGNUP_STRINGS.ALERT_SIGNUP_SUCCESS_MSG,
        [{ text: 'OK', onPress: onNavigateLogin }],
      );
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : AUTH_COMMON_STRINGS.ALERT_ERROR_FALLBACK;
      Alert.alert(SIGNUP_STRINGS.ALERT_SIGNUP_FAILED, message);
    } finally {
      setLoading(false);
    }
  }, [email, password, onNavigateLogin]);

  return (
    <AuthCard>
      <AuthHeader
        iconName="user-plus"
        title={SIGNUP_STRINGS.TITLE}
        subtitle={SIGNUP_STRINGS.SUBTITLE}
      />

      <AuthEmailInput
        value={email}
        onChangeText={setEmail}
        placeholder={SIGNUP_STRINGS.EMAIL_PLACEHOLDER}
      />

      <AuthPasswordInput
        value={password}
        onChangeText={setPassword}
        placeholder={SIGNUP_STRINGS.PASSWORD_PLACEHOLDER}
        showPassword={showPassword}
        onTogglePassword={toggleShowPassword}
        autoComplete="password-new"
      />

      <AuthSubmitButton
        label={SIGNUP_STRINGS.BUTTON_IDLE}
        loading={loading}
        onPress={signUp}
      />

      <AuthFooterLink
        prompt={SIGNUP_STRINGS.LOGIN_PROMPT}
        linkText={SIGNUP_STRINGS.LOGIN_LINK}
        onPress={onNavigateLogin}
      />
    </AuthCard>
  );
}