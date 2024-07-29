import { redirect } from 'next/navigation'
import { auth } from '@/auth'

import { app } from '@/config/app'
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
          <CardTitle className="text-primary">{app.login.title}</CardTitle>
          <CardDescription>{app.login.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthButton />
        </CardContent>
      </Card>
    </div>
  )
}
