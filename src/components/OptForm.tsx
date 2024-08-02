'use client'

import { Button } from '@/components/ui/button'
import { webserver } from '@/infra/webserver'
import { cn } from '@/lib/shadcn-ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { showToast } from './ShowToast'
import { Text } from './Text'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'

const optFormSchema = z.object({
  pin: z.string().min(6, {
    message: 'A sua senha de uso único deve conter 6 caracteres.',
  }),
})

type OptFormSchemaProps = z.infer<typeof optFormSchema>

type OptFormProps = React.HTMLAttributes<HTMLFormElement> & {
  className?: string
  email: string
  token: string
}

export function OptForm({ className, email, token, ...props }: OptFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [pin, setPin] = useState(token)
  const router = useRouter()

  useEffect(() => {
    setPin(token)
  }, [token])

  const form = useForm<OptFormSchemaProps>({
    resolver: zodResolver(optFormSchema),
    defaultValues: {
      pin: pin || '',
    },
  })

  function handleGoToLogin(email: string) {
    router.push(`/login?email=${email}`)
  }

  async function handleSendOptToEmail(email: string) {
    try {
      setIsLoading(true)
      // create verification token OPT
      const response = await fetch(
        `${webserver.host}/api/v1/verification-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            opt: true,
            dayExpires: 1,
            tokenType: 'EMAIL_VERIFICATION',
          }),
        },
      )

      if (!response.ok) {
        console.error('💥 Falha ao enviar código de verificação.', response)
        showToast({
          message: 'Falha ao enviar código de verificação.',
          duration: Infinity,
          variant: 'error',
          firstButton: {
            text: 'Enviar código novamente',
            variant: 'default',
            onClick: () => handleSendOptToEmail(email),
          },
        })
        return
      }

      showToast({
        message: `Código de verificação enviado para o email ${email}.`,
        variant: 'success',
      })

      form.reset()
    } catch (error) {
      console.error('💥 Falha ao enviar código de verificação.', error)

      showToast({
        message: 'Falha ao enviar código de verificação.',
        duration: Infinity,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof optFormSchema>) {
    setIsLoading(true)

    try {
      // check opt code
      const response = await fetch(
        `${webserver.host}/api/v1/verification-token?email=${email}&token=${values.pin}`,
      )
      const responseBody = await response.json()

      if (!response.ok) {
        if (responseBody.message === 'Email e token são obrigatórios.') {
          form.setError('pin', {
            message: 'OPT e email são obrigatórios.',
          })

          showToast({
            message:
              'Por favor, forneça um email válido junto com o código OPT.',
            duration: Infinity,
            variant: 'warning',
          })
          return
        }

        if (responseBody.message === 'Token inválido ou expirado.') {
          form.setError('pin', {
            message: 'Código inválido ou expirado.',
          })

          showToast({
            message: 'Código OPT inválido ou expirado.',
            duration: Infinity,
            variant: 'error',
            firstButton: {
              text: 'Enviar código novamente',
              variant: 'default',
              onClick: () => handleSendOptToEmail(email),
            },
          })
          return
        }

        throw new Error(responseBody.message)
      }

      showToast({
        message: `O email ${email} foi verificado com sucesso. Você será redirecionado para a página de login.`,
        duration: Infinity,
        variant: 'success',
        firstButton: {
          text: 'Fazer Login Agora!',
          variant: 'default',
          onClick: () => handleGoToLogin(email),
        },
        redirect: {
          path: `/login?email=${email}`,
          countdownSeconds: 5,
        },
      })

      form.reset()
    } catch (error) {
      console.error('💥 Falha ao enviar código de verificação.', error)

      showToast({
        message: 'Falha ao enviar código de verificação.',
        duration: Infinity,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-4', className)}
        {...props}
      >
        {/* Full Name */}
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel>Código de Verificação:</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Digite o código de 6 caracteres aqui.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 animate-spin" /> Carregando...
            </>
          ) : (
            'Verificar Código'
          )}
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <Text as="span" variant={'label-14-14-400'}>
          Não recebeu o código?{' '}
        </Text>
        <Button
          type="button"
          disabled={form.formState.isSubmitting || isLoading}
          variant={'secondary'}
          onClick={() => handleSendOptToEmail(email)}
        >
          Reenviar código
        </Button>
      </div>
    </Form>
  )
}
