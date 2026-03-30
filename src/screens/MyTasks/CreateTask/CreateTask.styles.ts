import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  subtaskInput: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '600',
    color: Colors.text,
  },
  section: {
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.inputBg,
    borderRadius: 20,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: Colors.secondary,
  },
  chipText: {
    color: Colors.text,
  },
  activeChipText: {
    color: Colors.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    marginLeft: 8,
  },
  addBtnText: {
    color: Colors.card,
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtask: {
    marginLeft: 5,
    color: Colors.subText,
    paddingVertical: 4,
  },
  button: {
    marginTop: 20,
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
    fontWeight: 'bold',
    fontSize: 16,
  },

  // ── Validation ───────────────────────────────────────────────
  inputError: {
    borderWidth: 1.5,
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 2,
  },
  sectionError: {
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
