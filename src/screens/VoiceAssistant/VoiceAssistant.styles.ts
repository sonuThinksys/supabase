import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 40,
  },

  // ── Top row: label + actions ─────────────────────────────────────────────────
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  responseHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stopSpeakingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.priorityHigh,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 4,
  },
  stopSpeakingIcon: {
    fontSize: 11,
    color: Colors.card,
  },
  stopSpeakingText: {
    fontSize: 12,
    color: Colors.card,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    gap: 4,
  },
  resetBtnText: {
    fontSize: 12,
    color: Colors.subText,
    fontWeight: '600',
  },

  // ── AI Response card ─────────────────────────────────────────────────────────
  responseCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  responseLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  responseText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
    marginTop: 6,
  },
  responsePlaceholder: {
    fontSize: 15,
    color: Colors.iconGray,
    fontStyle: 'italic',
    marginTop: 6,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  processingText: {
    fontSize: 14,
    color: Colors.primary,
  },

  // ── Transcript card ──────────────────────────────────────────────────────────
  transcriptCard: {
    backgroundColor: Colors.pageBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  transcriptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transcriptText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },

  // ── Text input row ───────────────────────────────────────────────────────────
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendBtnText: {
    color: Colors.card,
    fontWeight: '600',
    fontSize: 14,
  },

  // ── Mic area ─────────────────────────────────────────────────────────────────
  micArea: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  micRipple: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.18,
    position: 'absolute',
  },
  micRippleActive: {
    opacity: 0.28,
  },
  micBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  micBtnActive: {
    backgroundColor: Colors.secondary,
  },
  micBtnDisabled: {
    opacity: 0.5,
  },
  micIcon: {
    fontSize: 30,
  },
  micHint: {
    marginTop: 14,
    fontSize: 13,
    color: Colors.subText,
    textAlign: 'center',
  },

  // ── Example questions ────────────────────────────────────────────────────────
  examplesSection: {
    marginTop: 4,
    alignItems: 'center',
  },
  examplesLabel: {
    fontSize: 12,
    color: Colors.subText,
    marginBottom: 10,
  },
  exampleChip: {
    backgroundColor: Colors.inputBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  exampleChipText: {
    fontSize: 13,
    color: Colors.subText,
    textAlign: 'center',
  },

  // ── Results section ──────────────────────────────────────────────────────────
  resultsSection: {
    marginBottom: 12,
  },
  resultsSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  // ── Task stats cards ─────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.card,
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.card,
    opacity: 0.88,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // ── Project cards ────────────────────────────────────────────────────────────
  projectCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  projectCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  projectCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  projectTaskBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  projectTaskBadgeText: {
    color: Colors.card,
    fontSize: 11,
    fontWeight: '700',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  memberAvatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.pageBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  memberAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  memberEmail: {
    fontSize: 13,
    color: Colors.text,
    flex: 1,
  },
  memberRoleBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.inputBg,
    marginLeft: 8,
  },
  memberRoleText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  // ── Search result items ──────────────────────────────────────────────────────
  searchItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  searchItemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  searchItemContent: {
    flex: 1,
  },
  searchItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  searchItemProject: {
    fontSize: 12,
    color: Colors.subText,
  },
  searchItemStatus: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginLeft: 8,
  },
  searchItemStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.card,
    textTransform: 'capitalize',
  },
  noResultsText: {
    fontSize: 14,
    color: Colors.subText,
    textAlign: 'center',
    paddingVertical: 12,
    fontStyle: 'italic',
  },

  // ── Member project card ───────────────────────────────────────────────────────
  memberProjectCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  memberProjectLeft: {
    flex: 1,
    marginRight: 8,
  },
  memberProjectName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  memberProjectTasks: {
    fontSize: 12,
    color: Colors.subText,
  },

  // ── Member task row ───────────────────────────────────────────────────────────
  memberTaskRow: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderColor,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  memberTaskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  memberTaskContent: {
    flex: 1,
    marginRight: 8,
  },
  memberTaskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  memberTaskProject: {
    fontSize: 12,
    color: Colors.subText,
  },
  memberTaskStatusBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  memberTaskStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.card,
    textTransform: 'capitalize',
  },
});
