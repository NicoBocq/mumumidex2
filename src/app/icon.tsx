import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  const fontData = readFileSync(join(process.cwd(), 'public/fonts/Rubik-Bold.ttf'))

  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: 'linear-gradient(to bottom right, #09090b, #000000)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontFamily: 'Rubik',
        color: 'white',
        borderRadius: '20%', // Rounded square for icon
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-2px',
        }}
      >
        <span>m</span>
        <span style={{ color: '#f59e0b' }}>°</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'Rubik',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
