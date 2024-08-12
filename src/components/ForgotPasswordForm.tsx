'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { webserver } from '@/infra/webserver'
import { cn } from '@/lib/shadcn-ui'
import { emailValidation } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { showToast } from './ShowToast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'

const forgotPasswordFormSchema = z.object({
  email: emailValidation,
})

type ForgotPasswordFormSchemaProps = z.infer<typeof forgotPasswordFormSchema>

type ForgotPasswordFormProps = React.HTMLAttributes<HTMLFormElement> & {
  className?: string
}

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForgotPasswordFormSchemaProps>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof forgotPasswordFormSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch(
        `${webserver.host}/api/v1/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
          }),
        },
      )

      if (response.ok) {
        showToast({
          message: `E-mail enviado para ${values.email} com instruções para redefinir sua senha. Verifique sua caixa de entrada ou spam.`,
          duration: Infinity,
          variant: 'success',
        })

        form.reset()
        return
      }

      form.setError('email', {
        message: 'O e-mail fornecido não existe.',
      })

      console.error('💥 Falha ao enviar código de verificação.', response)

      showToast({
        message:
          'Não foi possível criar o token, pois o e-mail fornecido não existe.',
        duration: Infinity,
        variant: 'error',
      })
    } catch (error) {
      console.error(
        '💥 Falha ao enviar a solicitação para redefinição de senha.',
        error,
      )

      showToast({
        message:
          'Ocorreu um erro ao tentar enviar a solicitação para redefinição de senha. Por favor, tente novamente mais tarde.',
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
        {/* E-mail */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="email"
                  placeholder="Digite seu e-mail"
                  {...field}
                />
              </FormControl>
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
              <LoaderCircle className="mr-2 animate-spin" /> Processando...
            </>
          ) : (
            'Enviar solicitação'
          )}
        </Button>
      </form>
    </Form>
  )
}
