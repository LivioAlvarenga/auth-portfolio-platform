'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { webserver } from '@/infra/webserver'
import { cn } from '@/lib/shadcn-ui'
import { passwordValidation } from '@/schemas'
import { sendEmail } from '@/utils/email'
import { generatePassword } from '@/utils/password'
import { zodResolver } from '@hookform/resolvers/zod'
import { Copy, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

const resetPasswordFormSchema = z.object({
  newPassword: passwordValidation,
  confirmPassword: passwordValidation,
})

type ResetPasswordFormSchemaProps = z.infer<typeof resetPasswordFormSchema>

type ResetPasswordFormProps = React.HTMLAttributes<HTMLFormElement> & {
  className?: string
  token: string
  email: string
}

export function ResetPasswordForm({
  className,
  token,
  email,
  ...props
}: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const router = useRouter()

  const form = useForm<ResetPasswordFormSchemaProps>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  function handleGoToLogin(email: string) {
    router.push(`/login?email=${email}`)
  }

  function handleGoToForgotPassword(email: string) {
    router.push(`/forgot-password?email=${email}`)
  }

  function handleCopyPassword() {
    const password = form.getValues('newPassword')
    if (password) {
      navigator.clipboard.writeText(password)
      showToast({
        message: 'Senha copiada para a área de transferência.',
        duration: 5000,
        variant: 'info',
      })
    } else {
      showToast({
        message: 'Falha ao copiar a senha.',
        duration: 3000,
        variant: 'error',
      })
    }
  }

  function handleGeneratePassword() {
    const password = generatePassword(16)

    form.setValue('newPassword', password)
    form.setValue('confirmPassword', password)
  }

  async function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
    setIsLoading(true)

    try {
      // check if passwords match
      if (values.newPassword !== values.confirmPassword) {
        form.setError('newPassword', {
          message: 'As senhas não coincidem.',
        })
        form.setError('confirmPassword', {
          message: 'As senhas não coincidem.',
        })
        showToast({
          message: 'As senhas não coincidem.',
          duration: 6,
          variant: 'error',
        })
        return
      }

      // reset password
      const response = await fetch(`${webserver.host}/api/v1/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: values.newPassword,
          token,
          email,
        }),
      })

      const responseBody = await response.json()

      if (response.status === 201 && responseBody) {
        // send email reset password confirmation
        await sendEmail({
          type: 'PASSWORD_RESET_CONFIRMATION',
          data: {},
          to: email,
          userId: responseBody.userId,
        })

        showToast({
          message: `Sua senha foi atualizada com sucesso!`,
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
        return
      }

      console.error('💥 Falha ao atualizar a senha.', response)
      showToast({
        message:
          'Não foi possível atualizar a senha! Token inválido ou expirado.',
        duration: Infinity,
        variant: 'error',
        firstButton: {
          text: 'Recuperar Senha',
          variant: 'default',
          onClick: () => handleGoToForgotPassword(email),
        },
      })
    } catch (error) {
      console.error(
        '💥 Falha ao enviar a solicitação de mudança de senha.',
        error,
      )

      showToast({
        message:
          'Ocorreu um erro ao tentar atualizar a senha. Por favor, tente novamente mais tarde.',
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
        {/* New Password */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="grid">
              <div className="flex items-center justify-between">
                <FormLabel>Nova Senha</FormLabel>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={'ghost'}
                    onClick={handleGeneratePassword}
                    className="text-muted-foreground/50 hover:text-muted-foreground"
                  >
                    Gerar Senha
                  </Button>
                  {field.value && (
                    <Button
                      type="button"
                      title="Copiar Senha"
                      variant={'ghost'}
                      size={'icon'}
                      onClick={handleCopyPassword}
                    >
                      <Copy
                        size={20}
                        className="text-muted-foreground/50 hover:text-muted-foreground"
                      />
                      <span className="sr-only">Copiar Senha</span>
                    </Button>
                  )}
                </div>
              </div>
              <FormControl>
                <div className="relative">
                  <Button
                    type="button"
                    title={
                      isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'
                    }
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    className="absolute right-0 text-muted-foreground/50 hover:bg-transparent hover:text-muted-foreground"
                  >
                    {isPasswordVisible ? (
                      <>
                        <Eye size={20} />
                        <span className="sr-only">Ocultar senha</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={20} />
                        <span className="sr-only">Mostrar senha</span>
                      </>
                    )}
                  </Button>
                  <Input
                    type={isPasswordVisible ? 'text' : 'password'}
                    {...field}
                    className="pr-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="grid">
              <FormLabel className="flex h-10 items-center">
                Repetir Senha
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Button
                    type="button"
                    title={
                      isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'
                    }
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    className="absolute right-0 text-muted-foreground/50 hover:bg-transparent hover:text-muted-foreground"
                  >
                    {isPasswordVisible ? (
                      <>
                        <Eye size={20} />
                        <span className="sr-only">Ocultar senha</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={20} />
                        <span className="sr-only">Mostrar senha</span>
                      </>
                    )}
                  </Button>
                  <Input
                    type={isPasswordVisible ? 'text' : 'password'}
                    {...field}
                    className="pr-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || isLoading}
          className="mt-3 w-full"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 animate-spin" /> Enviando...
            </>
          ) : (
            'Enviar nova senha'
          )}
        </Button>
      </form>
    </Form>
  )
}
