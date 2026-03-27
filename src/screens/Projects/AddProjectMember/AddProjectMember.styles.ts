import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },

  // ── Section label ──────────────────────────────────────────
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.subText,
    marginBottom: 8,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── User picker trigger ────────────────────────────────────
  pickerTrigger: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  pickerTriggerText: {
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  pickerTriggerPlaceholder: {
    color: Colors.iconGray,
  },
  pickerChevron: {
    fontSize: 12,
    color: Colors.iconGray,
    marginLeft: 8,
  },

  // ── Role selector ──────────────────────────────────────────
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.borderColor,
  },
  roleChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.subText,
  },
  roleChipTextActive: {
    color: Colors.card,
  },

  // ── Members list ───────────────────────────────────────────
  memberCard: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 14,
  },
  memberInfo: {
    flex: 1,
  },
  memberEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  memberRoleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: Colors.inputBg,
  },
  memberRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
  },

  // ── Submit button ──────────────────────────────────────────
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 15,
  },

  // ── Modal ──────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 32,
    maxHeight: '75%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderColor,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  modalClose: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  userRow: {
    paddingVertical: 13,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  userRowSelected: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.text,
  },
  userEmailSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.subText,
    marginTop: 24,
    fontSize: 14,
  },
  listContent: {
    flexGrow: 1,
  },
});
