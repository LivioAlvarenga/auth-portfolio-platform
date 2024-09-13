import { z } from 'zod'

export const emailValidation = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, { message: 'Informe o e-mail para continuar.' })
  .max(254, 'O e-mail é muito longo.')
  .email({ message: 'E-mail inválido!' })

export const passwordValidation = z
  .string()
  .min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  .regex(/[A-Z]/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula.',
  })
  .regex(/[a-z]/, {
    message: 'A senha deve conter pelo menos uma letra minúscula.',
  })
  .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número.' })
  .regex(/[^A-Za-z0-9]/, {
    message: 'A senha deve conter pelo menos um símbolo.',
  })
  .max(100, { message: 'A senha é muito longa.' })

export const fullNameValidation = z
  .string()
  .trim()
  .min(2, {
    message: 'Informe o nome completo para continuar.',
  })
  .max(150, 'O nome completo é muito longo.')
  .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'Deve conter apenas letras.')
  .toLowerCase()

export const nickNameValidation = z
  .string()
  .trim()
  .max(150, 'O apelido é muito longo.')
  .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'Deve conter apenas letras.')
  .toLowerCase()
  .optional()

export const tokenValidation = z.string().refine(
  (value) => {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
        value,
      )
    const isOPT = /^\d{6}$/.test(value)
    return isUUID || isOPT
  },
  {
    message: 'Token deve ser um UUID válido ou um código OTP de 6 dígitos',
  },
)

export const ipValidation = z.string().refine(
  (value) => {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

    const ipv6Regex =
      /^((?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7}|::)$/

    // Check if the value matches IPv4 or IPv6 regex
    const isIPv4 = ipv4Regex.test(value)
    const isIPv6 = ipv6Regex.test(value)

    return isIPv4 || isIPv6
  },
  {
    message: 'O endereço IP deve ser um IPv4 ou IPv6 válido',
  },
)
