import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },

  // ── Stats ────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  statValuePending: {
    color: Colors.priorityMedium,
  },
  statValueCompleted: {
    color: Colors.priorityLow,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.subText,
    marginTop: 4,
  },

  // ── Section header ────────────────────────────────────────
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },

  // ── Recent task card (read-only) ──────────────────────────
  taskCard: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.inputBg,
    marginLeft: 8,
  },
  statusBadgeCompleted: {
    backgroundColor: Colors.priorityLow,
  },
  statusText: {
    fontSize: 11,
    color: Colors.subText,
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: Colors.card,
  },

  // ── Empty state ───────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.subText,
  },
  emptySubText: {
    fontSize: 13,
    color: Colors.iconGray,
    marginTop: 8,
    textAlign: 'center',
  },

  // ── Header button ─────────────────────────────────────────
  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
  },
  headerBtnText: {
    color: Colors.card,
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Mic header button ─────────────────────────────────────
  micHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});

// ─── Modal styles (used by DashboardVoiceModal) ───────────────────────────────

export const modalStyles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderColor,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderColor,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.priorityHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  modalActionBtnText: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: '600',
  },
  modalResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  modalResetBtnText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScroll: {
    maxHeight: SCREEN_HEIGHT * 0.45,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  transcriptCard: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 14,
  },
  transcriptLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.subText,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transcriptText: {
    fontSize: 15,
    color: Colors.text,
    fontStyle: 'italic',
  },
  aiResponseCard: {
    backgroundColor: `${Colors.primary}12`,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  aiResponseText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  processingText: {
    fontSize: 14,
    color: Colors.subText,
    fontStyle: 'italic',
  },
  resultsSection: {
    gap: 8,
  },
  resultsSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.subText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  resultEmptyText: {
    fontSize: 13,
    color: Colors.iconGray,
    fontStyle: 'italic',
  },
  statsResultRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statsResultCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statsResultValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.card,
  },
  statsResultLabel: {
    fontSize: 10,
    color: Colors.card,
    marginTop: 2,
    opacity: 0.9,
  },
  resultCard: {
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 6,
  },
  resultCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultCardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  resultSubText: {
    fontSize: 12,
    color: Colors.subText,
    marginLeft: 4,
  },
  resultDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resultBadge: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  resultBadgeText: {
    fontSize: 11,
    color: Colors.subText,
    fontWeight: '600',
  },
  resultMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  resultAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.card,
  },
  resultMemberEmail: {
    flex: 1,
    fontSize: 12,
    color: Colors.subText,
  },
  resultRoleBadge: {
    backgroundColor: `${Colors.primary}20`,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  resultRoleText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  idleHintText: {
    fontSize: 14,
    color: Colors.iconGray,
    textAlign: 'center',
    paddingVertical: 16,
    fontStyle: 'italic',
  },
  micArea: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  micRipple: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${Colors.primary}25`,
  },
  micRippleActive: {
    backgroundColor: `${Colors.priorityHigh}30`,
  },
  micBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  micBtnActive: {
    backgroundColor: Colors.priorityHigh,
  },
  micBtnDisabled: {
    backgroundColor: Colors.iconGray,
  },
  micHint: {
    fontSize: 13,
    color: Colors.subText,
    fontWeight: '500',
  },
  createdCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.priorityLow,
  },
  createdCardText: {
    flex: 1,
  },
  createdCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.subText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  createdCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
});
