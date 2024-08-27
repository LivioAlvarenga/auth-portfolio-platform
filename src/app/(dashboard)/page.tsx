import { Text } from '@/components/Text'
import { serverProtectedRoute } from '@/lib/authjs/serverProtectedRoute'
import { transformTextIntoCapitalized } from '@/utils/textUtils'

export default async function Dashboard() {
  const session = await serverProtectedRoute()

  return (
    <div className="">
      <Text as="h1" variant={'headline-24-45-700'}>
        {`Olá, ${transformTextIntoCapitalized(session?.user?.name)}!`}
      </Text>
    </div>
  )
}
