import {
  Column,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components'

const baseUrl = process.env.NEXT_PUBLIC_URL
const year = new Date().getFullYear()

export function FooterEmail() {
  return (
    <>
      <Section className="px-5">
        <Section>
          <Row className="mt-5">
            <Column align="left" className="">
              <Row>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] leading-[24px] text-black"
                  href={baseUrl}
                >
                  Home
                </Link>
              </Row>
              <Row className="mt-1">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] leading-[24px] text-black"
                  href={`${baseUrl}/sobre-a-produtivese`}
                >
                  Quem Somos
                </Link>
              </Row>
              <Row className="mt-1">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-[14px] leading-[24px] text-black"
                  href={`${baseUrl}#servicos`}
                >
                  Serviços
                </Link>
              </Row>
            </Column>

            <Column align="left" className="">
              <Row>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-[14px] leading-[24px] text-black"
                  href={`${baseUrl}#fale-conosco`}
                >
                  Agende uma conversa
                </Link>
              </Row>
              <Row className="mt-1">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-[14px] leading-[24px] text-black"
                  href={`${baseUrl}/sobre-a-produtivese#metodologia`}
                >
                  Metodologia
                </Link>
              </Row>
              <Row className="mt-1">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-[14px] leading-[24px] text-black"
                  href={`${baseUrl}/sobre-a-produtivese#tecnologias`}
                >
                  Tecnologias
                </Link>
              </Row>
            </Column>
          </Row>
        </Section>

        <Section>
          <Row align="left" className="mt-8 w-[200px]">
            <Column align="center">
              <Link
                title="Salve nossos contatos"
                aria-label="Salve nossos contatos"
                download="cardContato.vcf"
                href={`${process.env.NEXT_PUBLIC_BUCKET}/cardContato.vcf`}
              >
                <Img
                  src={`${process.env.NEXT_PUBLIC_BUCKET}/save-contacts.png`}
                  width="40"
                  height="40"
                  alt="Salve os contatos da Produtivese"
                />
              </Link>
            </Column>
            <Column align="center">
              <Link
                title="Faça uma ligação para a Produtivese"
                aria-label="Faça uma ligação para a Produtivese"
                target="_blank"
                rel="noopener noreferrer"
                href="tel:+5531984336963"
              >
                <Img
                  src={`${process.env.NEXT_PUBLIC_BUCKET}/doing-call.png`}
                  width="40"
                  height="40"
                  alt="Faça uma ligação para a Produtivese"
                  className="ml-2"
                />
              </Link>
            </Column>
            <Column align="center">
              <Link
                title="Abra o WhatsApp da Produtivese"
                aria-label="Abra o WhatsApp da Produtivese"
                target="_blank"
                rel="noopener noreferrer"
                href="https://wa.me/5531984336963"
              >
                <Img
                  src={`${process.env.NEXT_PUBLIC_BUCKET}/open-whatsapp.png`}
                  width="40"
                  height="40"
                  alt="Abra o WhatsApp da Produtivese"
                  className="ml-2"
                />
              </Link>
            </Column>
          </Row>
        </Section>

        <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

        <Text className="text-[12px] italic leading-[24px] text-[#666666]">
          Por favor, não responda a este e-mail, pois ele é gerado
          automaticamente e não está configurado para receber respostas. Se você
          tiver dúvidas ou precisar de assistência, entre em contato conosco
          pelos canais oficiais de atendimento disponíveis em nosso site.
          Agradecemos pela compreensão e estamos sempre à disposição para
          ajudá-lo(a).
        </Text>
      </Section>
      <Section className="mt-5 bg-[#0866FF] py-5">
        <Text className="mx-auto max-w-md text-center text-[14px] leading-[24px] text-white">
          Copyright © {year} Produtivese Tecnologia | Rua Patagônia, Sion -
          CEP: 30.320-080 Belo Horizonte (MG)
        </Text>
      </Section>
    </>
  )
}
