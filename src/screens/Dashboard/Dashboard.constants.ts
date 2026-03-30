import { Colors } from '../../theme/colors';

export const DASHBOARD_STRINGS = {
  HEADER_TITLE: 'Dashboard',
  HEADER_BTN: 'My Tasks',
  STAT_TOTAL: 'Total',
  STAT_PENDING: 'Pending',
  STAT_TODO: 'To Do',
  STAT_COMPLETED: 'Completed',
  SECTION_RECENT: 'Recent Tasks',
  STATUS_PENDING: 'Pending',
  STATUS_DONE: 'Done',
  EMPTY_TITLE: 'No tasks yet.',
  EMPTY_SUB: 'Go to My Tasks to create your first task.',
  // Voice modal strings
  VOICE_TITLE: 'Voice Assistant',
  VOICE_HINT: 'Tap the mic and ask about your tasks, projects, or team members.',
  VOICE_LISTENING: 'Listening...',
  VOICE_PROCESSING: 'Processing...',
  VOICE_TAP_SPEAK: 'Tap to speak',
  VOICE_YOU_SAID: 'You said',
  VOICE_STOP: 'Stop',
  VOICE_RESET: 'Reset',
  VOICE_ERROR: 'Something went wrong. Please try again.',
  VOICE_STATS_TITLE: 'Task Overview',
  VOICE_PROJECTS_TITLE: 'Projects',
  VOICE_SEARCH_TITLE: 'Results',
  VOICE_NO_RESULTS: 'No results found.',
  VOICE_MEMBER_PROJECTS: 'Projects for',
  VOICE_ALL_TASKS: 'All tasks',
  VOICE_TAG_CREATED: 'Tag Created',
  VOICE_PROJECT_CREATED: 'Project Created',
};

export const RECENT_TASKS_LIMIT = 5;

export const PRIORITY_DOT_COLOR: Record<'low' | 'medium' | 'high', string> = {
  high: Colors.priorityHigh,
  medium: Colors.priorityMedium,
  low: Colors.priorityLow,
};
