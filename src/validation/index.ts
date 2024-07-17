import { z } from 'zod'

export const nanoidSchema = z.string().nanoid()

export const bindIdSchema: z.ZodString = nanoidSchema
