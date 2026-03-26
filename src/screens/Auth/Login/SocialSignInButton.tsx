import { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './Login.styles';

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
  children: ReactNode;
};

export default function SocialSignInButton({ onPress, accessibilityLabel, children }: Props) {
  return (
    <TouchableOpacity
      style={styles.socialButton}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </TouchableOpacity>
  );
}