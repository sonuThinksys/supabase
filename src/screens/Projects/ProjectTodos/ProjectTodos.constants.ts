import { Colors } from '../../../theme/colors';

export const PROJECT_TODOS_STRINGS = {
  ERROR_LOAD: 'Failed to load todos. Please try again.',
  RETRY: 'Retry',
  EMPTY: 'No todos found for this project.',
  STATUS_COMPLETED: 'Completed',
  STATUS_PENDING: 'Pending',
};

export const PRIORITY_COLOR: Record<'low' | 'medium' | 'high', string> = {
  high: Colors.priorityHigh,
  medium: Colors.priorityMedium,
  low: Colors.priorityLow,
};