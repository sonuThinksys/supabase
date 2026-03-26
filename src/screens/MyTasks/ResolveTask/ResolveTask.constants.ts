import { Colors } from '../../../theme/colors';

export const RESOLVE_TASK_STRINGS = {
  TITLE: 'Resolve Task',
  LABEL_PRIORITY: 'Priority',
  LABEL_STATUS: 'Status',
  LABEL_CREATED: 'Created',
  LABEL_NOTE: 'Completion Note (optional)',
  NOTE_PLACEHOLDER: 'Add a note about this task...',
  BUTTON_RESOLVE: 'Mark as Completed',
  BUTTON_RESOLVING: 'Resolving...',
  BUTTON_CANCEL: 'Cancel',
  STATUS_PENDING: 'Pending',
  STATUS_COMPLETED: 'Completed',
  ALERT_ERROR_TITLE: 'Error',
  ALERT_ERROR_MSG: 'Failed to resolve task. Please try again.',
};

export const PRIORITY_LABEL: Record<'low' | 'medium' | 'high', string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const PRIORITY_COLOR: Record<'low' | 'medium' | 'high', string> = {
  high: Colors.priorityHigh,
  medium: Colors.priorityMedium,
  low: Colors.priorityLow,
};