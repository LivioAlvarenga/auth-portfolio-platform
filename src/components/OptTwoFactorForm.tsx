'use client'

import { Button } from '@/components/ui/button'
import { webserver } from '@/infra/webserver'
import { cn } from '@/lib/shadcn-ui'
import { getDeviceInfo } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import React, { useState } from 'react'
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

const optTwoFactorFormSchema = z.object({
  pin: z.string().min(6, {
    message: 'A sua senha de uso único deve conter 6 caracteres.',
  }),
})

type OptTwoFactorFormSchemaProps = z.infer<typeof optTwoFactorFormSchema>

type OptTwoFactorFormProps = React.HTMLAttributes<HTMLFormElement> & {
  className?: string
  user: {
    id: string
    email: string
    name?: string
  }
}

export function OptTwoFactorForm({
  className,
  user,
  ...props
}: OptTwoFactorFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<OptTwoFactorFormSchemaProps>({
    resolver: zodResolver(optTwoFactorFormSchema),
    defaultValues: {
      pin: '',
    },
  })

  async function handleSendOptToEmail(userId: string) {
    try {
      setIsLoading(true)
      // Create opt token and send email verification
      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential/two-factor/send-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
          }),
        },
      )

      if (!response.ok) {
        console.error(
          '💥 Falha ao enviar código de verificação de dois fatores.',
          response,
        )
        showToast({
          message: 'Falha ao enviar código de verificação de dois fatores.',
          duration: Infinity,
          variant: 'error',
          firstButton: {
            text: 'Enviar código novamente',
            variant: 'default',
            onClick: () => handleSendOptToEmail(user.id),
          },
        })
        return
      }

      showToast({
        message: `Código de verificação de dois fatores enviado para o email ${user.email}.`,
        variant: 'success',
      })

      form.reset()
    } catch (error) {
      console.error(
        '💥 Falha ao enviar código de verificação de dois fatores.',
        error,
      )

      showToast({
        message: 'Falha ao enviar código de verificação de dois fatores.',
        duration: Infinity,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof optTwoFactorFormSchema>) {
    setIsLoading(true)

    try {
      const device = await getDeviceInfo()
      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/credential/two-factor/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            opt: values.pin,
            device,
          }),
        },
      )

      const responseBody = await response.json()

      if (response.ok) {
        showToast({
          message: 'Usuário logado com sucesso!',
          duration: 3000,
          closeButton: false,
          variant: 'success',
          redirect: {
            path: `${webserver.host}/`,
            countdownSeconds: 2,
          },
        })

        form.reset()
        return
      }

      if (
        responseBody.message === 'Token não encontrado ou expirado.' ||
        responseBody.message === 'Token inválido.'
      ) {
        form.setError('pin', {
          message: 'Código inválido ou expirado.',
        })

        showToast({
          message: 'Código inválido ou expirado.',
          duration: Infinity,
          variant: 'error',
          firstButton: {
            text: 'Enviar código novamente',
            variant: 'default',
            onClick: () => handleSendOptToEmail(user.id),
          },
        })
        return
      }

      throw new Error(responseBody.message)
    } catch (error) {
      console.error(
        '💥 Falha ao enviar código de verificação de dois fatores.',
        error,
      )

      showToast({
        message: 'Falha ao enviar código de verificação de dois fatores.',
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
          onClick={() => handleSendOptToEmail(user.id)}
        >
          Reenviar código
        </Button>
      </div>
    </Form>
  )
}
