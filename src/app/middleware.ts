import { NextRequest, NextResponse } from 'next/server'

// Lista de origens permitidas, incluindo strings e expressões regulares.
const allowedOrigins = [
  'https://adm.produtivese.com.br',
  /^https:\/\/produtivese-adm-git-[a-z0-9-]+-livio-alvarenga-s-projects\.vercel\.app$/,
]

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')

  // Verifica se a origem da solicitação corresponde a qualquer uma das origens permitidas.
  if (
    origin &&
    allowedOrigins.some((allowedOrigin) =>
      typeof allowedOrigin === 'string'
        ? allowedOrigin === origin
        : allowedOrigin.test(origin),
    )
  ) {
    const response = NextResponse.next()

    // Define o cabeçalho CORS dinamicamente com a origem da solicitação.
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    )

    return response
  }

  return new NextResponse('Not allowed by CORS', { status: 403 }) // Bloqueia a solicitação se a origem não for permitida.
}

// Aplica o middleware a todas as rotas que correspondem ao padrão /api/:path*.
export const config = {
  matcher: '/api/:path*',
}
