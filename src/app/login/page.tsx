import { redirect } from 'next/navigation'
import { auth } from '@/auth'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import OAuthButton from '@/components/auth/oauth-button'

export default async function Page() {
  const session = await auth()
  if (session) redirect('/')
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <Card className="w-full max-w-sm border-0 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Login</CardTitle>
          <CardDescription>Login to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthButton />
        </CardContent>
      </Card>
    </div>
  )
}
