import { DatabaseError } from "@/lib/errors/DatabaseError";
import { logger } from "@/lib/logger";
import type { Database } from "@/lib/supabase/types";
import type { AppSupabaseClient } from "@/lib/repositories/types";

export type CampaignInsert =
  Database["public"]["Tables"]["campaigns"]["Insert"];
export type CampaignUpdate =
  Database["public"]["Tables"]["campaigns"]["Update"];

export async function createCampaignRecord(
  supabase: AppSupabaseClient,
  input: CampaignInsert,
) {
  const { data, error } = await supabase
    .from("campaigns")
    .insert(input)
    .select("id")
    .single();

  if (error) {
    logger.error("Campaign insert failed", { error: error.message });
    throw new DatabaseError(error.message);
  }

  return data;
}

export async function updateCampaignRecord(
  supabase: AppSupabaseClient,
  id: string,
  input: CampaignUpdate,
) {
  const { error } = await supabase.from("campaigns").update(input).eq("id", id);

  if (error) {
    logger.error("Campaign update failed", { id, error: error.message });
    throw new DatabaseError(error.message);
  }
}

export async function deleteCampaignRecord(
  supabase: AppSupabaseClient,
  id: string,
) {
  const { error } = await supabase.from("campaigns").delete().eq("id", id);

  if (error) {
    logger.error("Campaign delete failed", { id, error: error.message });
    throw new DatabaseError(error.message);
  }
}

export async function listCampaigns(supabase: AppSupabaseClient) {
  const { data, error } = await supabase
    .from("campaigns")
    .select("id,name,description,status,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Campaign list failed", { error: error.message });
    throw new DatabaseError(error.message);
  }

  return data ?? [];
}

export async function listCampaignOptions(supabase: AppSupabaseClient) {
  const { data, error } = await supabase
    .from("campaigns")
    .select("id,name")
    .order("name");

  if (error) {
    logger.error("Campaign option list failed", { error: error.message });
    throw new DatabaseError(error.message);
  }

  return data ?? [];
}

export async function getCampaignById(supabase: AppSupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("campaigns")
    .select("id,name,description,status")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logger.error("Campaign detail lookup failed", { id, error: error.message });
    throw new DatabaseError(error.message);
  }

  return data;
}

export async function countCampaigns(supabase: AppSupabaseClient) {
  const { count, error } = await supabase.from("campaigns").select("id", {
    count: "exact",
    head: true,
  });

  if (error) {
    logger.error("Campaign count failed", { error: error.message });
    throw new DatabaseError(error.message);
  }

  return count ?? 0;
}
