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
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon?size=192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon?size=512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
