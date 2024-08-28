import { capitalizeEachWord } from '@/utils/textUtils'
import { Button, Heading, Section, Text } from '@react-email/components'
import { renderEmailComponent } from '..'
import { LayoutEmail } from '../components/LayoutEmail'

export interface PasswordResetRequestProps {
  url: string
  name: string | null
}

export function PasswordResetRequest({ url, name }: PasswordResetRequestProps) {
  const previewText = 'Recupere sua senha - Produtivese'

  const helloText = name ? `Olá ${capitalizeEachWord(name)},` : 'Olá,'

  return (
    <LayoutEmail previewText={previewText}>
      <Section className="mt-[20px] px-5">
        <Heading className="mx-0 my-[10px] p-0 text-left text-[16px] font-bold text-black">
          {helloText}
        </Heading>

        <Text className="text-[14px] leading-[24px] text-black">
          Recebemos uma solicitação para redefinir a senha da sua conta. Para
          iniciar o processo de redefinição, clique no botão ou no link abaixo:
        </Text>

        <Section className="mb-[32px] mt-[32px] text-center">
          <Button
            className="rounded bg-[#0866FF] px-5 py-3 text-center text-sm font-medium text-white no-underline"
            href={url}
          >
            Clique aqui para criar uma nova senha
          </Button>
        </Section>

        <Text className="text-[14px] leading-[24px] text-black">
          Se o botão não funcionar, copie e cole o seguinte link no seu
          navegador:
        </Text>

        <Text className="text-[14px] leading-[24px] text-black">{url}</Text>

        <Text className="text-[14px] leading-[24px] text-black">
          Se você não solicitou a redefinição de senha, por favor, ignore este
          e-mail. Sua senha permanecerá a mesma e não haverá alterações em sua
          conta.
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

export function PasswordResetRequestText({
  url,
  name,
}: PasswordResetRequestProps): string {
  const previewText = 'Recupere sua senha - Produtivese'

  const helloText = name ? `Olá ${capitalizeEachWord(name)},` : 'Olá,'

  return `
${previewText}

${helloText}

Recebemos uma solicitação para redefinir a senha da sua conta. Para iniciar o processo de redefinição, copie e cole o seguinte link no seu navegador:

${url}

Se você não solicitou a redefinição de senha, por favor, ignore este e-mail. Sua senha permanecerá a mesma e não haverá alterações em sua conta.

O link é válido por 24 horas e não deve ser compartilhado.

Este é um e-mail automático, não responda.

Atenciosamente,
Equipe Produtivese
`
}

export const PasswordResetRequestTemplate = {
  subject: 'Redefinição de Senha - Produtivese',
  render: async (data: PasswordResetRequestProps) => ({
    html: await renderEmailComponent(PasswordResetRequest(data)),
    text: PasswordResetRequestText(data),
  }),
}
