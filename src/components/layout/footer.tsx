import Link from 'next/link'

import Icon from '../custom-ui/icon'

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto flex max-w-7xl items-center justify-end px-4 py-2 lg:px-8">
        <Link
          href="https://github.com/nicobocq"
          target="_blank"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-muted-foreground/80"
        >
          <Icon name="Github" margin="right" />
          nicobocq
        </Link>
      </div>
    </footer>
  )
}
