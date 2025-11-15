import { z } from 'zod'

// Schema matching the backend pgTable definition
export const productsSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
  name: z.string().max(255),
  category: z.string().max(100),
  price: z.number().positive().or(z.string()),
  quantity: z.number().int().min(0),
  imageUrl: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Product = z.infer<typeof productsSchema>
