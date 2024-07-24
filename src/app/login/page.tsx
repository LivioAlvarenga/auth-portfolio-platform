import { ButtonThemeToggle } from '@/components/ButtonThemeToggle'
import { LoginForm } from '@/components/LoginForm'
import { LogoHorizontal } from '@/components/svg/logo-horizontal'
import { LogoVertical } from '@/components/svg/logo-vertical'
import { Text } from '@/components/Text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'

interface LoginPageProps {
  searchParams: {
    email?: string
  }
}

export default function Login({ searchParams }: LoginPageProps) {
  const email = searchParams.email || ''
  return (
    <div className="grid grid-cols-1 items-center overflow-hidden lg:grid-cols-2">
      {/* grid left - only in desktop */}
      <div className="hidden min-h-screen w-full border-r border-border bg-border dark:bg-card lg:block">
        <div className="mx-auto min-h-screen w-1/2 bg-loginImage bg-contain bg-center bg-no-repeat" />
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
            <Link href="/register">Cadastrar</Link>
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
              Entrar
            </Text>
            <Text variant={'label-14-14-400'} className="text-muted-foreground">
              Insira seu e-mail abaixo para acessar sua conta
            </Text>
          </CardHeader>
          <CardContent>
            <LoginForm email={email} />
            <div className="mt-4 flex items-center justify-center text-sm">
              <Text as="span" variant={'label-14-14-400'}>
                Não tem uma conta?{' '}
              </Text>
              <Button asChild variant="link">
                <Link href="/register" className="underline">
                  Cadastre-se
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
