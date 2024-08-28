import { Text } from '@/components/Text'
import { serverProtectedRoute } from '@/lib/authjs/serverProtectedRoute'

export default async function Profile() {
  const session = await serverProtectedRoute()

  return (
    <div className="">
      <Text as="h1" variant={'headline-24-45-700'}>
        Você esta em gerenciamento de conta!
      </Text>
    </div>
  )
}