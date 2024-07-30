import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

const env = process.env.NODE_ENV

export default function Icon() {
  const colorDict = {
    development: 'yellow',
    production: 'transparent',
    preview: 'green',
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: colorDict[env as keyof typeof colorDict] || 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f59e0b',
          fontFamily: 'cursive',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#f59e0b"
          stroke="#78350f"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  )
}
