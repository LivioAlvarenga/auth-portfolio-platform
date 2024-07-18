import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleIcon } from './svg/google-icon'

export function LoginForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>
          Insira seu e-mail abaixo para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu_email@exemplo.com.br"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="#"
                className="ml-auto inline-block rounded-sm text-sm underline ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
          <Button variant="outline" className="w-full">
            <GoogleIcon className="mr-4 w-5" />
            Entrar com Google
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-center text-sm">
          Não tem uma conta?{' '}
          <Button asChild variant="link">
            <Link href="#" className="underline">
              Cadastre-se
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
