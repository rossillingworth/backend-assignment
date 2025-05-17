import { z } from "zod"

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  basePrice: z.number(),
  createdAt: z.string()
})

export const policySchema = z.object({
  id: z.string(),
  productId: z.string(),
  customerName: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  premium: z.number(),
  status: z.string(),
  createdAt: z.string()
})

export const policyWithProductSchema = policySchema.extend({
  product: productSchema
})

export type ResponseOrError<T> = [ T, null ]| [ null, Error];

export type Product = z.infer<typeof productSchema>
export type Policy = z.infer<typeof policySchema>
export type PolicyWithProduct = z.infer<typeof policyWithProductSchema>
