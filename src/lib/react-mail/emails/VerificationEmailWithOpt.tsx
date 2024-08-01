import { Button, Heading, Section, Text } from '@react-email/components'
import { renderEmailComponent } from '..'
import { LayoutEmail } from '../components/LayoutEmail'

export interface VerificationEmailWithOptProps {
  opt: string
  url: string
}

export function VerificationEmailWithOpt({
  opt,
  url,
}: VerificationEmailWithOptProps) {
  const previewText = 'Confirme sua conta - Código de Verificação'

  return (
    <LayoutEmail previewText={previewText}>
      <Section className="mt-[20px] px-5">
        <Heading className="mx-0 my-[10px] p-0 text-center text-[22px] font-bold leading-[28px] tracking-normal text-black">
          Seu código de verificação
        </Heading>

        <Text className="mt-8 text-center text-[18px] leading-[24px] tracking-[0.15px] text-black">
          Para concluir a verificação da sua conta, insira este código no site
          adm.produtivese.com.br:
        </Text>

        <Text className="my-7 text-center text-[57px] leading-[64px] -tracking-[0.25px] text-black">
          <strong>{opt}</strong>
        </Text>

        <Section className="mb-[32px] mt-[32px] text-center">
          <Button
            className="rounded bg-[#0866FF] px-5 py-3 text-center text-sm font-medium text-white no-underline"
            href={url}
          >
            Clique aqui para validar seu e-mail
          </Button>
        </Section>

        <Text className="text-[14px] leading-[24px] text-black">
          Caso você não tenha solicitado esse código, simplesmente ignore esta
          mensagem.
        </Text>

        <Text className="text-[14px] leading-[24px] text-black">
          O código é válido por <strong>24 horas</strong> e não deve ser
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

export function VerificationEmailWithOptText({
  opt,
  url,
}: VerificationEmailWithOptProps): string {
  const previewText = 'Confirme sua conta - Código de Verificação'

  return `
${previewText}

Seu Código de Verificação

Para concluir a verificação da sua conta, insira este código no site adm.produtivese.com.br:

${opt}

clique aqui para validar seu e-mail:
${url}

Caso você não tenha solicitado esse código, simplesmente ignore esta mensagem.

O código é válido por 24 horas e não deve ser compartilhado.

Este é um e-mail automático, não responda.

Atenciosamente,
Equipe Produtivese
`
}

export const VerificationEmailWithOptTemplate = {
  subject: 'Seu Código de Verificação - Produtivese',
  render: (data: VerificationEmailWithOptProps) => ({
    html: renderEmailComponent(VerificationEmailWithOpt(data)),
    text: VerificationEmailWithOptText(data),
  }),
}
