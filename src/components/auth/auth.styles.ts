import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const authStyles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: Colors.pageBg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: Colors.inputBg,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.subText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    width: '100%',
    height: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.buttonBg,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 16,
  },
  footerWrapper: {
    marginTop: 8,
  },
  footerText: {
    fontSize: 13,
    color: Colors.subText,
  },
  footerLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
});