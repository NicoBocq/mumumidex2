import {
  LinkOAuthAccountInput,
  linkOAuthAccountSchema,
} from '@/validation/auth'

import prisma from '@/config/db'
import { actionClient } from '@/lib/safe-action'

// export const linkOAuthAccount = actionClient
// .schema(linkOAuthAccountSchema)
// .action(async ({parsedInput}) => {
//   try {
//     await prisma.user.update({
//       where: {
//         id: parsedInput.userId,
//       },
//       data: {
//         emailVerified: new Date(),
//       },
//     })
//   } catch (error) {
//     console.error(error)
//     throw new Error("Error linking OAuth account")
//   }
// })
export async function linkOAuthAccount(
  rawInput: LinkOAuthAccountInput,
): Promise<void> {
  try {
    const validatedInput = linkOAuthAccountSchema.safeParse(rawInput)
    if (!validatedInput.success) return

    await prisma.user.update({
      where: {
        id: validatedInput.data.userId,
      },
      data: {
        emailVerified: new Date(),
      },
    })
  } catch (error) {
    console.error(error)
    throw new Error('Error linking OAuth account')
  }
}
