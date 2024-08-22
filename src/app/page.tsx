import { ButtonThemeToggle } from '@/components/ButtonThemeToggle'
import { Icon } from '@/components/svg/icon'
import { LogoHorizontal } from '@/components/svg/logo-horizontal'
import { Text } from '@/components/Text'
import { UserAvatar } from '@/components/UserAvatar'
import { serverProtectedRoute } from '@/lib/authjs/serverProtectedRoute'

export default async function Home() {
  const session = await serverProtectedRoute()

  const avatarOptions = {
    name: session.user?.name,
    email: session.user?.email,
    urlImage: `${process.env.NEXT_PUBLIC_BUCKET}${session.user?.image}`,
    score: session.user?.profile_completion_score,
  }

  return (
    <>
      <header className="border-b border-border shadow-sm">
        <header className="flex h-28 w-full items-center justify-between wrapper">
          <Icon className="sm:hidden" />
          <LogoHorizontal
            ariaLabel="Logo horizontal Produtivese"
            className="hidden sm:block"
          />
          <div className="flex items-center gap-2">
            <ButtonThemeToggle />
            <UserAvatar {...avatarOptions} />
          </div>
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
