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
