import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from '../../theme/colors';
import { authStyles } from './auth.styles';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  autoComplete?: 'password' | 'password-new';
};

export default function AuthPasswordInput({
  value,
  onChangeText,
  placeholder,
  showPassword,
  onTogglePassword,
  autoComplete = 'password',
}: Props) {
  return (
    <View style={authStyles.inputWrapper}>
      <Icon name="lock" size={16} color={Colors.iconGray} style={authStyles.inputIcon} />
      <TextInput
        style={authStyles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.iconGray}
        secureTextEntry={!showPassword}
        autoComplete={autoComplete}
        onChangeText={onChangeText}
        value={value}
      />
      <TouchableOpacity onPress={onTogglePassword} style={authStyles.eyeIcon}>
        <Icon name={showPassword ? 'eye' : 'eye-off'} size={16} color={Colors.iconGray} />
      </TouchableOpacity>
    </View>
  );
}