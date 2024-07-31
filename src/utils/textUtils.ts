import { prepositions } from '@/schemas/textValidations'

export function transformTextIntoCapitalized(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function transformTextIntoCapitalizedWords(str: string) {
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

export function capitalizeEachWord(str: string | null | undefined) {
  if (!str) {
    return ''
  }
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
