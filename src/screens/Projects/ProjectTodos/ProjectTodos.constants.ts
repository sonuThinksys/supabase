import { Colors } from '../../../theme/colors';
import { MemberRole } from '../../../services/taskService';

export const PROJECT_TODOS_STRINGS = {
  ERROR_LOAD: 'Failed to load todos. Please try again.',
  RETRY: 'Retry',
  EMPTY: 'No todos found for this project.',
  STATUS_COMPLETED: 'Completed',
  STATUS_PENDING: 'Pending',
  FAB_MEMBERS: '+ Members',
  SECTION_MEMBERS: 'MEMBERS',
  EMPTY_MEMBERS: 'No members yet.',
};

export const PRIORITY_COLOR: Record<'low' | 'medium' | 'high', string> = {
  high: Colors.priorityHigh,
  medium: Colors.priorityMedium,
  low: Colors.priorityLow,
};

export type RoleFilter = 'all' | MemberRole;

export const ROLE_FILTERS: { label: string; value: RoleFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
  { label: 'Viewer', value: 'viewer' },
];