import { DatabaseError } from "@/lib/errors/DatabaseError";
import { logger } from "@/lib/logger";
import type { Database } from "@/lib/supabase/types";
import type { AppSupabaseClient } from "@/lib/repositories/types";

export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export async function createProductRecord(
  supabase: AppSupabaseClient,
  input: ProductInsert,
) {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select("id")
    .single();

  if (error) {
    logger.error("Product insert failed", { error: error.message });
    throw new DatabaseError(error.message);
  }

  return data;
}

export async function updateProductRecord(
  supabase: AppSupabaseClient,
  id: string,
  input: ProductUpdate,
) {
  const { error } = await supabase.from("products").update(input).eq("id", id);

  if (error) {
    logger.error("Product update failed", { id, error: error.message });
    throw new DatabaseError(error.message);
  }
}

export async function deleteProductRecord(
  supabase: AppSupabaseClient,
  id: string,
) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    logger.error("Product delete failed", { id, error: error.message });
    throw new DatabaseError(error.message);
  }
}

export async function listProducts(supabase: AppSupabaseClient) {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,price,currency,ai_score,created_at,campaigns(name)")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Product list failed", { error: error.message });
    throw new DatabaseError(error.message);
  }

  return data ?? [];
}

export async function listProductOptions(supabase: AppSupabaseClient) {
  const { data, error } = await supabase
    .from("products")
    .select("id,name")
    .order("name");

  if (error) {
    logger.error("Product option list failed", { error: error.message });
    throw new DatabaseError(error.message);
  }

  return data ?? [];
}

export async function getProductById(supabase: AppSupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,campaign_id,source_url,image_url,price,currency,description,ai_score",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logger.error("Product detail lookup failed", { id, error: error.message });
    throw new DatabaseError(error.message);
  }

  return data;
}

export async function countProducts(supabase: AppSupabaseClient) {
  const { count, error } = await supabase.from("products").select("id", {
    count: "exact",
    head: true,
  });

  if (error) {
    logger.error("Product count failed", { error: error.message });
    throw new DatabaseError(error.message);
  }

  return count ?? 0;
}
