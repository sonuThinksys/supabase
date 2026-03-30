import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.card,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.subText,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.subText,
    marginRight: 10,
  },
  statusDotCompleted: {
    backgroundColor: Colors.primary,
  },
  todoTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.card,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: Colors.inputBg,
  },
  statusBadgeCompleted: {
    backgroundColor: '#e6f7f7',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.subText,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 13,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 1000,
  },
  fabText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Members section ──────────────────────────────────────────
  membersSection: {
    backgroundColor: Colors.card,
    marginBottom: 8,
    paddingBottom: 12,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.subText,
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.inputBg,
    borderWidth: 1.5,
    borderColor: Colors.borderColor,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.subText,
  },
  filterChipTextActive: {
    color: Colors.card,
  },
  memberCard: {
    alignItems: 'center',
    marginLeft: 16,
    width: 72,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  memberAvatarText: {
    color: Colors.card,
    fontWeight: '700',
    fontSize: 16,
  },
  memberEmail: {
    fontSize: 11,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  memberRoleBadge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: Colors.inputBg,
  },
  memberRoleText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  memberListContent: {
    paddingRight: 16,
  },
  emptyMembersText: {
    fontSize: 13,
    color: Colors.subText,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  // ── Task card (touchable) ────────────────────────────────────
  cardTouchable: {
    marginBottom: 12,
    borderRadius: 12,
  },
});