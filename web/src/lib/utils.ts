import { type ClassValue, clsx } from 'clsx'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import updateLocale from 'dayjs/plugin/updateLocale.js'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5 // Maximum number of page buttons to show
  const rangeWithDots = []

  if (totalPages <= maxVisiblePages) {
    // If total pages is 5 or less, show all pages
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i)
    }
  } else {
    // Always show first page
    rangeWithDots.push(1)

    if (currentPage <= 3) {
      // Near the beginning: [1] [2] [3] [4] ... [10]
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end: [1] ... [7] [8] [9] [10]
      rangeWithDots.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i)
      }
    } else {
      // In the middle: [1] ... [4] [5] [6] ... [10]
      rangeWithDots.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    }
  }

  return rangeWithDots
}

function numberWithCommas(x: number | string, convert: boolean = false) {
  if (typeof x === 'string') {
    // Handle string input (like "300.30")
    const cleanValue = x.replace(/[^\d.]/g, '')
    if (!cleanValue) return ''
    if (cleanValue === '.') return '0.'

    // Split into integer and decimal parts
    const parts = cleanValue.split('.')
    const integerPart = parts[0] || '0'
    const decimalPart = parts[1]

    // Format the integer part with commas
    const formattedInteger = parseInt(integerPart).toLocaleString('en-US')

    // Return with or without decimal part
    if (parts.length > 1) {
      return formattedInteger + '.' + (decimalPart || '')
    }

    return formattedInteger
  }

  // Handle number input (original logic)
  if (isNaN(x as number)) return 0
  const value: any = (convert ? (x as number) / 100 : x).toLocaleString('en-US')
  return value
}

export function dateToRelativeTimeFormat(date?: string) {
  if (!date) date = undefined
  dayjs.updateLocale('en', {
    relativeTime: {
      ...dayjs.Ls['en'].relativeTime,
      future: 'now',
      past: '%s ago',
      s: '1s',
      m: '1m',
      h: '1h',
      d: '1d',
      y: '1y',
      ss: (n: any) => `${numberWithCommas(n)}s`,
      mm: (n: any) => `${numberWithCommas(n)}m`,
      hh: (n: any) => `${numberWithCommas(n)}h`,
      dd: (n: any) => `${numberWithCommas(n)}d`,
      yy: (n: any) => `${numberWithCommas(n)}y`,
    },
  })
  return dayjs(date).fromNow(true)
}
