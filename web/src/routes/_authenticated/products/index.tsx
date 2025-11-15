import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Products } from '@/features/products'

const productsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  stock: z
    .union([
      // Handle comma-separated string
      z.string().transform((val) => {
        if (!val || val.trim() === '') return []
        return val
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
      }),
      // Handle array directly
      z.array(z.string()),
    ])
    .optional()
    .catch([]),
  category: z
    .union([
      // Handle comma-separated string
      z.string().transform((val) => {
        if (!val || val.trim() === '') return []
        return val
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
      }),
      // Handle array directly
      z.array(z.string()),
    ])
    .optional()
    .catch([]),
  // Per-column text filter (example for product name)
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/products/')({
  validateSearch: productsSearchSchema,
  component: Products,
})
