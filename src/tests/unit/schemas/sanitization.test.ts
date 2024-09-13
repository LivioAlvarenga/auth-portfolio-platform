import {
  emailValidation,
  fullNameValidation,
  ipValidation,
  nickNameValidation,
  passwordValidation,
  tokenValidation,
} from '@/schemas'
import { generateOTP } from '@/utils/password'
import { v4 as uuidv4 } from 'uuid'

describe('Email Sanitization', () => {
  test('should fail when email is less than 3 characters', () => {
    const email = 'az'

    const result = emailValidation.safeParse(email)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain('Informe o e-mail para continuar.')
  })

  test('should return error for email too long', async () => {
    const email = 'a'.repeat(255) + '@example.com'

    const result = emailValidation.safeParse(email)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain('O e-mail é muito longo.')
  })

  test('should return error for invalid email format', async () => {
    const email = 'invalid-email'

    const result = emailValidation.safeParse(email)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain('E-mail inválido!')
  })
})

describe('Password Sanitization', () => {
  test('should return error for password too short', async () => {
    const password = 'Short1!'

    const result = passwordValidation.safeParse(password)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain('A senha deve ter pelo menos 8 caracteres.')
  })

  test('should return error for password without uppercase letter', async () => {
    const password = 'lowercase1!'

    const result = passwordValidation.safeParse(password)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain(
      'A senha deve conter pelo menos uma letra maiúscula.',
    )
  })

  test('should return error for password without lowercase letter', async () => {
    const password = 'UPPERCASE1!'

    const result = passwordValidation.safeParse(password)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain(
      'A senha deve conter pelo menos uma letra minúscula.',
    )
  })

  test('should return error for password without number', async () => {
    const password = 'NoNumber!'

    const result = passwordValidation.safeParse(password)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain('A senha deve conter pelo menos um número.')
  })

  test('should return error for password without symbol', async () => {
    const password = 'NoSymbol1'

    const result = passwordValidation.safeParse(password)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain('A senha deve conter pelo menos um símbolo.')
  })

  test('should return error for password too long', async () => {
    const password = 'Aa'.repeat(101) + '1!'

    const result = passwordValidation.safeParse(password)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain('A senha é muito longa.')
  })
})

describe('Full Name Sanitization', () => {
  test('should return error for name too short', async () => {
    const name = 'A'

    const result = fullNameValidation.safeParse(name)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain('Informe o nome completo para continuar.')
  })

  test('should return error for name too long', async () => {
    const name = 'A'.repeat(151)

    const result = fullNameValidation.safeParse(name)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain('O nome completo é muito longo.')
  })

  test('should return error for name with invalid characters', async () => {
    const name = 'John123'

    const result = fullNameValidation.safeParse(name)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain('Deve conter apenas letras.')
  })
})

describe('Nickname Sanitization', () => {
  test('should return error for nickname too long', async () => {
    const nickName = 'A'.repeat(151)

    const result = nickNameValidation.safeParse(nickName)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain('O apelido é muito longo.')
  })

  test('should return error for nickname with invalid characters', async () => {
    const nickName = 'John123'
    const result = nickNameValidation.safeParse(nickName)

    const issues = result?.error?.issues[0].message

    expect(result.success).toBe(false)
    expect(issues).toContain('Deve conter apenas letras.')
  })
})

describe('Token Validation', () => {
  test('should validate a valid OTP', async () => {
    const otp = generateOTP()
    const result = tokenValidation.safeParse(otp)

    expect(result.success).toBe(true)
  })

  test('should validate a valid UUID', async () => {
    const uuid = uuidv4()
    const result = tokenValidation.safeParse(uuid)

    expect(result.success).toBe(true)
  })

  test('should return error for an invalid token', async () => {
    const invalidToken = 'invalid-token'
    const result = tokenValidation.safeParse(invalidToken)

    const issues = result?.error?.issues?.[0]?.message

    expect(result.success).toBe(false)
    expect(issues).toContain(
      'Token deve ser um UUID válido ou um código OTP de 6 dígitos',
    )
  })
})

describe('IP Validation', () => {
  test('should validate a valid IPv4 address', async () => {
    const ipv4 = '192.168.0.1'
    const result = ipValidation.safeParse(ipv4)

    expect(result.success).toBe(true)
  })

  test('should validate a valid IPv6 address', async () => {
    const ipv6 = '::1'
    const result = ipValidation.safeParse(ipv6)

    expect(result.success).toBe(true)
  })

  test('should return error for an invalid IP address', async () => {
    const invalidIp = '999.999.999.999'
    const result = ipValidation.safeParse(invalidIp)

    const issues = result?.error?.issues?.[0]?.message

    expect(result.success).toBe(false)
    expect(issues).toContain('O endereço IP deve ser um IPv4 ou IPv6 válido')
  })

  test('should return error for a malformed IP address', async () => {
    const malformedIp = 'abc.def.ghi.jkl'
    const result = ipValidation.safeParse(malformedIp)

    const issues = result?.error?.issues?.[0]?.message

    expect(result.success).toBe(false)
    expect(issues).toContain('O endereço IP deve ser um IPv4 ou IPv6 válido')
  })
})
