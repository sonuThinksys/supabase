import { TouchableOpacity, Text } from 'react-native';
import { authStyles } from './auth.styles';

type Props = {
  prompt: string;
  linkText: string;
  onPress: () => void;
};

export default function AuthFooterLink({ prompt, linkText, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={authStyles.footerWrapper}>
      <Text style={authStyles.footerText}>
        {prompt}
        <Text style={authStyles.footerLink}>{linkText}</Text>
      </Text>
    </TouchableOpacity>
  );
}