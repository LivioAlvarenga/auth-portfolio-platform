import { CreateUser } from '@/@types/user'
import { orchestrator } from '@/tests/orchestrator'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
})

describe('Email Sanitization', () => {
  test('should return error for email too short', async () => {
    const newUser: CreateUser = {
      email: 'az',
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe('Informe o e-mail para continuar.')
  })

  test('should return error for email too long', async () => {
    const newUser: CreateUser = {
      email: 'a'.repeat(255) + '@example.com',
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe('O e-mail é muito longo.')
  })

  test('should return error for invalid email format', async () => {
    const newUser: CreateUser = {
      email: 'invalid-email',
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe('E-mail inválido!')
  })
})

describe('Password Sanitization', () => {
  test('should return error for password too short', async () => {
    const newUser: CreateUser = {
      email: 'valid.email@example.com',
      password: 'Short1!',
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe(
      'A senha deve ter pelo menos 8 caracteres.',
    )
  })

  test('should return error for password without uppercase letter', async () => {
    const newUser: CreateUser = {
      email: 'valid.email@example.com',
      password: 'lowercase1!',
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe(
      'A senha deve conter pelo menos uma letra maiúscula.',
    )
  })

  test('should return error for password without lowercase letter', async () => {
    const newUser: CreateUser = {
      email: 'valid.email@example.com',
      password: 'UPPERCASE1!',
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe(
      'A senha deve conter pelo menos uma letra minúscula.',
    )
  })

  test('should return error for password without number', async () => {
    const newUser: CreateUser = {
      email: 'valid.email@example.com',
      password: 'NoNumber!',
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe(
      'A senha deve conter pelo menos um número.',
    )
  })

  test('should return error for password without symbol', async () => {
    const newUser: CreateUser = {
      email: 'valid.email@example.com',
      password: 'NoSymbol1',
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe(
      'A senha deve conter pelo menos um símbolo.',
    )
  })

  test('should return error for password too long', async () => {
    const newUser: CreateUser = {
      email: 'valid.email@example.com',
      password: 'Aa'.repeat(101) + '1!',
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe('A senha é muito longa.')
  })
})

describe('Full Name Sanitization', () => {
  test('should return error for name too short', async () => {
    const newUser: CreateUser = {
      email: 'valid.email@example.com',
      name: 'A',
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe('Informe o nome completo para continuar.')
  })

  test('should return error for name too long', async () => {
    const newUser: CreateUser = {
      email: 'valid.email@example.com',
      name: 'A'.repeat(151),
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe('O nome completo é muito longo.')
  })

  test('should return error for name with invalid characters', async () => {
    const newUser: CreateUser = {
      email: 'valid.email@example.com',
      name: 'John123',
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe('Deve conter apenas letras.')
  })
})

describe('Nickname Sanitization', () => {
  test('should return error for nickname too long', async () => {
    const newUser: CreateUser = {
      email: 'valid.email@example.com',
      nick_name: 'A'.repeat(151),
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe('O apelido é muito longo.')
  })

  test('should return error for nickname with invalid characters', async () => {
    const newUser: CreateUser = {
      email: 'valid.email@example.com',
      nick_name: 'John123',
    }

    const response = await fetch('http://localhost:3000/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.message).toBe('Deve conter apenas letras.')
  })
})
