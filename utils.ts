import type { PasswordStrength } from './types';

export const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  if (!password) {
    return { score: 0, label: '' };
  }

  // Award points for different criteria
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++; // Mixed case
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++; // Special characters

  switch (score) {
    case 0:
    case 1:
      return { score, label: 'Weak' };
    case 2:
      return { score, label: 'Medium' };
    case 3:
      return { score, label: 'Strong' };
    case 4:
      return { score, label: 'Very Strong' };
    default:
      return { score: 0, label: '' };
  }
};
