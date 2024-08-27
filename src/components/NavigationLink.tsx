'use client'

import { cn } from '@/lib/shadcn-ui'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'

interface NavigationLinkProps extends LinkProps {
  href: string
  title: string
  className?: string
  children: ReactNode
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  title,
  className = '',
  children,
  ...props
}) => {
  const pathname = usePathname()

  const relativeHref = new URL(href, window.location.origin).pathname
  const isActive = pathname === relativeHref

  const linkClassName = isActive
    ? 'text-foreground'
    : 'text-muted-foreground hover:text-foreground'

  return (
    <Link
      href={href}
      className={cn('flex items-center gap-4 px-2.5', linkClassName, className)}
      title={title}
      {...props}
    >
      {children}
      {title}
    </Link>
  )
}
