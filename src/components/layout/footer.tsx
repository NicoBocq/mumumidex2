import Link from 'next/link'

import Icon from '../custom-ui/icon'

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto flex max-w-7xl items-center justify-end p-6 lg:px-8">
        <Link
          href="https://github.com/nicobocq"
          target="_blank"
          className="inline-flex items-center text-muted-foreground hover:text-muted-foreground/80"
        >
          <Icon name="Github" margin="right" />
          nicobocq
        </Link>
      </div>
    </footer>
  )
}
