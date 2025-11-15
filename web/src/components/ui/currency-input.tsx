import CurrencyInput from 'react-currency-input-field'
import { cn } from '@/lib/utils'

interface CurrencyInputProps
  extends React.ComponentProps<typeof CurrencyInput> {
  error?: boolean
}

export default function CurrencyyInput({
  error,
  className,
  ...props
}: CurrencyInputProps) {
  return (
    <CurrencyInput
      decimalsLimit={2}
      allowNegativeValue={false}
      className={cn(
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        error &&
          'ring-destructive/20 dark:ring-destructive/40 border-destructive',
        className
      )}
      {...props}
    />
  )
}
