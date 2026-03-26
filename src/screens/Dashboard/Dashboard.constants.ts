import { Colors } from '../../theme/colors';

export const DASHBOARD_STRINGS = {
  HEADER_TITLE: 'Dashboard',
  HEADER_BTN: 'My Tasks',
  STAT_TOTAL: 'Total',
  STAT_PENDING: 'Pending',
  STAT_COMPLETED: 'Completed',
  SECTION_RECENT: 'Recent Tasks',
  STATUS_PENDING: 'Pending',
  STATUS_DONE: 'Done',
  EMPTY_TITLE: 'No tasks yet.',
  EMPTY_SUB: 'Go to My Tasks to create your first task.',
};

export const RECENT_TASKS_LIMIT = 5;

export const PRIORITY_DOT_COLOR: Record<'low' | 'medium' | 'high', string> = {
  high: Colors.priorityHigh,
  medium: Colors.priorityMedium,
  low: Colors.priorityLow,
};
