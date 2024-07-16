import Link from 'next/link'

import Icon from '../custom-ui/icon'

export default function Footer() {
  return (
    <footer className="flex h-10 items-center justify-end text-sm">
      <Link
        href="https://github.com/nicobocq"
        target="_blank"
        className="inline-flex items-center text-muted-foreground hover:text-muted-foreground/80"
      >
        <Icon name="Github" margin="right" />
        nicobocq
      </Link>
    </footer>
  )
}
