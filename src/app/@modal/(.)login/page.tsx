import SignInButton from '@/components/auth/oauth-button'
import { ResponsiveDrawer } from '@/components/custom-ui/responsive-drawer'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <ResponsiveDrawer open trigger={<Button>Login</Button>}>
      <SignInButton />
    </ResponsiveDrawer>
  )
}
