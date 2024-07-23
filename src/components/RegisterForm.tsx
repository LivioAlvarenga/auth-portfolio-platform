'use client'

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
import { CheckCircle2, Eye, EyeOff, XCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
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

  const form = useForm<RegisterFormSchemaProps>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: '',
      nickName: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    setIsLoading(true)

    try {
      console.log('💌💌💌 - ', values)
      // const response = await fetch(`/api/...`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     fullName: values.fullName,
      //     nickName: values.nickName,
      //     email: values.email,
      //     password: values.password,
      //   }),
      // })

      // if (!response.ok) {
      //   throw new Error('Falha ao registrar.')
      // }

      toast('Usuário registrado com sucesso.', {
        className:
          'flex items-center justify-start space-x-1 bg-card text-card-foreground border border-border',
        duration: 4000,
        icon: <CheckCircle2 className="mr-10 fill-green-600 text-card" />,
        closeButton: true,
        classNames: {
          closeButton: 'bg-background border-border hover:dark:text-background',
        },
      })

      // form.reset()
      // redirect to login
    } catch (error) {
      console.error('💥 Erro ao registrar usuário', error)
      toast('Falha ao registrar usuário.', {
        className:
          'flex items-center justify-start space-x-1 bg-card text-card-foreground border border-border',
        duration: 5000,
        icon: <XCircle className="mr-10 fill-red-500 text-card" />,
        closeButton: true,
        classNames: {
          closeButton: 'bg-background border-border hover:dark:text-background',
        },
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
