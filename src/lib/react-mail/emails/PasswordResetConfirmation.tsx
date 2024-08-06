import { Heading, Section, Text } from '@react-email/components'
import { renderEmailComponent } from '..'
import { LayoutEmail } from '../components/LayoutEmail'

export interface PasswordResetConfirmationProps {}

export function PasswordResetConfirmation() {
  const previewText = 'Sua senha foi redefinida com sucesso - Produtivese'

  return (
    <LayoutEmail previewText={previewText}>
      <Section className="mt-[20px] px-5">
        <Heading className="mx-0 my-[10px] p-0 text-left text-[16px] font-bold text-black">
          Olá,
        </Heading>

        <Text className="text-[14px] leading-[24px] text-black">
          Estamos escrevendo para informar que sua senha foi redefinida com
          sucesso. Se você solicitou essa alteração, nenhuma ação adicional é
          necessária.
        </Text>

        <Text className="text-[14px] leading-[24px] text-black">
          Se você não solicitou essa alteração, por favor entre em contato com
          nossa equipe de suporte imediatamente para garantir a segurança da sua
          conta.
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

export function PasswordResetConfirmationText(): string {
  const previewText = 'Sua senha foi redefinida com sucesso - Produtivese'

  return `
${previewText}

Olá,

Estamos escrevendo para informar que sua senha foi redefinida com sucesso. Se você solicitou essa alteração, nenhuma ação adicional é necessária.

Se você não solicitou essa alteração, por favor entre em contato com nossa equipe de suporte imediatamente para garantir a segurança da sua conta.

Este é um e-mail automático, não responda.

Atenciosamente,
Equipe Produtivese
`
}

export const PasswordResetConfirmationTemplate = {
  subject: 'Confirmação de Redefinição de Senha - Produtivese',
  render: () => ({
    html: renderEmailComponent(PasswordResetConfirmation()),
    text: PasswordResetConfirmationText(),
  }),
}
