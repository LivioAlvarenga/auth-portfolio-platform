import { ButtonThemeToggle } from '@/components/ButtonThemeToggle'
import { OptForm } from '@/components/OptForm'
import { LogoHorizontal } from '@/components/svg/logo-horizontal'
import { LogoVertical } from '@/components/svg/logo-vertical'
import { Text } from '@/components/Text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'

interface VerifyEmailOptPageProps {
  searchParams: {
    email?: string
    token?: string
  }
}

export default function VerifyEmailOpt({
  searchParams,
}: VerifyEmailOptPageProps) {
  const email = searchParams.email || ''
  const token = searchParams.token || ''

  if (!email) {
    redirect('/login')
  }

  return (
    <div className="grid grid-cols-1 items-center overflow-hidden lg:grid-cols-2">
      {/* grid left - only in desktop */}
      <div className="hidden min-h-screen w-full border-r border-border bg-border dark:bg-card lg:block">
        <div className="mx-auto min-h-screen w-1/2 bg-verifyEmailOptImage bg-contain bg-center bg-no-repeat" />
        <LogoHorizontal
          ariaLabel="Logo horizontal Produtivese"
          className="absolute left-10 top-10 opacity-90"
        />
      </div>

      {/* grid right */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 p-4 md:justify-center md:gap-14">
        {/* sing-in and toggle theme buttons */}
        <div className="absolute right-4 top-4 flex items-center gap-2 md:right-6 md:top-6 lg:right-10 lg:top-10">
          <Button asChild variant={'ghost'} className="hidden lg:flex">
            <Link href="/login">Entrar</Link>
          </Button>
          <ButtonThemeToggle />
        </div>

        {/* Logo - only mobile and tablet */}
        <LogoVertical
          className="md:w-[230px] lg:hidden"
          ariaLabel="Logo vertical Produtivese"
        />

        {/* Card with login form */}
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <Text as="h1" variant={'title-22-32-500'}>
              Verificação de E-mail
            </Text>
            <Text
              variant={'label-14-14-400'}
              className="pt-4 text-muted-foreground"
            >
              {`Por favor, insira o código de verificação enviado para o seu
              e-mail ${email}.`}
            </Text>
          </CardHeader>
          <CardContent>
            <OptForm email={email} token={token} />
            <Text
              variant={'label-14-14-400'}
              className="mt-4 text-pretty text-center text-muted-foreground"
            >
              Se você não encontrar o e-mail em sua caixa de entrada, por favor,
              verifique também a pasta de spam.
            </Text>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}