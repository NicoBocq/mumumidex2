import Link from 'next/link'

import Icon from '../custom-ui/icon'
import { Button, buttonVariants } from '../ui/button'

export default function Header() {
  return (
    <div className="flex h-[64px] items-center justify-between">
      <Link href="/">
        <h1 className="inline-flex items-center text-xl font-extrabold">
          mumu
          <span className="text-primary">midex</span>
        </h1>
      </Link>
      <div className="flex items-center gap-4 animate-in slide-in-from-top">
        <Link
          href="/add"
          className={buttonVariants({ variant: 'ghostPrimary' })}
          scroll={false}
        >
          add
          <Icon name="Plus" />
        </Link>
        {/* <Button variant="outline" size="icon">
          <Icon name="Settings" />
        </Button> */}
      </div>
    </div>
  )
}
