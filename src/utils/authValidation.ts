const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const VALIDATION_MESSAGES = {
  EMPTY: 'Please enter your email and password.',
  EMPTY_NAME: 'Please enter your full name.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
};

export const AUTH_COMMON_STRINGS = {
  ALERT_VALIDATION_TITLE: 'Validation Error',
  ALERT_ERROR_FALLBACK: 'Something went wrong.',
};

export const validateAuthForm = (email: string, password: string): string | null => {
  if (!email.trim() || !password) return VALIDATION_MESSAGES.EMPTY;
  if (!EMAIL_REGEX.test(email.trim())) return VALIDATION_MESSAGES.INVALID_EMAIL;
  if (password.length < MIN_PASSWORD_LENGTH) return VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;
  return null;
};

export const validateSignUpForm = (name: string, email: string, password: string): string | null => {
  if (!name.trim()) return VALIDATION_MESSAGES.EMPTY_NAME;
  return validateAuthForm(email, password);
};