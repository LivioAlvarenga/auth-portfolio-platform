import { ButtonThemeToggle } from '@/components/ButtonThemeToggle'
import { Icon } from '@/components/svg/icon'
import { LogoHorizontal } from '@/components/svg/logo-horizontal'
import { LogoVertical } from '@/components/svg/logo-vertical'
import { Text } from '@/components/Text'
import { Button } from '@/components/ui/button'
import { HomeIcon } from 'lucide-react'

export default function Home() {
  const buttonVariantsList = [
    'default',
    'destructive',
    'outline',
    'secondary',
    'ghost',
    'link',
  ] as const
  const buttonSizes = ['sm', 'default', 'lg', 'icon'] as const
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
        <LogoVertical ariaLabel="Logo vertical Produtivese" />
        <Text as="h1" variant="advertence-32-72-700">
          adm.produtivese.com.br
        </Text>
        <div className="mt-5 grid grid-cols-4 gap-3 rounded-lg border bg-accent px-3 py-4">
          {buttonVariantsList.map((variant) =>
            buttonSizes.map((size) => (
              <div
                key={`${variant}-${size}`}
                className="grid grid-cols-2 items-center gap-3 rounded-md bg-background p-2"
              >
                <Button variant={variant} size={size}>
                  {size === 'icon' ? <HomeIcon /> : 'Produtivese'}
                </Button>
                <div className="grid grid-rows-2">
                  <Text
                    as="p"
                    variant="body-16-16-400"
                    className="font-sans700 text-foreground"
                  >{`${variant}`}</Text>
                  <Text
                    as="p"
                    variant="body-16-16-400"
                    className="text-muted-foreground"
                  >{`size - ${size}`}</Text>
                </div>
              </div>
            )),
          )}
        </div>
      </div>
    </>
  )
}
