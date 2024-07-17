import { auth } from '@/auth'
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action'
import { z } from 'zod'

class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    console.log(e)
    if (e instanceof ActionError) {
      return e.message
    }
    return DEFAULT_SERVER_ERROR_MESSAGE
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    })
  },
})

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return next({ ctx: { id: session.user.id } })
})
