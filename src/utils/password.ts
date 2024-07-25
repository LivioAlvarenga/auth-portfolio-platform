/**
 * Generates a random password that meets the specified criteria:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one symbol
 *
 * @param {number} length - The desired length of the password. If less than 8, it defaults to 8.
 * @returns {string} - The generated password.
 */
export const generatePassword = (length: number): string => {
  const minLength = 8
  const passwordLength = length < minLength ? minLength : length

  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const allChars = upperCase + lowerCase + numbers + symbols

  let password = ''

  password += upperCase[Math.floor(Math.random() * upperCase.length)]
  password += lowerCase[Math.floor(Math.random() * lowerCase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  for (let i = password.length; i < passwordLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle the password to ensure randomness
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
}

// Example usage
// import { generatePassword } from './utils';
// const password = generatePassword(12);
// console.log(password);
