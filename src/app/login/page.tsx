import { ButtonThemeToggle } from '@/components/ButtonThemeToggle'
import { LoginForm } from '@/components/LoginForm'
import { LogoVertical } from '@/components/svg/logo-vertical'

export default function Login() {
  return (
    <>
      <div className="absolute top-0">
        <ButtonThemeToggle />
      </div>
      <div className="grid grid-cols-1 items-center overflow-hidden lg:grid-cols-2">
        <div className="bg-hero hidden min-h-screen w-full bg-cover bg-center bg-no-repeat lg:block" />
        <div className="flex min-h-screen w-full flex-col items-center justify-start gap-10 p-4 md:justify-center md:gap-14">
          <LogoVertical
            className="md:w-[230px]"
            ariaLabel="Logo vertical Produtivese"
          />
          <LoginForm />
        </div>
      </div>
    </>
  )
}
