import { View, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../../theme/colors';
import { styles } from './SplashScreen.styles';
import { SPLASH_STRINGS } from './SplashScreen.constants';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Decorative background circles */}
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomRight} />

      {/* Center content */}
      <View style={styles.content}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoInitial}>{SPLASH_STRINGS.APP_INITIAL}</Text>
        </View>
        <Text style={styles.appName}>{SPLASH_STRINGS.APP_NAME}</Text>
        <Text style={styles.tagline}>{SPLASH_STRINGS.TAGLINE}</Text>
      </View>

      {/* Bottom loader */}
      <View style={styles.loaderWrapper}>
        <ActivityIndicator size="small" color={Colors.card} />
      </View>
    </View>
  );
}