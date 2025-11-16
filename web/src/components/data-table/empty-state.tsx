import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface EmptyStateProps {
  title?: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  imageClassName?: string
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: ReactNode
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
  }

  secondaryAction?: {
    label: string
    onClick: () => void
    icon?: ReactNode
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
  }
  children?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showImage?: boolean
}

export function EmptyState({
  title = 'No results found',
  description = "Try adjusting your search or filters to find what you're looking for.",
  imageSrc = '/images/empty.png',
  imageAlt = 'No results',
  imageClassName,
  primaryAction,
  secondaryAction,
  children,
  className,
  size = 'md',
  showImage = true,
}: EmptyStateProps) {
  const sizeConfig = {
    sm: {
      container: 'py-6',
      image: 'h-32 w-32',
      title: 'text-base',
      description: 'text-xs',
      spacing: 'space-y-2',
    },
    md: {
      container: 'py-12',
      image: 'h-48 w-48',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-4',
    },
    lg: {
      container: 'py-16',
      image: 'h-64 w-64',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-6',
    },
  }

  const config = sizeConfig[size]

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center text-center',
        config.container,
        className
      )}
    >
      <div className={cn('flex flex-col items-center', config.spacing)}>
        {showImage && (
          <div className='relative'>
            <img
              src={imageSrc}
              alt={imageAlt}
              className={cn(
                'object-contain opacity-50 transition-opacity hover:opacity-75',
                config.image,
                imageClassName
              )}
            />
          </div>
        )}

        <div className={cn('flex flex-col items-center', config.spacing)}>
          <h3
            className={cn(
              'text-foreground font-semibold tracking-tight',
              config.title
            )}
          >
            {title}
          </h3>
          {description && (
            <p
              className={cn(
                'text-muted-foreground mx-auto max-w-md text-center',
                config.description
              )}
            >
              {description}
            </p>
          )}
        </div>

        {children}

        {(primaryAction || secondaryAction) && (
          <div className='flex flex-wrap items-center justify-center gap-3'>
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                variant={primaryAction.variant || 'default'}
                className='gap-2'
              >
                {primaryAction.icon}
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant={secondaryAction.variant || 'outline'}
                className='gap-2'
              >
                {secondaryAction.icon}
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
