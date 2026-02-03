import type { MetadataRoute } from 'next'

import { app } from '@/config/app'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: app.name,
    short_name: app.shortName,
    description: app.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: app.color.primary,
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
