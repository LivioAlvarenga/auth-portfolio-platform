// HeaderEmail.js ou HeaderEmail.tsx
import { Column, Hr, Img, Link, Section } from '@react-email/components'

const baseUrl = 'https://www.produtivese.com.br/'

export function HeaderEmail() {
  return (
    <Section className="px-5">
      <Section className="mt-[32px]">
        <Column align="left">
          <Link target="_blank" rel="noopener noreferrer" href={baseUrl}>
            <Img
              src={`${process.env.NEXT_PUBLIC_BUCKET}/produtivese-hor-primary-272-77.png`}
              width="272"
              height="77"
              alt="logo Produtivese"
            />
          </Link>
        </Column>
      </Section>
      <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
    </Section>
  )
}
