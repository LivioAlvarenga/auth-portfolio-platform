import { ButtonThemeToggle } from '@/components/ButtonThemeToggle'
import { ResetPasswordForm } from '@/components/ResetPasswordForm'
import { LogoHorizontal } from '@/components/svg/logo-horizontal'
import { LogoVertical } from '@/components/svg/logo-vertical'
import { Text } from '@/components/Text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { webserver } from '@/infra/webserver'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getData(token: string) {
  const response = await fetch(
    `${webserver.host}/api/v1/auth/register?token=${token}`,
    {
      cache:
        process.env.NODE_ENV === 'development' ? 'no-cache' : 'force-cache',
    },
  )
  if (!response.ok) {
    return null
  }

  const responseBody = await response.json()

  return responseBody.user
}
interface ResetPasswordPageProps {
  searchParams: {
    token?: string
  }
}

export default async function ResetPassword({
  searchParams,
}: ResetPasswordPageProps) {
  const token = searchParams.token || null

  if (!token) {
    redirect(`${webserver.host}/login`)
  }

  const user = await getData(token)
  if (!user) {
    redirect(`${webserver.host}/login`)
  }

  return (
    <div className="grid grid-cols-1 items-center overflow-hidden lg:grid-cols-2">
      {/* grid left - only in desktop */}
      <div className="hidden min-h-screen w-full border-r border-border bg-border dark:bg-card lg:block">
        <div className="mx-auto min-h-screen w-1/2 bg-resetPasswordImage bg-contain bg-center bg-no-repeat" />
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
            <Link href={`${webserver.host}/login`}>Entrar</Link>
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
              Recuperar Senha
            </Text>
            <Text
              variant={'label-14-14-400'}
              className="pt-4 text-muted-foreground"
            >
              Preencha os campos abaixo para recuperar sua senha
            </Text>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm user={user} />
            <div className="mt-4 flex items-center justify-center text-sm">
              <Text as="span" variant={'label-14-14-400'}>
                Lembrou sua senha?{' '}
              </Text>
              <Button asChild variant="link">
                <Link href={`${webserver.host}/login`} className="underline">
                  Fazer Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
