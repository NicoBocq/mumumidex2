'use server'

import { actionClient } from "@/lib/safe-action";

import { z } from "zod";

const citySchema = z.string()

export const findCity = actionClient.schema(citySchema).action(async ({parsedInput: search}) => {
  if (search.length < 3) {
    return 
  }
  try {
    const response = await fetch(`${process.env.API_URL}/search?q=${search}`)
    const data = await response.json()
    return data
  } catch (error) {
    return {
      error: error as Error
    }
  }
})
