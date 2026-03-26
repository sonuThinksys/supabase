import { View, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../../theme/colors';
import { styles } from './SplashScreen.styles';
import { SPLASH_STRINGS } from './SplashScreen.constants';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>{SPLASH_STRINGS.APP_NAME}</Text>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}