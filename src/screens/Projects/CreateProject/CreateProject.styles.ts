import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: Colors.text,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 15,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 15,
  },
});