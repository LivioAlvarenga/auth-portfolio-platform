import { CheckCircle2, CircleAlert, Info, ShieldClose } from 'lucide-react'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Text } from './Text'
import { Button, ButtonVariants } from './ui/button'

interface ButtonOptions {
  text: string
  variant?: ButtonVariants['variant']
  onClick: () => void
}

interface RedirectOptions {
  path: string
  countdownSeconds?: number
}
interface ToastOptions {
  message: string
  duration?: number
  closeButton?: boolean
  variant?: 'error' | 'success' | 'warning' | 'info' | 'none'
  firstButton?: ButtonOptions
  secondButton?: ButtonOptions
  redirect?: RedirectOptions
}

/**
 * Function to show a custom toast message.
 * @param options - The options for the toast including message, duration, closeButton, variant, firstButton, secondButton, and redirect.
 */
export const showToast = (options: ToastOptions) => {
  const {
    message,
    duration = 5000,
    closeButton = true,
    variant = 'none',
    firstButton,
    secondButton,
    redirect,
  } = options

  const renderIcon = () => {
    switch (variant) {
      case 'error':
        return (
          <ShieldClose
            size={50}
            className="self-center fill-red-500 text-center text-card"
          />
        )
      case 'success':
        return (
          <CheckCircle2
            size={50}
            className="self-center fill-green-500 text-center text-card"
          />
        )
      case 'warning':
        return (
          <CircleAlert
            size={50}
            className="self-center fill-yellow-500 text-center text-card"
          />
        )
      case 'info':
        return (
          <Info
            size={50}
            className="self-center fill-blue-500 text-center text-card"
          />
        )
      default:
        return <span />
    }
  }

  const ToastContent = () => {
    const [counter, setCounter] = useState(redirect?.countdownSeconds || 5)
    const router = useRouter()

    useEffect(() => {
      if (redirect) {
        const interval = setInterval(() => {
          setCounter((prevCounter) => prevCounter - 1)
        }, 1000)

        const timeout = setTimeout(
          () => {
            router.push(redirect.path)
            toast.dismiss()
          },
          (redirect.countdownSeconds || 5) * 1000,
        )

        return () => {
          clearInterval(interval)
          clearTimeout(timeout)
        }
      }
    }, [redirect, router])

    const getPathWithoutQuery = (url: string) => {
      const urlObj = new URL(url, window.location.origin)
      return urlObj.pathname
    }

    return (
      <div className="flex w-full flex-col space-y-4">
        {renderIcon()}
        <Text className="my-2" variant={'body-16-16-400'}>
          {message}
        </Text>
        {(firstButton || secondButton) && (
          <div className="flex items-center justify-end gap-4">
            {firstButton && (
              <Button
                variant={firstButton.variant || 'ghost'}
                onClick={() => {
                  toast.dismiss()
                  firstButton.onClick()
                }}
              >
                {firstButton.text}
              </Button>
            )}
            {secondButton && (
              <Button
                variant={secondButton.variant || 'default'}
                onClick={() => {
                  toast.dismiss()
                  secondButton.onClick()
                }}
              >
                {secondButton.text}
              </Button>
            )}
          </div>
        )}
        {redirect && (
          <Text className="my-3 text-center" variant={'label-14-14-400'}>
            Você será redirecionado para{' '}
            <strong className="text-destructive">
              {getPathWithoutQuery(redirect.path)}
            </strong>{' '}
            em <strong className="text-destructive">{counter}</strong>{' '}
            segundos...
          </Text>
        )}
      </div>
    )
  }

  toast(<ToastContent />, {
    duration: redirect ? Infinity : duration,
    closeButton,
    className: 'bg-card text-card-foreground border border-border',
    classNames: {
      closeButton:
        'bg-background border-border hover:dark:text-background text-foreground',
    },
  })
}
