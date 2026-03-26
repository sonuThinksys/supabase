import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderColor,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    color: Colors.subText,
    lineHeight: 20,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.card,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.inputBg,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.subText,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.subText,
    marginBottom: 8,
  },
  noteInput: {
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  resolveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  resolveButtonDisabled: {
    opacity: 0.6,
  },
  resolveButtonText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    color: Colors.subText,
    fontWeight: '500',
  },
});