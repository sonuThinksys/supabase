import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../../theme/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Decorative background circles
  circleTopLeft: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: Colors.secondary,
    opacity: 0.2,
    top: -width * 0.25,
    left: -width * 0.25,
  },
  circleBottomRight: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: Colors.secondary,
    opacity: 0.15,
    bottom: -width * 0.2,
    right: -width * 0.2,
  },

  // Center content
  content: {
    alignItems: 'center',
    gap: 16,
  },

  // Logo badge
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 8,
  },
  logoInitial: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.primary,
  },

  // Text
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.card,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: Colors.card,
    opacity: 0.75,
    letterSpacing: 0.4,
  },

  // Loader at bottom
  loaderWrapper: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
    gap: 8,
  },
  loaderText: {
    fontSize: 12,
    color: Colors.card,
    opacity: 0.5,
    letterSpacing: 0.3,
  },
});
