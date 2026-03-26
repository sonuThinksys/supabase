export const CREATE_TASK_STRINGS = {
  HEADER_TITLE: 'Create Task',
  PLACEHOLDER_TITLE: 'Task title',
  PLACEHOLDER_SUBTASK: 'Add subtask',
  LABEL_PROJECT: 'Select Project',
  LABEL_PRIORITY: 'Priority',
  LABEL_SUBTASKS: 'Subtasks',
  LABEL_TAGS: 'Tags',
  BTN_CREATE: 'Create Task',
  BTN_CREATING: 'Creating...',
  BTN_ADD: '+',
  ERROR_TITLE: 'Error',
  ERROR_FILL_FIELDS: 'Please fill in title, project and at least one tag.',
  ERROR_CREATE_FAILED: 'Failed to create task. Please try again.',
};

export const PRIORITIES = ['low', 'medium', 'high'] as const;
export type Priority = typeof PRIORITIES[number];
