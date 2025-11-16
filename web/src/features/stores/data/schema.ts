import { z } from 'zod'

// Schema matching the backend pgTable definition
const storesSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(255),
  location: z.string().max(255),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Store = z.infer<typeof storesSchema>
