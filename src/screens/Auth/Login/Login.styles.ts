import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.subText,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  dividerText: {
    fontSize: 12,
    color: Colors.iconGray,
    marginHorizontal: 8,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  socialButton: {
    width: 52,
    height: 52,
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});