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

import { webserver } from '@/infra/webserver'
import { HelpCircle, Loader2, MapPin } from 'lucide-react'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { showToast } from './ShowToast'
import { Button } from './ui/button'

interface LocationCollectionConsentSwitchProps {
  className?: string
  session: Session | null
}

const LocationCollectionConsentSwitch: React.FC<
  LocationCollectionConsentSwitchProps
> = ({ className, session }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setIsChecked] = useState<boolean>(
    Boolean(session?.user?.location_collection_consent),
  )
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false)

  const handleCheckedChange = async (checked: boolean) => {
    setIsChecked(checked)
    setIsLoading(true)

    try {
      const response = await fetch(
        `${webserver.host}/api/v1/private/auth/sessions/update-location-consent`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session?.user?.id,
          }),
        },
      )
      const responseBody = await response.json()

      if (response.status === 201) {
        const message = !isChecked
          ? 'Coleta de localização e IP autorizada com sucesso'
          : 'Coleta de localização e IP desautorizada com sucesso'

        showToast({
          message,
          duration: 3000,
          variant: 'success',
        })
        return
      }

      if (response.status === 404) {
        showToast({
          message:
            'Falha ao autorizar/desautorizar a coleta de localização e IP.',

          duration: 3000,
          variant: 'warning',
        })
        return
      }

      throw new Error(responseBody.message)
    } catch (error) {
      console.error(
        '💥 Falha ao autorizar/desautorizar a coleta de localização e IP.',
        error,
      )

      showToast({
        message:
          'Falha ao autorizar/desautorizar a coleta de localização e IP.',
        duration: 3000,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isLoading) {
      return
    }
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
    if (!isLoading) {
      setIsTooltipOpen((prev) => !prev)
    }
  }

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024 && !isLoading) {
      setIsTooltipOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024 && !isLoading) {
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
                isLoading && 'cursor-not-allowed opacity-50',
              )}
              onClick={handleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {isLoading ? (
                <div className="flex h-[70px] w-full items-center justify-center sm:h-[58px] lg:h-[52px]">
                  <Loader2 className="animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <MapPin />
                  <div className="flex flex-1 flex-col items-start gap-1">
                    <Text variant="title-16-18-500">
                      Coleta de Localização e IP
                    </Text>
                    <Text
                      variant="label-14-16-400"
                      className="text-muted-foreground"
                    >
                      Autorize para ajudar a aumentar a segurança da sua conta.
                    </Text>
                  </div>
                  <Switch
                    disabled={isLoading}
                    checked={isChecked}
                    onCheckedChange={handleCheckedChange}
                  />{' '}
                </>
              )}
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
              Por que autorizar a Coleta de Localização e IP?
            </Text>
            <div className="space-y-1.5">
              <Text variant="label-14-14-400" className="text-muted-foreground">
                Ao autorizar a coleta de informações como IP, país, cidade,
                região e fuso horário, você nos ajuda a monitorar a segurança da
                sua conta. Esses dados nos permitem identificar logins suspeitos
                ou feitos de locais incomuns, aumentando a proteção contra
                acessos não autorizados.
              </Text>
              <Text variant="label-14-14-400" className="text-muted-foreground">
                Respeitamos sua privacidade e, de acordo com a Lei Geral de
                Proteção de Dados (LGPD), só coletaremos essas informações com
                sua permissão. Você pode desautorizar a coleta a qualquer
                momento nas configurações de sua conta, sem qualquer impacto no
                seu uso normal do sistema.
              </Text>
              <Text variant="label-14-14-400" className="text-muted-foreground">
                Autorizar a coleta de localização e IP é uma forma de garantir
                que sua conta esteja sempre segura, mas a decisão é totalmente
                sua.
              </Text>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default LocationCollectionConsentSwitch
