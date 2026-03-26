import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from '../../theme/colors';
import { authStyles } from './auth.styles';

type Props = {
  iconName: string;
  title: string;
  subtitle: string;
};

export default function AuthHeader({ iconName, title, subtitle }: Props) {
  return (
    <>
      <View style={authStyles.iconContainer}>
        <Icon name={iconName} size={26} color={Colors.text} />
      </View>
      <Text style={authStyles.title}>{title}</Text>
      <Text style={authStyles.subtitle}>{subtitle}</Text>
    </>
  );
}