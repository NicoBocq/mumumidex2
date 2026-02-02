import { ArrowLeft } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import OAuthButton from '@/components/auth/oauth-button'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { app } from '@/config/app'
import { auth } from '@/lib/auth'
import { cn } from '@/lib/utils'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect('/')
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <div className="flex flex-col gap-4 min-w-lg">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'self-start')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
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
    </div>
  )
}
