import { ValidationError } from "@/lib/errors/ValidationError";
import { logger } from "@/lib/logger";
import {
  countCampaigns,
  createCampaignRecord,
  deleteCampaignRecord,
  getCampaignById,
  listCampaignOptions,
  listCampaigns,
  updateCampaignRecord,
} from "@/lib/repositories/campaign.repository";
import type { AppSupabaseClient } from "@/lib/repositories/types";
import { nullableText } from "@/lib/services/form-data";
import { campaignInputSchema } from "@/lib/validators/campaign.schema";

function validateCampaignForm(formData: FormData) {
  const result = campaignInputSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    description: nullableText(formData.get("description")),
    status: String(formData.get("status") ?? "draft"),
  });

  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Invalid campaign.",
    );
  }

  return result.data;
}

export async function createCampaign({
  supabase,
  userId,
  formData,
}: {
  supabase: AppSupabaseClient;
  userId: string;
  formData: FormData;
}) {
  const input = validateCampaignForm(formData);
  const campaign = await createCampaignRecord(supabase, {
    user_id: userId,
    ...input,
  });

  logger.info("Campaign created", { id: campaign.id, userId });
  return campaign;
}

export async function updateCampaign({
  supabase,
  id,
  formData,
}: {
  supabase: AppSupabaseClient;
  id: string;
  formData: FormData;
}) {
  const input = validateCampaignForm(formData);
  await updateCampaignRecord(supabase, id, input);
  logger.info("Campaign updated", { id });
}

export async function deleteCampaign({
  supabase,
  id,
}: {
  supabase: AppSupabaseClient;
  id: string;
}) {
  await deleteCampaignRecord(supabase, id);
  logger.info("Campaign deleted", { id });
}

export { countCampaigns, getCampaignById, listCampaignOptions, listCampaigns };
