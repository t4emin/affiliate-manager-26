import { z } from "zod";

export const campaignInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Campaign name is required.")
    .max(120, "Campaign name must be 120 characters or less."),
  description: z.string().trim().nullable(),
  status: z.string().trim().min(1).max(40),
});

export type CampaignInput = z.infer<typeof campaignInputSchema>;
