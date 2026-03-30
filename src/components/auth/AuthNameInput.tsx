import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from '../../theme/colors';
import { authStyles } from './auth.styles';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

export default function AuthNameInput({ value, onChangeText, placeholder }: Props) {
  return (
    <View style={authStyles.inputWrapper}>
      <Icon name="user" size={16} color={Colors.iconGray} style={authStyles.inputIcon} />
      <TextInput
        style={authStyles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.iconGray}
        autoCapitalize="words"
        autoCorrect={false}
        autoComplete="name"
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
}
