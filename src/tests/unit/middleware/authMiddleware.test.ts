import { webserver } from '@/infra/webserver'
import { middleware } from '@/middleware'
import { NextRequest } from 'next/server'

describe('Middleware Authentication', () => {
  test('should redirect to login if session token is not present', () => {
    // Simula uma requisição sem token de sessão
    const request = new NextRequest(
      new URL(
        `${webserver.host}/api/v1/private/auth/login/credential/two-factor/toggle`,
      ),
      {
        headers: {},
      },
    )
    const response = middleware(request)

    // verify if response is a redirect to login
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(`${webserver.host}/login`)
  })

  test('should allow access if session token is present', () => {
    const request = new NextRequest(
      new URL(
        `${webserver.host}/api/v1/private/auth/login/credential/two-factor/toggle`,
      ),
      {
        headers: {
          cookie: 'authjs.session-token=valid-token',
        },
      },
    )
    const response = middleware(request)

    // Verifies if the response allows to continue to the controller
    expect(response.status).toBe(200)
  })
})
