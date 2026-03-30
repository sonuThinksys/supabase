export const ADD_MEMBER_STRINGS = {
  HEADER_TITLE: 'Add Member',
  SECTION_SELECT_USER: 'Select User',
  SECTION_SELECT_ROLE: 'Select Role',
  PLACEHOLDER_USER: 'Tap to choose a user...',
  SEARCH_PLACEHOLDER: 'Search by email...',
  BUTTON_IDLE: 'Add Member',
  BUTTON_LOADING: 'Adding...',
  MODAL_TITLE: 'Select User',
  MODAL_CLOSE: 'Close',
  ALERT_NO_USER_TITLE: 'User Required',
  ALERT_NO_USER_MSG: 'Please select a user to add.',
  ALERT_SUCCESS_TITLE: 'Member Added',
  ALERT_SUCCESS_MSG: 'The user has been added to the project.',
  ALERT_DUPLICATE_TITLE: 'Already a Member',
  ALERT_DUPLICATE_MSG: 'This user is already a member of the project.',
  ALERT_ERROR_TITLE: 'Error',
  ALERT_ERROR_MSG: 'Failed to add member. Please try again.',
  EMPTY_USERS: 'No users found.',
};

export const ROLE_OPTIONS = [
  { label: 'Member', value: 'member' as const },
  { label: 'Admin', value: 'admin' as const },
  { label: 'Viewer', value: 'viewer' as const },
];
