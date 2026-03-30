export const VOICE_STRINGS = {
  HEADER_TITLE: 'AI Voice Assistant',

  // Mic states
  HINT_TAP_TO_SPEAK: 'Tap the mic to ask a question',
  HINT_LISTENING: 'Listening… speak now',
  HINT_PROCESSING: 'Thinking…',
  HINT_AUTO_STOPPED: 'Detected silence — processing…',

  // Labels
  LABEL_AI_RESPONSE: 'Assistant',
  LABEL_YOU_SAID: 'You asked:',
  LABEL_TASK_STATS: 'Task Overview',
  LABEL_PROJECTS: 'Projects & Members',
  LABEL_SEARCH_RESULTS: 'Search Results',
  LABEL_MEMBERS: 'Members',
  LABEL_TASKS: 'tasks',
  LABEL_NO_RESULTS: 'No tasks found matching your search.',
  LABEL_MEMBER_PROJECTS: 'Projects assigned to',
  LABEL_NO_PROJECTS: 'No projects found for this member.',
  LABEL_FOR: 'for',
  LABEL_ALL_TASKS: 'All Tasks',
  LABEL_NO_MEMBER_TASKS: 'No tasks found for this member.',
  LABEL_TOTAL: 'Total',
  LABEL_PENDING: 'Pending',
  LABEL_COMPLETED: 'Completed',

  // Inputs / Buttons
  PLACEHOLDER_TEXT: 'Or type your question here…',
  PLACEHOLDER_RESPONSE: 'Ask about tasks, projects, or team members.',
  BTN_SEND: 'Send',
  BTN_RESET: 'Reset',
  BTN_STOP_SPEAKING: 'Stop',

  // Errors
  ERROR_VOICE: 'Voice recognition is unavailable. Please type your question.',
  ERROR_API: 'Failed to get a response. Please check your connection and try again.',

  // Example questions shown when idle
  EXAMPLE_QUESTIONS: [
    'How many tasks are pending?',
    'How many tasks are completed?',
    'Who are the project members?',
    'Which projects are assigned to which members?',
    'Find all pending tasks',
    'Search tasks about login',
    'Which projects are assigned to testing?',
    'What projects does john have?',
    'What tasks are pending for testing?',
    'Show completed tasks of john',
  ] as string[],
};
