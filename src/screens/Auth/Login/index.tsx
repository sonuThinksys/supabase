import { useState, useCallback } from 'react';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { Colors } from '../../../theme/colors';
import { Routes } from '../../../navigation/Routes';
import { RootStackParamList } from '../../../navigation/types';
import { signInWithEmail } from '../../../services/authService';
import { validateAuthForm, AUTH_COMMON_STRINGS } from '../../../utils/authValidation';
import AuthCard from '../../../components/auth/AuthCard';
import AuthHeader from '../../../components/auth/AuthHeader';
import AuthEmailInput from '../../../components/auth/AuthEmailInput';
import AuthPasswordInput from '../../../components/auth/AuthPasswordInput';
import AuthSubmitButton from '../../../components/auth/AuthSubmitButton';
import AuthFooterLink from '../../../components/auth/AuthFooterLink';
import SocialSignInButton from './SocialSignInButton';
import { styles } from './Login.styles';
import { LOGIN_STRINGS } from './Login.constants';

type SocialProvider = 'Google' | 'Apple';

// Module-level: stable references, no useCallback needed
const createSocialHandler = (provider: SocialProvider) => () =>
  Alert.alert(
    LOGIN_STRINGS.ALERT_COMING_SOON_TITLE,
    LOGIN_STRINGS.ALERT_SOCIAL_SIGNIN_MSG(provider),
  );

const onGoogleSignIn = createSocialHandler('Google');
const onAppleSignIn = createSocialHandler('Apple');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(() => setShowPassword(p => !p), []);

  const signIn = useCallback(async () => {
    const validationError = validateAuthForm(email, password);
    if (validationError) {
      Alert.alert(AUTH_COMMON_STRINGS.ALERT_VALIDATION_TITLE, validationError);
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      navigation.navigate(Routes.MAIN_APP);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : AUTH_COMMON_STRINGS.ALERT_ERROR_FALLBACK;
      Alert.alert(LOGIN_STRINGS.ALERT_SIGNIN_FAILED, message);
    } finally {
      setLoading(false);
    }
  }, [email, password, navigation]);

  const onForgotPassword = useCallback(() => {
    Alert.alert(LOGIN_STRINGS.ALERT_COMING_SOON_TITLE, LOGIN_STRINGS.ALERT_FORGOT_PASSWORD_MSG);
  }, []);

  const onNavigateSignUp = useCallback(
    () => navigation.navigate(Routes.SIGNUP),
    [navigation],
  );

  return (
    <AuthCard>
      <AuthHeader
        iconName="log-in"
        title={LOGIN_STRINGS.TITLE}
        subtitle={LOGIN_STRINGS.SUBTITLE}
      />

      <AuthEmailInput
        value={email}
        onChangeText={setEmail}
        placeholder={LOGIN_STRINGS.EMAIL_PLACEHOLDER}
      />

      <AuthPasswordInput
        value={password}
        onChangeText={setPassword}
        placeholder={LOGIN_STRINGS.PASSWORD_PLACEHOLDER}
        showPassword={showPassword}
        onTogglePassword={toggleShowPassword}
        autoComplete="password"
      />

      <TouchableOpacity style={styles.forgotWrapper} onPress={onForgotPassword}>
        <Text style={styles.forgotText}>{LOGIN_STRINGS.FORGOT_PASSWORD}</Text>
      </TouchableOpacity>

      <AuthSubmitButton
        label={LOGIN_STRINGS.BUTTON_IDLE}
        loading={loading}
        onPress={signIn}
      />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>{LOGIN_STRINGS.DIVIDER}</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialRow}>
        <SocialSignInButton
          onPress={onGoogleSignIn}
          accessibilityLabel={LOGIN_STRINGS.ACCESSIBILITY_GOOGLE}
        >
          <AntIcon name="google" size={20} color={Colors.googleRed} />
        </SocialSignInButton>
<SocialSignInButton
          onPress={onAppleSignIn}
          accessibilityLabel={LOGIN_STRINGS.ACCESSIBILITY_APPLE}
        >
          <AntIcon name="apple1" size={20} color={Colors.text} />
        </SocialSignInButton>
      </View>

      <AuthFooterLink
        prompt={LOGIN_STRINGS.SIGNUP_PROMPT}
        linkText={LOGIN_STRINGS.SIGNUP_LINK}
        onPress={onNavigateSignUp}
      />
    </AuthCard>
  );
}