import { capitalizeEachWord } from '@/utils/textUtils'
import { Heading, Section, Text } from '@react-email/components'
import { renderEmailComponent } from '..'
import { LayoutEmail } from '../components/LayoutEmail'

export interface UserRegistrationWelcomeProps {
  name: string | null | undefined
}

export function UserRegistrationWelcome({
  name,
}: UserRegistrationWelcomeProps) {
  const previewText =
    'Bem-vindo à área administrativa da Produtivese! Explore os recursos e ferramentas que temos a oferecer para facilitar sua gestão.'

  const helloText = name ? `Olá ${capitalizeEachWord(name)},` : 'Olá,'

  return (
    <LayoutEmail previewText={previewText}>
      <Section className="mt-[20px] px-5">
        <Heading className="mx-0 my-[10px] p-0 text-left text-[16px] font-bold text-black">
          {helloText}
        </Heading>

        <Text className="mt-8 text-[14px] leading-[24px] text-black">
          Seja bem-vindo(a) à área administrativa da Produtivese! Estamos
          entusiasmados por tê-lo(a) conosco. Aqui, você terá acesso a uma
          variedade de ferramentas e recursos que foram cuidadosamente
          desenvolvidos para otimizar a gestão e a produtividade da sua empresa.
        </Text>

        <Text className="text-[14px] leading-[24px] text-black">
          Na Produtivese, entendemos que a eficiência é crucial para o sucesso
          de qualquer negócio. Nossa plataforma oferece soluções inteligentes
          que vão desde o planejamento estratégico até a gestão de demandas e
          materiais. Navegue pela área administrativa e descubra como podemos
          ajudá-lo(a) a alcançar seus objetivos de maneira mais eficaz.
        </Text>

        <Text className="text-[14px] leading-[24px] text-black">
          Nossa missão é simplificar a complexidade da gestão empresarial,
          permitindo que você se concentre no que realmente importa: crescer e
          inovar. A área administrativa da Produtivese foi projetada para ser
          intuitiva e fácil de usar, garantindo que você aproveite ao máximo
          cada funcionalidade disponível.
        </Text>

        <Text className="text-[14px] leading-[24px] text-black">
          Se precisar de assistência, nossa equipe de suporte está sempre pronta
          para ajudar. Não hesite em entrar em contato conosco para qualquer
          dúvida ou suporte técnico. Estamos aqui para garantir que sua
          experiência com a Produtivese seja excepcional.
        </Text>

        <Text className="text-[14px] leading-[24px] text-black">
          Mais uma vez, seja bem-vindo(a) à Produtivese. Estamos ansiosos para
          trabalhar juntos e contribuir para o seu sucesso. Explore a área
          administrativa e descubra tudo o que temos a oferecer. Agradecemos a
          sua confiança e estamos comprometidos em proporcionar a melhor
          experiência possível.
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

export function UserRegistrationWelcomeText({
  name,
}: UserRegistrationWelcomeProps): string {
  const previewText =
    'Bem-vindo à área administrativa da Produtivese! Explore os recursos e ferramentas que temos a oferecer para facilitar sua gestão.'

  const helloText = name ? `Olá ${capitalizeEachWord(name)},` : 'Olá,'

  return `
${previewText}

${helloText}

Seja bem-vindo(a) à área administrativa da Produtivese! Estamos entusiasmados por tê-lo(a) conosco. Aqui, você terá acesso a uma variedade de ferramentas e recursos que foram cuidadosamente desenvolvidos para otimizar a gestão e a produtividade da sua empresa.

Na Produtivese, entendemos que a eficiência é crucial para o sucesso de qualquer negócio. Nossa plataforma oferece soluções inteligentes que vão desde o planejamento estratégico até a gestão de demandas e materiais. Navegue pela área administrativa e descubra como podemos ajudá-lo(a) a alcançar seus objetivos de maneira mais eficaz.

Nossa missão é simplificar a complexidade da gestão empresarial, permitindo que você se concentre no que realmente importa: crescer e inovar. A área administrativa da Produtivese foi projetada para ser intuitiva e fácil de usar, garantindo que você aproveite ao máximo cada funcionalidade disponível.

Se precisar de assistência, nossa equipe de suporte está sempre pronta para ajudar. Não hesite em entrar em contato conosco para qualquer dúvida ou suporte técnico. Estamos aqui para garantir que sua experiência com a Produtivese seja excepcional.

Mais uma vez, seja bem-vindo(a) à Produtivese. Estamos ansiosos para trabalhar juntos e contribuir para o seu sucesso. Explore a área administrativa e descubra tudo o que temos a oferecer. Agradecemos a sua confiança e estamos comprometidos em proporcionar a melhor experiência possível.

Atenciosamente,
Equipe Produtivese
`
}

export const UserRegistrationWelcomeTemplate = {
  subject: 'Bem-vindo à Produtivese!',
  render: (data: UserRegistrationWelcomeProps) => ({
    html: renderEmailComponent(UserRegistrationWelcome(data)),
    text: UserRegistrationWelcomeText(data),
  }),
}
