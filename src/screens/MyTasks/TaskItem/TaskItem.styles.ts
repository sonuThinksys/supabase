import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  // ── Swipe action row ──────────────────────────────────────
  actionsRow: {
    flexDirection: 'row',
    paddingRight: 10,
    alignItems: 'center',
  },
  deleteBox: {
    backgroundColor: Colors.priorityHigh,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 6,
    marginLeft: 5,
    alignSelf: 'stretch',
  },
  deleteText: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: 'bold',
  },
  resolveBox: {
    backgroundColor: Colors.priorityLow,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 6,
    marginLeft: 5,
    alignSelf: 'stretch',
  },
  resolveText: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // ── Task card ─────────────────────────────────────────────
  card: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginHorizontal: 5,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },

  // ── Subtasks section ──────────────────────────────────────
  subtasksContainer: {
    marginTop: 10,
  },
  subtasksDivider: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginBottom: 8,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.card,
    fontSize: 11,
    fontWeight: 'bold',
  },
  subtaskTitle: {
    fontSize: 13,
    color: Colors.subText,
    flex: 1,
  },
  subtaskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.iconGray,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  progressText: {
    fontSize: 11,
    color: Colors.iconGray,
  },
  progressCount: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
});
