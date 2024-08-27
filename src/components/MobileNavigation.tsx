'use client'

import { NavigationLink } from '@/components/NavigationLink'
import { webserver } from '@/infra/webserver'
import { Home, PanelLeft, Settings, User2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Icon } from './svg/icon'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

export const MobileNavigation: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false)

  const handleCloseMenu = (event: React.MouseEvent) => {
    setOpenMenu(false)
  }

  return (
    <Sheet open={openMenu} onOpenChange={setOpenMenu}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu Principal de Navegação</SheetTitle>
          <SheetDescription>
            Acesse rapidamente as principais seções do site, incluindo o
            Dashboard, Gerenciamento da Conta e Configurações, através do menu
            abaixo.
          </SheetDescription>
        </SheetHeader>
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href={webserver.host}
            onClick={handleCloseMenu}
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-transparent text-lg font-semibold text-primary-foreground md:h-8 md:w-12 md:text-base"
          >
            <Icon className="w-12 transition-all group-hover:scale-110" />
            <span className="sr-only">Produtivese Home</span>
          </Link>
          <NavigationLink
            href={webserver.host}
            title="Dashboard"
            onClick={handleCloseMenu}
          >
            <Home className="h-5 w-5" />
          </NavigationLink>

          <NavigationLink
            href={`${webserver.host}/profile`}
            title="Gerenciamento da Conta"
            onClick={handleCloseMenu}
          >
            <User2 className="h-5 w-5" />
          </NavigationLink>
          <NavigationLink
            href={`${webserver.host}/settings`}
            title="Configurações"
            onClick={handleCloseMenu}
          >
            <Settings className="h-5 w-5" />
          </NavigationLink>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
