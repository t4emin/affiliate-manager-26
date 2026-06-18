import { DatabaseError } from "@/lib/errors/DatabaseError";
import { logger } from "@/lib/logger";
import type { Database } from "@/lib/supabase/types";
import type { AppSupabaseClient } from "@/lib/repositories/types";

export type AiJobInsert = Database["public"]["Tables"]["ai_jobs"]["Insert"];
export type AiJobUpdate = Database["public"]["Tables"]["ai_jobs"]["Update"];

export async function createAiJobRecord(
  supabase: AppSupabaseClient,
  input: AiJobInsert,
) {
  const { data, error } = await supabase
    .from("ai_jobs")
    .insert(input)
    .select("id")
    .single();

  if (error) {
    logger.error("AI job insert failed", { error: error.message });
    throw new DatabaseError(error.message);
  }

  return data;
}

export async function updateAiJobRecord(
  supabase: AppSupabaseClient,
  id: string,
  input: AiJobUpdate,
) {
  const { error } = await supabase.from("ai_jobs").update(input).eq("id", id);

  if (error) {
    logger.error("AI job update failed", { id, error: error.message });
    throw new DatabaseError(error.message);
  }
}
