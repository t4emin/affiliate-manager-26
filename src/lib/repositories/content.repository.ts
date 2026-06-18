import { DatabaseError } from "@/lib/errors/DatabaseError";
import { logger } from "@/lib/logger";
import type { AppSupabaseClient } from "@/lib/repositories/types";

export async function countContentItems(supabase: AppSupabaseClient) {
  const { count, error } = await supabase.from("contents").select("id", {
    count: "exact",
    head: true,
  });

  if (error) {
    logger.error("Content count failed", { error: error.message });
    throw new DatabaseError(error.message);
  }

  return count ?? 0;
}
