export const MY_TASKS_STRINGS = {
  HEADER_TITLE: 'My Tasks',
  FILTER_ALL: 'All',
  FILTER_PENDING: 'Pending',
  FILTER_COMPLETED: 'Completed',
  FAB_ICON: '+',
  EMPTY: 'No tasks found.',
};

export const FILTERS = ['all', 'pending', 'completed'] as const;
export type FilterType = typeof FILTERS[number];
