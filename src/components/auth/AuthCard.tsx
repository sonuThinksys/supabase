import { ReactNode } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { authStyles } from './auth.styles';

type Props = {
  children: ReactNode;
};

export default function AuthCard({ children }: Props) {
  return (
    <KeyboardAvoidingView
      style={authStyles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={authStyles.background}>
        <View style={authStyles.card}>{children}</View>
      </View>
    </KeyboardAvoidingView>
  );
}