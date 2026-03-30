export const CREATE_TASK_STRINGS = {
  HEADER_TITLE: 'Create Task',
  PLACEHOLDER_TITLE: 'Task title',
  PLACEHOLDER_SUBTASK: 'Add subtask',
  LABEL_PROJECT: 'Project *',
  LABEL_PRIORITY: 'Priority *',
  LABEL_SUBTASKS: 'Subtasks',
  LABEL_TAGS: 'Tags *',
  BTN_CREATE: 'Create Task',
  BTN_CREATING: 'Creating...',
  BTN_ADD: '+',
  ERROR_TITLE: 'Error',
  ERROR_FILL_FIELDS: 'Please fill all required fields.',
  ERROR_CREATE_FAILED: 'Failed to create task. Please try again.',

  // Inline validation messages
  VALIDATION_TITLE: 'Task title is required.',
  VALIDATION_PROJECT: 'Please select a project.',
  VALIDATION_PRIORITY: 'Please select a priority.',
  VALIDATION_TAGS: 'Please select at least one tag.',
};

export const PRIORITIES = ['low', 'medium', 'high'] as const;
export type Priority = typeof PRIORITIES[number];
