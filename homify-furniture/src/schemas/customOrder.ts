// /lib/validators/order.ts
import { z } from "zod";

export const customOrderSchema = z.object({
  customerName: z.string().min(1, "customerName is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().optional(),

  description: z.string().optional(),
  category: z.string().min(1),

  budgetMin: z.number().nullable().optional(),
  budgetMax: z.number().nullable(),

  dimensions: z.string().optional(),
  materialPreference: z.string().optional(),
  colorPreference: z.string().optional(),

  images: z.array(z.string()).optional(),
});