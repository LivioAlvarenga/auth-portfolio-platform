'use client'

import { Text } from '@/components/Text'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/shadcn-ui'

import { HelpCircle, Lock } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from './ui/button'

interface TwoFactorAuthSwitchProps {
  className?: string
  two_factor_enabled?: boolean
}

const TwoFactorAuthSwitch: React.FC<TwoFactorAuthSwitchProps> = ({
  className,
  two_factor_enabled,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(
    Boolean(two_factor_enabled),
  )
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false)

  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked)
    console.log('Switch toggled to:', checked)
    // Aqui você pode chamar a API para fazer o toggle da autenticação
    // fetch('/api/toggle-auth', { method: 'POST', body: JSON.stringify({ enabled: checked }) })
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.closest('button')?.tagName === 'BUTTON'
    ) {
      return
    }
    const switchElement = event.currentTarget.querySelector('button')
    if (switchElement) {
      switchElement.click()
    }
  }

  const handleButtonClick = () => {
    setIsTooltipOpen((prev) => !prev)
  }

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      setIsTooltipOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      setIsTooltipOpen(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip open={isTooltipOpen}>
        <TooltipTrigger asChild>
          <div className={cn('relative', className)}>
            <Button
              variant={'outline'}
              className={cn(
                'absolute -left-[10px] -top-[14px] h-7 w-7 rounded-full p-0 font-sans700 text-base text-muted-foreground/60 transition-all lg:hidden',
                isTooltipOpen && 'text-lg !text-primary',
              )}
              onClick={handleButtonClick}
            >
              ?
            </Button>
            <div
              className={cn(
                'flex w-full cursor-pointer items-center space-x-4 rounded-md border bg-background p-4',
              )}
              onClick={handleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Lock />
              <div className="flex flex-1 flex-col items-start gap-1">
                <Text variant="title-16-18-500">
                  Autenticação de Dois Fatores
                </Text>
                <Text
                  variant="label-14-16-400"
                  className="text-muted-foreground"
                >
                  Habilite para aumentar a segurança da sua conta.
                </Text>
              </div>
              <Switch
                checked={isChecked}
                onCheckedChange={handleCheckedChange}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="flex"
          style={{
            maxWidth: 'var(--radix-tooltip-content-available-width)',
            maxHeight: 'var(--radix-tooltip-content-available-height)',
            overflowY: 'auto',
            transformOrigin: 'var(--radix-tooltip-content-transform-origin)',
            width: 'var(--radix-tooltip-trigger-width)',
          }}
        >
          <div className="max-w-3xl flex-1 space-y-4 px-2 py-4">
            <HelpCircle className="hidden text-foreground/50 lg:block" />
            <Text variant="label-14-16-400">
              Por que habilitar a Autenticação de Dois Fatores?
            </Text>
            <div className="space-y-1.5">
              <Text variant="label-14-14-400" className="text-muted-foreground">
                Ao habilitar a autenticação de dois fatores, você aumenta a
                segurança da sua conta. Na próxima vez que fizer login com email
                e senha, será enviado um email com um link.
              </Text>
              <Text variant="label-14-14-400" className="text-muted-foreground">
                Ao clicar no link, você entrará na aplicação, adicionando uma
                camada extra de segurança além da sua senha. Isso ocorrerá
                apenas após um longo período sem login ou se você se deslogar da
                aplicação.
              </Text>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TwoFactorAuthSwitch
