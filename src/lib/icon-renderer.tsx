import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

const ACCENT = '#f59e0b'

export function renderIconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    .letter { fill: #09090b; font-family: system-ui, -apple-system, sans-serif; font-weight: 900; }
    .degree { fill: ${ACCENT}; font-family: system-ui, -apple-system, sans-serif; font-weight: 900; }
    @media (prefers-color-scheme: dark) {
      .letter { fill: #ffffff; }
    }
  </style>
  <text x="50%" y="72%" text-anchor="middle" font-size="20">
    <tspan class="letter">m</tspan><tspan class="degree">&#176;</tspan>
  </text>
</svg>`
}

export function renderIcon(size: number) {
  const fontData = readFileSync(join(process.cwd(), 'public/fonts/Rubik-Bold.ttf'))

  return new ImageResponse(
    <div
      style={{
        fontSize: size * 0.65,
        background: 'linear-gradient(to bottom right, #09090b, #000000)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontFamily: 'Rubik',
        color: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span>m</span>
        <span style={{ color: ACCENT }}>°</span>
      </div>
    </div>,
    {
      width: size,
      height: size,
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
