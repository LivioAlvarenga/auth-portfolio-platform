import { ButtonThemeToggle } from '@/components/ButtonThemeToggle'
import { LoginForm } from '@/components/LoginForm'
import { LogoHorizontal } from '@/components/svg/logo-horizontal'
import { LogoVertical } from '@/components/svg/logo-vertical'
import { Button } from '@/components/ui/button'

export default function Login() {
  return (
    <div className="grid grid-cols-1 items-center overflow-hidden lg:grid-cols-2">
      <div className="hidden min-h-screen w-full bg-hero bg-cover bg-center bg-no-repeat lg:block">
        <LogoHorizontal
          ariaLabel="Logo horizontal Produtivese"
          className="absolute left-10 top-10 opacity-90"
        />
      </div>
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 p-4 md:justify-center md:gap-14">
        <div className="absolute right-4 top-4 flex items-center gap-2 md:right-6 md:top-6 lg:right-10 lg:top-10">
          <Button variant={'ghost'} className="hidden lg:block">
            Cadastrar
          </Button>
          <ButtonThemeToggle />
        </div>
        <LogoVertical
          className="md:w-[230px] lg:hidden"
          ariaLabel="Logo vertical Produtivese"
        />
        <LoginForm />
      </div>
    </div>
  )
}
