'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { webserver } from '@/infra/webserver'
import { cn } from '@/lib/shadcn-ui'
import { emailValidation } from '@/schemas'
import { getDeviceInfo } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoadingScreen } from './LoadingScreen'
import { showToast } from './ShowToast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'

const magicLinkFormSchema = z.object({
  email: emailValidation,
})

type MagicLinkFormSchemaProps = z.infer<typeof magicLinkFormSchema>

type MagicLinkFormProps = React.HTMLAttributes<HTMLFormElement> & {
  className?: string
  token?: {
    identifier: string
    token: string
    token_type?: string
    expires: string
  }
}

export function MagicLinkForm({
  className,
  token,
  ...props
}: MagicLinkFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const hasRunEffect = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (token && !hasRunEffect.current) {
      hasRunEffect.current = true
      magicLinkLoginCallback()
    }
  }, [token])

  const form = useForm<MagicLinkFormSchemaProps>({
    resolver: zodResolver(magicLinkFormSchema),
    defaultValues: {
      email: '',
    },
  })

  async function magicLinkLoginCallback() {
    setIsPageLoading(true)
    router.replace(`${webserver.host}/login/magic-link`)

    try {
      const device = await getDeviceInfo()

      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/magic-link/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            device,
          }),
        },
      )

      if (response.ok) {
        showToast({
          message: 'Usuário logado com sucesso!',
          duration: 3000,
          variant: 'success',
          redirect: {
            path: `${webserver.host}/`,
            countdownSeconds: 2,
          },
        })
        return
      }

      if (response.status === 404) {
        showToast({
          message:
            'Erro ao realizar o login com email. Tente realizar login com email e senha.',
          duration: Infinity,
          variant: 'error',
        })
        return
      }

      console.error('💥 Erro ao realizar o Login com email')
    } catch (error) {
      console.error('💥 Erro ao realizar o Login com email - ', error)
      showToast({
        message: 'Falha ao realizar o login com email.',
        duration: Infinity,
        variant: 'error',
      })
    } finally {
      setIsPageLoading(false)
      hasRunEffect.current = false
    }
  }

  async function onSubmit(values: z.infer<typeof magicLinkFormSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch(
        `${webserver.host}/api/v1/public/auth/login/magic-link/request`,
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
          message: `E-mail enviado para ${values.email} com um link de acesso à sua conta. Verifique sua caixa de entrada ou spam.`,
          duration: Infinity,
          variant: 'success',
        })

        form.reset()
        return
      }

      console.error(
        '💥 Não foi possível enviar o link de acesso. Tente novamente mais tarde ou utilize outro método de login.',
        response,
      )

      showToast({
        message:
          'Não foi possível enviar o link de acesso. Tente novamente mais tarde ou utilize outro método de login.',
        duration: Infinity,
        variant: 'error',
      })
    } catch (error) {
      console.error(
        '💥 Não foi possível enviar o link de acesso. Tente novamente mais tarde ou utilize outro método de login.',
        error,
      )

      showToast({
        message:
          'Não foi possível enviar o link de acesso. Tente novamente mais tarde ou utilize outro método de login.',
        duration: Infinity,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Page loading */}
      {isPageLoading && <LoadingScreen />}

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
              'Enviar link de acesso'
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
