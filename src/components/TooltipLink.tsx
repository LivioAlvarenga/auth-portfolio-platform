'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/shadcn-ui'
import React, { ReactNode, useEffect, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

interface TooltipLinkProps {
  href: string
  title: string
  className?: string
  children: ReactNode
}

export const TooltipLink: React.FC<TooltipLinkProps> = ({
  href,
  title,
  className = '',
  children,
}) => {
  const pathname = usePathname()
  const [relativeHref, setRelativeHref] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRelativeHref(new URL(href, window.location.origin).pathname)
    }
  }, [href])
  const isActive = pathname === relativeHref

  const linkClassName = isActive
    ? 'bg-accent text-accent-foreground'
    : 'text-muted-foreground'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              'flex h-9 w-9 animate-fadeIn items-center justify-center rounded-lg transition-colors duration-700 hover:text-foreground md:h-8 md:w-8',
              linkClassName,
              className,
            )}
          >
            {children}
            <span className="sr-only">{title}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
