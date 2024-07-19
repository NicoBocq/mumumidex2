import React from 'react'

import Modal from '@/components/custom-ui/modal'
import UserLocationForm, {
  UserCitiesFormSkeleton,
} from '@/components/user/cities-form'

export default async function Page() {
  return (
    <Modal
      open
      title="Cities settings"
      description="Manage the cities you want to show in your humidex rankings"
    >
      <React.Suspense fallback={<UserCitiesFormSkeleton />}>
        <UserLocationForm />
      </React.Suspense>
    </Modal>
  )
}
