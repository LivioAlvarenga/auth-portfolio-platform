import { VerificationTokenRepository } from '@/repositories/verification-token-repository'

interface GetRequestMagicLinkUseCaseRequest {
  tokenId: string
}

interface GetRequestMagicLinkUseCaseResponse {
  status: number
  message: string
  token?: {
    identifier: string
    token: string
    token_type?: string
    expires: Date
  }
}

export class GetRequestMagicLinkUseCase {
  constructor(
    private verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async execute({
    tokenId,
  }: GetRequestMagicLinkUseCaseRequest): Promise<GetRequestMagicLinkUseCaseResponse> {
    // 1. useCase - check if token exists
    const token =
      await this.verificationTokenRepository.getValidTokenByToken(tokenId)

    if (!token) {
      return {
        status: 404,
        message: 'Token não encontrado.',
      }
    }

    return {
      status: 201,
      message: 'Token encontrado.',
      token: {
        identifier: token.identifier,
        token: token.token,
        token_type: token.token_type,
        expires: token.expires,
      },
    }
  }
}
