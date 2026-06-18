import { z } from "zod";

export const affiliateLinkInputSchema = z.object({
  product_id: z.string().trim().nullable(),
  platform: z.string().trim().nullable(),
  original_url: z.string().trim().url("Original URL must be valid.").nullable(),
  affiliate_url: z
    .string()
    .trim()
    .min(1, "Affiliate URL is required.")
    .url("Affiliate URL must be valid."),
});

export type AffiliateLinkInput = z.infer<typeof affiliateLinkInputSchema>;
