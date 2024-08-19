'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { webserver } from '@/infra/webserver'
import { cn } from '@/lib/shadcn-ui'
import { emailValidation, passwordValidation } from '@/schemas'
import { getDeviceInfo } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { showToast } from './ShowToast'
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
  user?: {
    id: string
    email: string
    name?: string
  }
  loginCallback?: string
}

export function LoginForm({
  className,
  user,
  loginCallback = '',
  ...props
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [emailValue] = useState(user?.email)
  const hasRunEffect = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (loginCallback === 'google' && !hasRunEffect.current) {
      // This effect is triggered when `loginCallback` equals 'google', which is set by the `handleGoogleLogin` function. `handleGoogleLogin` initiates the Google sign-in process via NextAuth, and upon successful authentication, the user is redirected back to this page with `loginCallback=google` as a query parameter. The effect ensures that `googleLoginCallback` is executed only once by using a `hasRunEffect` ref to prevent multiple executions. This is particularly important because React's strict mode and re-renders can cause effects to run more than once during development. By setting `hasRunEffect.current = true`, we make sure that `googleLoginCallback` runs only on the first render with `loginCallback=google`.

      hasRunEffect.current = true
      googleLoginCallback()
    }
  }, [loginCallback])

  const form = useForm<LoginFormSchemaProps>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: emailValue || '',
      password: '',
    },
  })

  function handleGoVerifyEmailOpt(token: string) {
    router.push(`${webserver.host}/verify-email-opt?token=${token}`)
  }

  async function submitLoginCredentials(
    values: z.infer<typeof loginFormSchema>,
  ) {
    setIsLoading(true)

    try {
      const device = await getDeviceInfo()
      const response = await fetch(
        `${webserver.host}/api/v1/auth/login/credential`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            device,
          }),
        },
      )

      const responseBody = await response.json()

      if (response.ok) {
        showToast({
          message: 'Usuário logado com sucesso!',
          duration: 5000,
          variant: 'success',
          redirect: {
            path: `${webserver.host}/`,
            countdownSeconds: 5,
          },
        })

        form.reset()
        return
      }

      if (response.status === 404 || response.status === 401) {
        showToast({
          message: 'Usuário ou Senha incorretos.',
          duration: Infinity,
          variant: 'error',
        })
        return
      }

      if (response.status === 403) {
        showToast({
          message: 'Email não verificado.',
          duration: Infinity,
          variant: 'error',
          firstButton: {
            text: 'Verificar Email Agora!',
            variant: 'default',
            onClick: () => handleGoVerifyEmailOpt(responseBody.userId),
          },
        })
        return
      }

      console.error('💥 Erro ao realizar o Login com senha e password')
    } catch (error) {
      console.error(
        '💥 Erro ao realizar o Login com senha e password - ',
        error,
      )
      showToast({
        message: 'Falha ao realizar o login.',
        duration: Infinity,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function googleLoginCallback() {
    try {
      setIsLoading(true)
      router.replace(`${webserver.host}/login`)

      const device = await getDeviceInfo()

      const response = await fetch(
        `${webserver.host}/api/v1/auth/login/google`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device,
          }),
        },
      )

      if (response.ok) {
        showToast({
          message: 'Usuário logado com sucesso!',
          duration: 5000,
          variant: 'success',
          redirect: {
            path: `${webserver.host}/`,
            countdownSeconds: 3,
          },
        })
        return
      }

      if (response.status === 404 || response.status === 403) {
        showToast({
          message:
            'Erro ao realizar o login com google. Tente realizar login com email e senha.',
          duration: Infinity,
          variant: 'error',
        })
        return
      }

      console.error('💥 Erro ao realizar o Login com google')
    } catch (error) {
      console.error('💥 Erro ao realizar o Login com google - ', error)
      showToast({
        message: 'Falha ao realizar o login com google.',
        duration: Infinity,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
      hasRunEffect.current = false
    }
  }

  async function handleGoogleLogin() {
    await signIn('google', {
      callbackUrl: `${webserver.host}/login?loginCallback=google`,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitLoginCredentials)}
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
                  href={`${webserver.host}/forgot-password`}
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
