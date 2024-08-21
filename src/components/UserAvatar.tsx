'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  getInitials,
  transformTextIntoCapitalizedWords,
} from '@/utils/textUtils'
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu'
import { TooltipArrow } from '@radix-ui/react-tooltip'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { showToast } from './ShowToast'
import { Text } from './Text'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

interface UserAvatarProps {
  name?: string | null
  email?: string | null
  urlImage?: string | null
}

export function UserAvatar({ name, email, urlImage }: UserAvatarProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const transformedName = transformTextIntoCapitalizedWords(name)
  const initials = getInitials(transformedName)
  const avatar = urlImage || ''

  const handleDropdownOpenChange = (open: boolean) => {
    if (open) {
      setIsTooltipOpen(false)
    } else if (isHovered) {
      setIsTooltipOpen(true)
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (!isTooltipOpen) {
      setIsTooltipOpen(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsTooltipOpen(false)
  }

  async function handleSignOut() {
    await signOut()
  }

  const handleConfigPage = () => {
    showToast({
      message: 'Levar para a página de configurações - Em implementação',
      duration: 5000,
      variant: 'warning',
    })
  }

  const handleManagerAccount = () => {
    showToast({
      message:
        'Levar para a página de gerenciamento de conta - Em implementação',
      duration: 5000,
      variant: 'warning',
    })
  }

  return (
    <DropdownMenu onOpenChange={handleDropdownOpenChange}>
      <DropdownMenuTrigger asChild>
        {/* Button open dropdown */}
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 overflow-hidden rounded-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <TooltipProvider>
            <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
              <TooltipTrigger asChild>
                {/* Avatar */}
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={avatar}
                    alt={`avatar de ${transformedName}`}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>

              {/* Tooltip - User Info when hovering */}
              {(transformedName || email) && (
                <TooltipContent
                  side="bottom"
                  align="end"
                  sideOffset={10}
                  className="flex flex-col items-start"
                >
                  <TooltipArrow className="fill-border" />

                  {transformedName && (
                    <Text variant={'body-16-16-400'}>{transformedName}</Text>
                  )}
                  {email && (
                    <Text
                      variant={'label-14-14-400'}
                      className="text-muted-foreground"
                    >
                      {email}
                    </Text>
                  )}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-[14px] font-normal leading-[20px] tracking-[0.1px]">
          <p className="mb-2 font-sans500 text-[16px] leading-[24px] tracking-[0.5px]">
            Meu Perfil
          </p>
          <p className="font-medium">{transformedName}</p>
          <p className="text-muted-foreground">{email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Profile Button*/}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleManagerAccount}
        >
          Gerenciamento da Conta
        </DropdownMenuItem>

        {/* Settings Button*/}
        <DropdownMenuItem className="cursor-pointer" onClick={handleConfigPage}>
          Configurações
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* SignOut Button*/}
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          Sair
        </DropdownMenuItem>
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
