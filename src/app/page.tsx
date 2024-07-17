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
      <div className="my-10 overflow-hidden py-2 wrapper">
        <LogoVertical ariaLabel="Logo vertical Produtivese" />
        <Text as="h1" variant="advertence-32-72-700">
          adm.produtivese.com.br
        </Text>
        {buttonVariantsList.map((variant) =>
          buttonSizes.map((size) => (
            <div
              key={`${variant}-${size}`}
              className="flex flex-col items-center"
            >
              <div className="flex items-center justify-center gap-4 p-10">
                <Button variant={variant} size={size}>
                  {size === 'icon' ? <HomeIcon /> : `${variant} - ${size}`}
                </Button>
                <Text
                  as="p"
                  variant="body-16-16-400"
                >{`Variant: ${variant}, Size: ${size}`}</Text>
              </div>
            </div>
          )),
        )}
      </div>
    </>
  )
}
