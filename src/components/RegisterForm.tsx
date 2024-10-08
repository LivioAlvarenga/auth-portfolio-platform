'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { webserver } from '@/infra/webserver'
import { cn } from '@/lib/shadcn-ui'
import {
  emailValidation,
  fullNameValidation,
  nickNameValidation,
  passwordValidation,
} from '@/schemas'
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

const registerFormSchema = z.object({
  fullName: fullNameValidation,
  nickName: nickNameValidation,
  email: emailValidation,
  password: passwordValidation,
})

type RegisterFormSchemaProps = z.infer<typeof registerFormSchema>

type RegisterFormProps = React.HTMLAttributes<HTMLFormElement> & {
  className?: string
}

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterFormSchemaProps>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: '',
      nickName: '',
      email: '',
      password: '',
    },
  })

  function handleGoToLogin(userId: string) {
    router.push(`${webserver.host}/login?token=${userId}`)
  }

  function handleGoVerifyEmailOpt(userId: string) {
    router.push(`${webserver.host}/verify-email-opt?token=${userId}`)
  }

  function handleGoToForgotPassword() {
    router.push(`${webserver.host}/forgot-password`)
  }

  function handleCopyPassword() {
    const password = form.getValues('password')
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
    form.setValue('password', password)
  }

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            name: values.fullName,
            nick_name: values.nickName,
          }),
        },
      )
      const responseBody = await response.json()

      if (response.status === 201 && responseBody) {
        // Create opt token and send email verification
        await fetch(`${webserver.host}/api/v1/public/auth/verify-email-opt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: responseBody.userId,
          }),
        })

        if (responseBody.emailVerified) {
          showToast({
            message: 'Usuário registrado com sucesso!',
            duration: Infinity,
            closeButton: false,
            variant: 'success',
            firstButton: {
              text: 'Fazer Login Agora!',
              variant: 'default',
              onClick: () => handleGoToLogin(responseBody.userId),
            },
            redirect: {
              path: `${webserver.host}/login?token=${responseBody.userId}`,
              countdownSeconds: 2,
            },
          })
        } else {
          showToast({
            message: `Usuário registrado com sucesso! Para fazer login, por favor, confirme o email enviado para ${values.email}.`,
            duration: Infinity,
            variant: 'success',
            firstButton: {
              text: 'Verificar Email Agora!',
              variant: 'default',
              onClick: () => handleGoVerifyEmailOpt(responseBody.userId),
            },
            redirect: {
              path: `${webserver.host}/verify-email-opt?token=${responseBody.userId}`,
              countdownSeconds: 5,
            },
          })
        }

        form.reset()
        return
      }

      if (responseBody.message === 'E-mail já cadastrado.') {
        form.setError('email', {
          message: 'E-mail já cadastrado.',
        })

        showToast({
          message:
            'Este email já se encontra cadastrado. Por favor, utilize outro email ou recupere a senha se necessário.',
          duration: Infinity,
          variant: 'warning',
          firstButton: {
            text: 'Fazer Login',
            variant: 'ghost',
            onClick: () => handleGoToLogin(responseBody.userId),
          },
          secondButton: {
            text: 'Recuperar Senha',
            variant: 'default',
            onClick: () => handleGoToForgotPassword(),
          },
        })
        return
      }

      throw new Error(responseBody.message)
    } catch (error) {
      console.error('💥 Falha ao registrar usuário.', error)

      showToast({
        message: 'Falha ao registrar usuário.',
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
          name="fullName"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="name"
                  placeholder="Digite seu nome completo"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nick Name */}
        <FormField
          control={form.control}
          name="nickName"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel>Como quer ser chamado?</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="name"
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <div className="flex items-center justify-between">
                <FormLabel>Senha</FormLabel>
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
            'Registrar'
          )}
        </Button>
      </form>
    </Form>
  )
}
