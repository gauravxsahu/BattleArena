/**
 * Lightweight client-side validation helpers (no Zod, no library).
 * These mirror the backend's rules closely enough to give fast feedback,
 * but the backend remains the final source of truth for every field.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,72}$/;

export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function isValidEmail(value) {
  return typeof value === "string" && EMAIL_REGEX.test(value.trim());
}

export function isValidPassword(value) {
  return typeof value === "string" && PASSWORD_REGEX.test(value);
}

export function isValidUrl(value, { required = false } = {}) {
  if (!value) return !required;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isGithubUrl(value) {
  if (!isValidUrl(value, { required: true })) return false;
  return /^https?:\/\/(www\.)?github\.com\//i.test(value);
}

export function minLength(value, min) {
  return typeof value === "string" && value.trim().length >= min;
}

export function maxLength(value, max) {
  return typeof value === "string" && value.trim().length <= max;
}

export const registerValidationRules = {
  name: {
    required: "Name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" },
    maxLength: { value: 100, message: "Name must be under 100 characters" },
  },
  email: {
    required: "Email is required",
    pattern: { value: EMAIL_REGEX, message: "Enter a valid email address" },
  },
  password: {
    required: "Password is required",
    pattern: {
      value: PASSWORD_REGEX,
      message: "8-72 characters, with at least one letter and one number",
    },
  },
};

export const loginValidationRules = {
  email: {
    required: "Email is required",
    pattern: { value: EMAIL_REGEX, message: "Enter a valid email address" },
  },
  password: {
    required: "Password is required",
  },
};

export const submissionValidationRules = {
  githubUrl: {
    required: "GitHub repository URL is required",
    validate: (value) => isGithubUrl(value) || "Must be a valid github.com URL",
  },
  demoUrl: {
    validate: (value) => !value || isValidUrl(value) || "Must be a valid URL",
  },
  description: {
    required: "A short description is required",
    minLength: { value: 10, message: "Description must be at least 10 characters" },
    maxLength: { value: 3000, message: "Description must be under 3000 characters" },
  },
};
