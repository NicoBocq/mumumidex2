import prisma from '@/config/db'

export const getUser = async (id: string) => {
  try {
    const response = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        locations: true,
      },
    })
    return {
      data: response,
    }
  } catch (error) {
    console.error(error)
    return {
      error: 'Error fetching location',
    }
  }
}

export const updateUserLocations = async (id: string, locations: string[]) => {
  try {
    const response = await prisma.user.update({
      where: {
        id,
      },
      data: {
        locations: {
          connect: locations.map((location) => ({ id: location })),
        },
      },
    })
    return {
      data: response,
    }
  } catch (error) {
    console.error(error)
    return {
      error: 'Error updating user locations',
    }
  }
}
