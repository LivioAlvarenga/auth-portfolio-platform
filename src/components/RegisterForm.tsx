'use client'

import { CreateUser } from '@/@types/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/shadcn-ui'
import {
  emailValidation,
  fullNameValidation,
  nickNameValidation,
  passwordValidation,
} from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
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

  function handleGoToLogin(email: string) {
    router.push(`/login?email=${email}`)
  }

  function handleGoToForgotPassword(email: string) {
    console.log('❗❗❗ ~ handleGoToForgotPassword', email)
  }

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    setIsLoading(true)

    try {
      const newUser: CreateUser = {
        email: values.email,
        password: values.password,
        name: values.fullName,
        nickName: values.nickName,
      }

      const response = await fetch('/api/v1/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })
      const responseBody = await response.json()

      if (!response.ok) {
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
              onClick: () => handleGoToLogin(values.email),
            },
            secondButton: {
              text: 'Recuperar Senha',
              variant: 'default',
              onClick: () => handleGoToForgotPassword(values.email),
            },
          })
          return
        }

        throw new Error(responseBody.message)
      }

      showToast({
        message: `Usuário registrado com sucesso! Para fazer login, por favor, confirme o email enviado para ${values.email}.`,
        duration: Infinity,
        variant: 'success',
        firstButton: {
          text: 'Fazer Login Agora',
          variant: 'default',
          onClick: () => handleGoToLogin(values.email),
        },
        redirect: {
          path: `/login?email=${values.email}`,
          countdownSeconds: 7,
        },
      })

      form.reset()
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
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Button
                    type="button"
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
          {isLoading ? 'Carregando...' : 'Registrar'}
        </Button>
      </form>
    </Form>
  )
}
