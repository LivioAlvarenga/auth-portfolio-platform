'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { webserver } from '@/infra/webserver'
import { getProfileCompletionMessage } from '@/use-cases/utils/profile-completion-fields'
import {
  getInitials,
  transformTextIntoCapitalizedWords,
} from '@/utils/textUtils'
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu'
import { TooltipArrow } from '@radix-ui/react-tooltip'
import { UserRound } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
  score?: number | null
}

export function UserAvatar({ name, email, urlImage, score }: UserAvatarProps) {
  const router = useRouter()
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const transformedName = transformTextIntoCapitalizedWords(name)
  const initials = getInitials(transformedName)
  const avatar = urlImage || ''
  const scoreText = getProfileCompletionMessage(score)

  const avatarFallback = initials || (
    <UserRound className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 text-accent-foreground" />
  )

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
    router.push(`${webserver.host}/settings`)
  }

  const handleManagerAccount = () => {
    router.push(`${webserver.host}/profile`)
  }

  return (
    <div className="relative">
      {/* Notification Dot of score */}
      {typeof score === 'number' && score > 0 && (
        <span className="absolute right-0.5 top-0 z-10 h-3 w-3 rounded-full bg-destructive" />
      )}

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
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>

                {/* Tooltip - User Info when hovering */}
                {(transformedName || email) && (
                  <TooltipContent
                    side="bottom"
                    align="end"
                    sideOffset={10}
                    className="hidden flex-col items-start p-3 lg:flex"
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
                    {typeof score === 'number' && score > 0 && (
                      <Text
                        variant={'label-14-14-400'}
                        className="mt-6 max-w-56 text-pretty text-left text-destructive"
                      >
                        {scoreText}
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
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleConfigPage}
          >
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
    </div>
  )
}
