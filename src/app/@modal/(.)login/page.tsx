import SignInButton from '@/components/auth/oauth-button'
import Modal from '@/components/custom-ui/modal'

export default function Page() {
  return (
    <Modal
      title="Log in"
      description="Customize forecast list and many more to come (or not)!"
      open
      footer={<SignInButton />}
    />
  )
}
