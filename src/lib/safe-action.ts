import { auth } from '@/lib/auth'
import { DEFAULT_SERVER_ERROR_MESSAGE, createSafeActionClient } from 'next-safe-action'
import { headers } from 'next/headers'
import { z } from 'zod'

class ActionError extends Error {}

const metadataSchema = z.object({
  actionName: z.string(),
})

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: 'flattened',
  handleServerError: (e) => {
    if (e instanceof ActionError) {
      return e.message
    }
    return DEFAULT_SERVER_ERROR_MESSAGE
  },
  defineMetadataSchema: () => metadataSchema,
})

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    throw new ActionError('You need to be logged in to perform this action')
  }
  return next({ ctx: { id: session.user.id } })
})
