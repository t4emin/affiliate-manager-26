import { ValidationError } from "@/lib/errors/ValidationError";
import { logger } from "@/lib/logger";
import {
  countAffiliateLinks,
  createAffiliateLinkRecord,
  deleteAffiliateLinkRecord,
  listAffiliateLinks,
  updateAffiliateLinkRecord,
} from "@/lib/repositories/affiliate-link.repository";
import type { AppSupabaseClient } from "@/lib/repositories/types";
import { nullableText } from "@/lib/services/form-data";
import { affiliateLinkInputSchema } from "@/lib/validators/affiliate-link.schema";

function validateAffiliateLinkForm(formData: FormData) {
  const result = affiliateLinkInputSchema.safeParse({
    product_id: nullableText(formData.get("product_id")),
    platform: nullableText(formData.get("platform")),
    original_url: nullableText(formData.get("original_url")),
    affiliate_url: String(formData.get("affiliate_url") ?? ""),
  });

  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Invalid affiliate link.",
    );
  }

  return result.data;
}

export async function createAffiliateLink({
  supabase,
  userId,
  formData,
}: {
  supabase: AppSupabaseClient;
  userId: string;
  formData: FormData;
}) {
  const input = validateAffiliateLinkForm(formData);
  await createAffiliateLinkRecord(supabase, {
    user_id: userId,
    ...input,
  });
  logger.info("Affiliate link created", { userId });
}

export async function updateAffiliateLink({
  supabase,
  id,
  formData,
}: {
  supabase: AppSupabaseClient;
  id: string;
  formData: FormData;
}) {
  const input = validateAffiliateLinkForm(formData);
  await updateAffiliateLinkRecord(supabase, id, input);
  logger.info("Affiliate link updated", { id });
}

export async function deleteAffiliateLink({
  supabase,
  id,
}: {
  supabase: AppSupabaseClient;
  id: string;
}) {
  await deleteAffiliateLinkRecord(supabase, id);
  logger.info("Affiliate link deleted", { id });
}

export { countAffiliateLinks, listAffiliateLinks };
