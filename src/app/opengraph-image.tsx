import { ImageResponse } from 'next/og'

import { app } from '@/config/app'

export const runtime = 'edge'

export const alt = app.name
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  const rubikBold = fetch(
    new URL('/public/fonts/Rubik-Bold.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#f59e0b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <span>{app.shortName}</span>
        <span style={{ fontSize: 64 }}>{app.tagline}</span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Rubik',
          data: await rubikBold,
          style: 'normal',
        },
      ],
    },
  )
}
