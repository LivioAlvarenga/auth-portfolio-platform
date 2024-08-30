'use client'

import { webserver } from '@/infra/webserver'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb'

interface BreadcrumbNavigatorProps {
  className?: string
}

const routeMap: { [key: string]: string } = {
  dashboard: 'Home',
  'account-management': 'Gerenciamento da Conta',
  settings: 'Configurações',
  // Add more routes here
}

export const BreadcrumbNavigator: React.FC<BreadcrumbNavigatorProps> = ({
  className = '',
}) => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter((segment) => segment)

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {pathSegments.length === 0 ? (
          <BreadcrumbItem>
            <BreadcrumbPage>{routeMap['dashboard']}</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={webserver.host}>{routeMap['dashboard']}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {pathSegments.map((segment, index) => {
          const href = `${webserver.host}/${pathSegments.slice(0, index + 1).join('/')}`
          const isLastSegment = index === pathSegments.length - 1
          const displayName =
            routeMap[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1)

          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLastSegment ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{displayName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
