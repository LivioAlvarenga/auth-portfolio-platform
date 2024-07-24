import { CheckCircle2, CircleAlert, Info, ShieldClose } from 'lucide-react'
import { toast } from 'sonner'
import { Text } from './Text'
import { Button, ButtonVariants } from './ui/button'

interface ToastOptions {
  message: string
  duration?: number
  closeButton?: boolean
  variant?: 'error' | 'success' | 'warning' | 'info' | 'none'
  textFirstButton?: string
  variantFirstButton?: ButtonVariants['variant']
  onClickFirstButton?: () => void
  textSecondButton?: string
  variantSecondButton?: ButtonVariants['variant']
  onClickSecondButton?: () => void
}

/**
 * Function to show a custom toast message.
 * @param options - The options for the toast including message, duration, closeButton, variant, textFirstButton, variantFirstButton, onClickFirstButton, textSecondButton, variantSecondButton, and onClickSecondButton.
 */
export const showToast = (options: ToastOptions) => {
  const {
    message,
    duration = 5000,
    closeButton = true,
    variant = 'none',
    textFirstButton,
    variantFirstButton = 'ghost',
    onClickFirstButton,
    textSecondButton,
    variantSecondButton = 'default',
    onClickSecondButton,
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

  toast(
    <div className="flex w-full flex-col space-y-4">
      {renderIcon()}
      <Text className="my-2" variant={'body-16-16-400'}>
        {message}
      </Text>
      {(textFirstButton || textSecondButton) && (
        <div className="flex items-center justify-end gap-4">
          {textFirstButton && (
            <Button
              variant={variantFirstButton}
              onClick={() => {
                toast.dismiss()
                if (onClickFirstButton) {
                  onClickFirstButton()
                }
              }}
            >
              {textFirstButton}
            </Button>
          )}
          {textSecondButton && (
            <Button
              variant={variantSecondButton}
              onClick={() => {
                toast.dismiss()
                if (onClickSecondButton) {
                  onClickSecondButton()
                }
              }}
            >
              {textSecondButton}
            </Button>
          )}
        </div>
      )}
    </div>,
    {
      duration,
      closeButton,
      className: 'bg-card text-card-foreground border border-border',
      classNames: {
        closeButton:
          'bg-background border-border hover:dark:text-background text-foreground',
      },
    },
  )
}
