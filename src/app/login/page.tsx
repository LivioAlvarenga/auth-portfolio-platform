import { ButtonThemeToggle } from '@/components/ButtonThemeToggle'
import { LoginForm } from '@/components/LoginForm'
import { LogoHorizontal } from '@/components/svg/logo-horizontal'
import { LogoVertical } from '@/components/svg/logo-vertical'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function Login() {
  return (
    <div className="grid grid-cols-1 items-center overflow-hidden lg:grid-cols-2">
      {/* grid left - only in desktop */}
      <div className="hidden min-h-screen w-full bg-hero bg-cover bg-center bg-no-repeat lg:block">
        <LogoHorizontal
          ariaLabel="Logo horizontal Produtivese"
          className="absolute left-10 top-10 opacity-90"
        />
      </div>

      {/* grid right */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 p-4 md:justify-center md:gap-14">
        {/* sing-in and toggle theme buttons */}
        <div className="absolute right-4 top-4 flex items-center gap-2 md:right-6 md:top-6 lg:right-10 lg:top-10">
          <Button variant={'ghost'} className="hidden lg:block">
            Cadastrar
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
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>
              Insira seu e-mail abaixo para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-4 flex items-center justify-center text-sm">
              Não tem uma conta?{' '}
              <Button asChild variant="link">
                <Link href="#" className="underline">
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
