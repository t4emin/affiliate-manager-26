import { ValidationError } from "@/lib/errors/ValidationError";
import { logger } from "@/lib/logger";
import {
  countProducts,
  createProductRecord,
  deleteProductRecord,
  getProductById,
  listProductOptions,
  listProducts,
  updateProductRecord,
} from "@/lib/repositories/product.repository";
import type { AppSupabaseClient } from "@/lib/repositories/types";
import { nullableNumber, nullableText } from "@/lib/services/form-data";
import { productInputSchema } from "@/lib/validators/product.schema";

function validateProductForm(formData: FormData) {
  const price = nullableNumber(formData.get("price"));
  const aiScore = nullableNumber(formData.get("ai_score"));

  if (Number.isNaN(price)) {
    throw new ValidationError("Price must be a valid number.");
  }

  if (Number.isNaN(aiScore)) {
    throw new ValidationError("AI score must be a valid number.");
  }

  const result = productInputSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    campaign_id: nullableText(formData.get("campaign_id")),
    source_url: nullableText(formData.get("source_url")),
    image_url: nullableText(formData.get("image_url")),
    price,
    currency: String(formData.get("currency") ?? "THB").trim() || "THB",
    description: nullableText(formData.get("description")),
    ai_score: aiScore,
  });

  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Invalid product.",
    );
  }

  return result.data;
}

export async function createProduct({
  supabase,
  userId,
  formData,
}: {
  supabase: AppSupabaseClient;
  userId: string;
  formData: FormData;
}) {
  const input = validateProductForm(formData);
  const product = await createProductRecord(supabase, {
    user_id: userId,
    ...input,
  });

  logger.info("Product created", { id: product.id, userId });
  return product;
}

export async function updateProduct({
  supabase,
  id,
  formData,
}: {
  supabase: AppSupabaseClient;
  id: string;
  formData: FormData;
}) {
  const input = validateProductForm(formData);
  await updateProductRecord(supabase, id, input);
  logger.info("Product updated", { id });
}

export async function deleteProduct({
  supabase,
  id,
}: {
  supabase: AppSupabaseClient;
  id: string;
}) {
  await deleteProductRecord(supabase, id);
  logger.info("Product deleted", { id });
}

export { countProducts, getProductById, listProductOptions, listProducts };
