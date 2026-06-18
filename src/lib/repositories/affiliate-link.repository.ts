import { DatabaseError } from "@/lib/errors/DatabaseError";
import { logger } from "@/lib/logger";
import type { Database } from "@/lib/supabase/types";
import type { AppSupabaseClient } from "@/lib/repositories/types";

export type AffiliateLinkInsert =
  Database["public"]["Tables"]["affiliate_links"]["Insert"];
export type AffiliateLinkUpdate =
  Database["public"]["Tables"]["affiliate_links"]["Update"];

export async function createAffiliateLinkRecord(
  supabase: AppSupabaseClient,
  input: AffiliateLinkInsert,
) {
  const { error } = await supabase.from("affiliate_links").insert(input);

  if (error) {
    logger.error("Affiliate link insert failed", { error: error.message });
    throw new DatabaseError(error.message);
  }
}

export async function updateAffiliateLinkRecord(
  supabase: AppSupabaseClient,
  id: string,
  input: AffiliateLinkUpdate,
) {
  const { error } = await supabase
    .from("affiliate_links")
    .update(input)
    .eq("id", id);

  if (error) {
    logger.error("Affiliate link update failed", { id, error: error.message });
    throw new DatabaseError(error.message);
  }
}

export async function deleteAffiliateLinkRecord(
  supabase: AppSupabaseClient,
  id: string,
) {
  const { error } = await supabase
    .from("affiliate_links")
    .delete()
    .eq("id", id);

  if (error) {
    logger.error("Affiliate link delete failed", { id, error: error.message });
    throw new DatabaseError(error.message);
  }
}

export async function listAffiliateLinks(supabase: AppSupabaseClient) {
  const { data, error } = await supabase
    .from("affiliate_links")
    .select(
      "id,product_id,platform,original_url,affiliate_url,clicks,products(name)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Affiliate link list failed", { error: error.message });
    throw new DatabaseError(error.message);
  }

  return data ?? [];
}

export async function countAffiliateLinks(supabase: AppSupabaseClient) {
  const { count, error } = await supabase.from("affiliate_links").select("id", {
    count: "exact",
    head: true,
  });

  if (error) {
    logger.error("Affiliate link count failed", { error: error.message });
    throw new DatabaseError(error.message);
  }

  return count ?? 0;
}
