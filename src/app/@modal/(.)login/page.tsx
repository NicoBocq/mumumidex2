import SignInButton from '@/components/auth/oauth-button'
import Modal from '@/components/custom-ui/modal'
import { app } from '@/config/app'

export default function Page() {
  return (
    <Modal
      title={app.login.title}
      description={app.login.description}
      open
      footer={<SignInButton />}
    />
  )
}
