import { getForecast } from '@/actions/forecast'

// Define color palettes based on Misery Level (0-4)
const THEMES = [
  // Level 0: Tranquille (Cool Blue/Teal)
  {
    bg: 'bg-teal-50 dark:bg-slate-950',
    blobs: [
      'bg-teal-300 dark:bg-emerald-900',
      'bg-cyan-300 dark:bg-cyan-900',
      'bg-emerald-300 dark:bg-teal-900',
    ],
  },
  // Level 1: Bof (Yellow/Amber)
  {
    bg: 'bg-amber-50 dark:bg-slate-950',
    blobs: [
      'bg-amber-300 dark:bg-yellow-900',
      'bg-yellow-300 dark:bg-amber-900',
      'bg-orange-300 dark:bg-orange-900',
    ],
  },
  // Level 2: Galère (Orange/Red)
  {
    bg: 'bg-orange-50 dark:bg-slate-950',
    blobs: [
      'bg-orange-400 dark:bg-orange-900',
      'bg-amber-500 dark:bg-red-900',
      'bg-red-300 dark:bg-amber-800',
    ],
  },
  // Level 3: Enfer (Red/Purple)
  {
    bg: 'bg-rose-50 dark:bg-slate-950',
    blobs: [
      'bg-red-500 dark:bg-red-900',
      'bg-rose-500 dark:bg-rose-900',
      'bg-orange-500 dark:bg-orange-900',
    ],
  },
  // Level 4: Apocalypse (Purple/Black)
  {
    bg: 'bg-slate-900 dark:bg-black',
    blobs: [
      'bg-purple-600 dark:bg-purple-900',
      'bg-indigo-600 dark:bg-indigo-900',
      'bg-violet-600 dark:bg-violet-900',
    ],
  },
]

function getMiseryLevel(score: number): number {
  if (score < 10) return 0
  if (score < 25) return 1
  if (score < 40) return 2
  if (score < 60) return 3
  return 4
}

export default async function Background() {
  const { data } = await getForecast()

  // Find the worst misery index to determine the theme
  const worstMisery = data.length > 0 ? Math.max(...data.map((f) => f.current.miseryIndex)) : 0 // Default to 0 if no cities

  const level = getMiseryLevel(worstMisery)
  const theme = THEMES[level]

  return (
    <div
      className={`fixed inset-0 -z-50 overflow-hidden transition-colors duration-1000 ${theme.bg}`}
    >
      <div
        className={`absolute -left-[10%] -top-[10%] h-[70vh] w-[70vw] animate-aurora-1 rounded-full opacity-60 blur-[120px] filter transition-colors duration-1000 ${theme.blobs[0]}`}
      />
      <div
        className={`absolute -right-[10%] top-[20%] h-[60vh] w-[60vw] animate-aurora-2 rounded-full opacity-60 blur-[120px] filter transition-colors duration-1000 ${theme.blobs[1]}`}
      />
      <div
        className={`absolute -bottom-[20%] left-[20%] h-[70vh] w-[70vw] animate-aurora-3 rounded-full opacity-60 blur-[120px] filter transition-colors duration-1000 ${theme.blobs[2]}`}
      />
    </div>
  )
}
