import { Button, Heading, Section, Text } from '@react-email/components'
import { renderEmailComponent } from '..'
import { LayoutEmail } from '../components/LayoutEmail'

export interface LoginMagicLinkProps {
  url: string
}

export function LoginMagicLink({ url }: LoginMagicLinkProps) {
  const previewText =
    'Clique no link para acessar sua conta. Não compartilhe este e-mail.'

  return (
    <LayoutEmail previewText={previewText}>
      <Section className="mt-[20px] px-5">
        <Heading className="mx-0 my-[10px] p-0 text-left text-[16px] font-bold text-black">
          Acesso à sua Conta - Produtivese
        </Heading>

        <Text className="text-[14px] leading-[24px] text-black">
          Você solicitou um link de acesso à sua conta. Para fazer login, clique
          no botão abaixo:
        </Text>

        <Section className="mb-[32px] mt-[32px] text-center">
          <Button
            className="rounded bg-[#0866FF] px-5 py-3 text-center text-sm font-medium text-white no-underline"
            href={url}
          >
            Acessar Minha Conta
          </Button>
        </Section>

        <Text className="text-[14px] leading-[24px] text-black">
          Se o botão não funcionar, copie e cole o seguinte link no seu
          navegador:
        </Text>

        <Text className="text-[14px] leading-[24px] text-black">{url}</Text>

        <Text className="text-[14px] leading-[24px] text-black">
          Se você não solicitou este link, por favor, ignore este e-mail.
          Nenhuma ação adicional é necessária.
        </Text>

        <Text className="text-[14px] leading-[24px] text-black">
          O link é válido por <strong>24 horas</strong> e não deve ser
          compartilhado.
        </Text>

        <Text className="text-[14px] leading-[24px] text-black">
          Este é um e-mail automático, não responda.
        </Text>

        <Text className="mt-10 text-[14px] leading-[24px] text-black">
          Atenciosamente,
        </Text>
        <Text className="mt-0 text-[14px] font-bold leading-[24px] text-primary-950">
          Equipe Produtivese
        </Text>
      </Section>
    </LayoutEmail>
  )
}

export function LoginMagicLinkText({ url }: LoginMagicLinkProps): string {
  const previewText =
    'Clique no link para acessar sua conta. Não compartilhe este e-mail.'

  return `
${previewText}

Acesso à sua Conta - Produtivese

Você solicitou um link de acesso à sua conta. Para fazer login, copie e cole o seguinte link no seu navegador:

${url}

Se você não solicitou este link, por favor, ignore este e-mail. Nenhuma ação adicional é necessária.

O link é válido por 24 horas e não deve ser compartilhado.

Este é um e-mail automático, não responda.

Atenciosamente,
Equipe Produtivese
`
}

export const LoginMagicLinkTemplate = {
  subject: 'Seu Link de Acesso à Conta - Produtivese',
  render: (data: LoginMagicLinkProps) => ({
    html: renderEmailComponent(LoginMagicLink(data)),
    text: LoginMagicLinkText(data),
  }),
}
