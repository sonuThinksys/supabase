import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

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
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
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
    fontSize: 12,
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
});
