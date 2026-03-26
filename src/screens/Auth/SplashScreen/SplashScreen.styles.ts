import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 24,
    letterSpacing: 0.5,
  },
});