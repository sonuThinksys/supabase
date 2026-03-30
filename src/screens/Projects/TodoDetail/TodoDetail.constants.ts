import { Colors } from '../../../theme/colors';

export const TODO_DETAIL_STRINGS = {
  ERROR_LOAD: 'Failed to load subtasks. Please try again.',
  RETRY: 'Retry',
  SECTION_SUBTASKS: 'SUBTASKS',
  EMPTY_SUBTASKS: 'No subtasks for this tasks.',
  STATUS_COMPLETED: 'Completed',
  STATUS_PENDING: 'Pending',
};

export const PRIORITY_COLOR: Record<'low' | 'medium' | 'high', string> = {
  high: Colors.priorityHigh,
  medium: Colors.priorityMedium,
  low: Colors.priorityLow,
};
