import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import OAuthButton from '@/components/auth/oauth-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { app } from '@/config/app'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
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
