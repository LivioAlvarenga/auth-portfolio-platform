import { prepositions } from '@/schemas/textValidations'

/**
 * Transforma uma string, capitalizando a primeira letra e convertendo o restante para minúsculas.
 * Se a string de entrada estiver vazia ou indefinida, retorna uma string vazia.
 *
 * @param str - A string de entrada.
 * @returns A string de entrada com a primeira letra capitalizada e o restante em minúsculas,
 *          ou uma string vazia se a entrada for vazia ou indefinida.
 */
export function transformTextIntoCapitalized(
  str: string | null | undefined,
): string {
  if (!str) {
    return ''
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Transforms a string by capitalizing each word, except for prepositions.
 * If the string is `null`, `undefined`, or empty, it returns an empty string.
 *
 * @param str - The input string.
 * @returns The input string with each word capitalized, except for prepositions, or an empty string if the input is `null`, `undefined`, or empty.
 */
export function transformTextIntoCapitalizedWords(
  str: string | null | undefined,
) {
  if (!str) {
    return ''
  }

  // capitalize every word except prepositions
  const words = str.split(' ')
  const capitalizedWords = words.map((word) => {
    if (prepositions.includes(word)) {
      return word
    }
    return transformTextIntoCapitalized(word)
  })
  return capitalizedWords.join(' ')
}

/**
 * Capitalizes the first letter of each word in the provided string.
 * If the string is `null`, `undefined`, or empty, it returns an empty string.
 *
 * @param {string | null | undefined} str - The input string.
 * @returns {string} The input string with each word capitalized, or an empty string if the input is `null`, `undefined`, or empty.
 */
export function capitalizeEachWord(str: string | null | undefined): string {
  if (!str) {
    return ''
  }
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Returns the initials of the first and last name.
 * If the name contains only one word, it returns the first two letters of that word.
 * If the name is an empty string, `null`, or `undefined`, it returns an empty string.
 *
 * @param {string | null | undefined} name - The full name of the user.
 * @returns {string} The initials of the first and last name, or the first two letters of the single name, or an empty string.
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) {
    return ''
  }

  const nameParts = name.trim().split(' ')

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase()
  }

  const firstInitial = nameParts[0].charAt(0).toUpperCase()
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase()

  return `${firstInitial}${lastInitial}`
}
