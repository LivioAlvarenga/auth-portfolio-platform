import { ButtonThemeToggle } from '@/components/ButtonThemeToggle'
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
    <div className="my-10 overflow-hidden py-2 wrapper">
      <ButtonThemeToggle />
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
  )
}
