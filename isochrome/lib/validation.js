/**
 * Validation utilities for contact form data
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Title case a string
 */
function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Validate and clean form data
 * @param {Object} data - { name, email }
 * @returns {Object} { isValid: boolean, data?: cleaned data, error?: error message }
 */
export function validateAndCleanData(data) {
  const { name, email } = data;

  // Validate name
  if (!name || typeof name !== "string") {
    return { isValid: false, error: "Name is required" };
  }

  const cleanedName = name.trim();
  if (cleanedName.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }

  if (cleanedName.length > 100) {
    return { isValid: false, error: "Name must be less than 100 characters" };
  }

  // Validate email
  if (!email || typeof email !== "string") {
    return { isValid: false, error: "Email is required" };
  }

  const cleanedEmail = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(cleanedEmail)) {
    return { isValid: false, error: "Invalid email format" };
  }

  if (cleanedEmail.length > 254) {
    return { isValid: false, error: "Email is too long" };
  }

  // Return cleaned data
  return {
    isValid: true,
    data: {
      name: titleCase(cleanedName),
      email: cleanedEmail,
    },
  };
}

/**
 * Validate email format only
 */
export function isValidEmail(email) {
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .substring(0, 500); // Limit length
}
