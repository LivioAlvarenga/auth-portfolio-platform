/**
 * Fields considered for calculating the profile completion score.
 * Each field in this array represents a column in the `users` table that contributes to the `profile_completion_score`.
 * The score starts from the total number of fields and decreases as each field is filled.
 */
export const PROFILE_COMPLETION_FIELDS = [
  'password_hash',
  'image',
  'email_verified_provider',
  'emailVerified',
  'email',
  'nick_name',
  'name',
]

/**
 * Calculates the profile completion score based on the fields defined in PROFILE_COMPLETION_FIELDS.
 * The score starts from the total number of fields and decreases as each field is filled.
 *
 * @param userData - The user data object that contains the fields to be checked.
 * @returns The profile completion score as an integer. A lower score indicates more fields are filled.
 */
export function calculateProfileCompletionScore(
  userData: Record<string, any>,
): number {
  // Start with the maximum possible score, which is the total number of fields
  const totalFields = PROFILE_COMPLETION_FIELDS.length

  // Count how many fields are filled
  const filledFieldsCount = PROFILE_COMPLETION_FIELDS.reduce((count, field) => {
    return count + (userData[field] ? 1 : 0)
  }, 0)

  // The profile completion score is the total fields minus the filled fields
  return totalFields - filledFieldsCount
}

/**
 * Generates a message encouraging the user to complete their profile to improve their experience.
 *
 * @param score - The current profile completion score (the number of unfilled fields).
 *                If `score` is `null` or `undefined`, it is assumed that 100% of the profile is incomplete.
 * @returns A string message encouraging the user to complete the missing percentage of their profile.
 */
export function getProfileCompletionMessage(
  score: number | null | undefined,
): string {
  const totalFields = PROFILE_COMPLETION_FIELDS.length

  if (score === null || score === undefined) {
    return 'Melhore sua experiência completando os 100% que faltam do seu perfil.'
  }

  const validScore = typeof score === 'number' ? score : 0

  const completionPercentage = Math.round(
    ((totalFields - validScore) / totalFields) * 100,
  )

  return `Melhore sua experiência completando os ${100 - completionPercentage}% que faltam do seu perfil.`
}
