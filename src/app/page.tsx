import { ButtonThemeToggle } from '@/components/ButtonThemeToggle'
import { Icon } from '@/components/svg/icon'
import { LogoHorizontal } from '@/components/svg/logo-horizontal'
import { Text } from '@/components/Text'
import { serverProtectedRoute } from '@/lib/authjs/serverProtectedRoute'

export default async function Home() {
  const session = await serverProtectedRoute()

  return (
    <>
      <header className="border-b border-border shadow-sm">
        <header className="flex h-28 w-full items-center justify-between wrapper">
          <Icon />
          <LogoHorizontal ariaLabel="Logo horizontal Produtivese" />
          <ButtonThemeToggle />
        </header>
      </header>
      <div className="my-10 flex flex-col gap-4 overflow-hidden py-2 wrapper">
        <Text as="h1" variant="advertence-32-72-700">
          {`Olá, ${session?.user?.name}!`}
        </Text>
      </div>
    </>
  )
}
