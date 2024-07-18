import { z } from 'zod'

import { nanoidSchema } from '.'

export const linkOAuthAccountSchema = z.object({
  userId: nanoidSchema,
})

export type LinkOAuthAccountInput = z.infer<typeof linkOAuthAccountSchema>
