'use client'

import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  icon?: LucideIcon
  title: string
  description?: string
  className?: string
}

export function PageHeader({ icon: Icon, title, description, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {Icon && (
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-2">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      )}
      <h1 className="text-2xl font-semibold tracking-tight text-center">{title}</h1>
      {description && <p className="text-sm text-muted-foreground text-center">{description}</p>}
    </div>
  )
}