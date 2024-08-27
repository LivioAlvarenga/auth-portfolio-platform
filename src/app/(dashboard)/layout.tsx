import { BreadcrumbNavigator } from '@/components/BreadcrumbNavigator'
import { ButtonThemeToggle } from '@/components/ButtonThemeToggle'
import { MobileNavigation } from '@/components/MobileNavigation'
import { Icon } from '@/components/svg/icon'
import { TooltipLink } from '@/components/TooltipLink'
import { Input } from '@/components/ui/input'
import { UserAvatar } from '@/components/UserAvatar'
import { webserver } from '@/infra/webserver'
import { serverProtectedRoute } from '@/lib/authjs/serverProtectedRoute'
import { Home, Search, Settings, User2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await serverProtectedRoute()
  const avatarOptions = {
    name: session.user?.name,
    email: session.user?.email,
    urlImage: `${process.env.NEXT_PUBLIC_BUCKET}${session.user?.image}`,
    score: session.user?.profile_completion_score,
  }

  return (
    <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col rounded-md border bg-muted/40">
      <aside className="border-l-md fixed inset-y-0 z-10 ml-auto hidden w-14 flex-col border-r bg-background sm:flex">
        {/* Tablet and Desktop Menu */}
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href={webserver.host}
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-transparent text-lg font-semibold text-primary-foreground md:h-8 md:w-12 md:text-base"
          >
            <Icon className="w-9 transition-all group-hover:scale-110 md:w-12" />
            <span className="sr-only">Produtivese Home</span>
          </Link>

          <TooltipLink href={webserver.host} title="Dashboard">
            <Home className="h-5 w-5" />
          </TooltipLink>

          <TooltipLink
            href={`${webserver.host}/profile`}
            title="Gerenciamento da Conta"
          >
            <User2 className="h-5 w-5" />
          </TooltipLink>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipLink
            href={`${webserver.host}/settings`}
            title="Configurações"
          >
            <Settings className="h-5 w-5" />
          </TooltipLink>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile Menu */}
          <MobileNavigation />

          {/* BreadCrumb */}
          <BreadcrumbNavigator className="hidden md:flex" />

          {/* search input */}
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>

          {/* Theme Toggle */}
          <ButtonThemeToggle />

          {/* Avatar */}
          <UserAvatar {...avatarOptions} />
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </section>
  )
}
