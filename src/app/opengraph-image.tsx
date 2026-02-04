import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export const alt = 'mmdex'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  const fontData = readFileSync(join(process.cwd(), 'public/fonts/Rubik-Bold.ttf'))

  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(to bottom right, #09090b, #000000)', // Darker background (zinc-950 to black)
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: 'Rubik', // Use Rubik to match site
      }}
    >
      {/* Abstract background elements for depth */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(0,0,0,0) 70%)', // humidex-3 glow
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.1) 0%, rgba(0,0,0,0) 70%)', // humidex-4 glow
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 160,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            letterSpacing: '-0.05em',
            color: '#ffffff',
          }}
        >
          <span>mm</span>
          <span style={{ color: '#f59e0b' }}>°</span> {/* humidex-3 degree */}
          <span
            style={{
              background: 'linear-gradient(to right, #f59e0b, #ea580c)', // humidex-3 to humidex-4 gradient text
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            dex
          </span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#a1a1aa', // zinc-400
            marginTop: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Rank the real feel
        </div>
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
