import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from '../../theme/colors';
import { authStyles } from './auth.styles';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

export default function AuthEmailInput({ value, onChangeText, placeholder }: Props) {
  return (
    <View style={authStyles.inputWrapper}>
      <Icon name="mail" size={16} color={Colors.iconGray} style={authStyles.inputIcon} />
      <TextInput
        style={authStyles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.iconGray}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
}