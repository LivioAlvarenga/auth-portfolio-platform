'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/shadcn-ui'
import { emailValidation, passwordValidation } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Eye, EyeOff, LoaderCircle, XCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { GoogleIcon } from './svg/google-icon'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'

const loginFormSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
})

type LoginFormSchemaProps = z.infer<typeof loginFormSchema>

type LoginFormProps = React.HTMLAttributes<HTMLFormElement> & {
  className?: string
  email?: string
}

export function LoginForm({ className, email, ...props }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [emailValue] = useState(email)
  // const session = useSession()
  // console.log('🔑🔑🔑 - status', session.status, 'data', session.data)

  const form = useForm<LoginFormSchemaProps>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: emailValue || '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsLoading(true)

    try {
      console.log('💌💌💌 - ', values)
      // const response = await fetch(`/api/...`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: values.email,
      //     password: values.password,
      //   }),
      // })

      // if (!response.ok) {
      //   throw new Error('Falha ao realizar login.')
      // }

      // send this data to auth.ts in Credentials provider authorize(credentials) {}
      signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: '/',
      })

      toast('Login realizado com sucesso!', {
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
      // redirect to home
    } catch (error) {
      console.error(
        '💥 Erro ao realizar o Login com senha e password - ',
        error,
      )
      toast('Falha ao realizar login.', {
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

  async function handleGoogleLogin() {
    console.log('🔑🔑🔑 - Login com Google')
    await signIn('google')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-4', className)}
        {...props}
      >
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <div className="flex items-center">
                <FormLabel>Senha</FormLabel>
                <Link
                  href="#"
                  className="ml-auto inline-block rounded-sm text-[14px] leading-[20px] tracking-[0.1px] underline ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
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
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 animate-spin" /> Carregando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>

        {/* Login with Google */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          type="button"
        >
          <GoogleIcon className="mr-4 w-5" />
          {isLoading ? 'Carregando...' : 'Entrar com Google'}
        </Button>
      </form>
    </Form>
  )
}
