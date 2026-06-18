import { z } from "zod";

export const productInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required.")
    .max(160, "Product name must be 160 characters or less."),
  campaign_id: z.string().trim().nullable(),
  source_url: z.string().trim().url("Source URL must be valid.").nullable(),
  image_url: z.string().trim().url("Image URL must be valid.").nullable(),
  price: z.number().min(0, "Price must be zero or greater.").nullable(),
  currency: z.string().trim().min(1).max(12),
  description: z.string().trim().nullable(),
  ai_score: z.number().min(0).max(100).nullable(),
});

export type ProductInput = z.infer<typeof productInputSchema>;
