import Link from 'next/link'

import Icon from '../custom-ui/icon'
import { buttonVariants } from '../ui/button'

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Forecast API:{' '}
          <Link
            href="https://open-meteo.com/"
            target="_blank"
            className={buttonVariants({ variant: 'inline-link', size: 'inline-link' })}
          >
            Open Meteo
          </Link>
        </p>
        <Link
          href="https://github.com/nicobocq"
          target="_blank"
          className={buttonVariants({ variant: 'inline-link', size: 'inline-link' })}
        >
          <Icon name="Github" margin="right" />
          nicobocq
        </Link>
      </div>
    </footer>
  )
}
