import { Text } from '@/components/Text'
import TwoFactorAuthSwitch from '@/components/TwoFactorAuthSwitch'
import { serverProtectedRoute } from '@/lib/authjs/serverProtectedRoute'

export default async function AccountManagement() {
  const session = await serverProtectedRoute()

  return (
    <div className="flex flex-col gap-3">
      <Text
        as="h1"
        variant="headline-24-45-700"
        className="mx-auto max-w-3xl text-pretty py-5 text-center lg:py-6"
      >
        Gerencie Suas Configurações de Conta e Segurança
      </Text>
      <TwoFactorAuthSwitch />
    </div>
  )
}
