import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../theme/colors';
import { authStyles } from './auth.styles';

type Props = {
  label: string;
  loading: boolean;
  onPress: () => void;
};

export default function AuthSubmitButton({ label, loading, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[authStyles.button, loading && authStyles.buttonDisabled]}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={Colors.card} />
      ) : (
        <Text style={authStyles.buttonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}