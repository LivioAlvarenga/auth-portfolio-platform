import { LogoVertical } from './svg/logo-vertical'
import { Text } from './Text'

export function LoadingScreen() {
  return (
    <div className="absolute inset-0 z-50 flex h-screen w-screen animate-scaleIn flex-col items-center justify-center gap-7 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-background/70">
      <LogoVertical
        className="mb-10 h-auto w-[200px] sm:w-[300px] lg:w-[400px]"
        ariaLabel="Logo vertical Produtivese"
      />
      <Text variant="headline-24-45-700">
        Carregando{' '}
        <span className="animate-[pulse_2s_cubic-bezier(0.4,_0,_0.6,_1)_infinite]">
          .
        </span>
        <span className="animate-[pulse_2.5s_cubic-bezier(0.4,_0,_0.6,_1)_infinite]">
          .
        </span>
        <span className="animate-[pulse_3s_cubic-bezier(0.4,_0,_0.6,_1)_infinite]">
          .
        </span>
      </Text>
    </div>
  )
}
