"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { getUserFacingMessage } from "@/lib/errors/AppError";
import * as productService from "@/lib/services/product.service";

export async function createProduct(formData: FormData) {
  const { supabase, user } = await getCurrentUserOrRedirect();
  let productId: string;

  try {
    const product = await productService.createProduct({
      supabase,
      userId: user.id,
      formData,
    });
    productId = product.id;
  } catch (error) {
    redirect(
      `/products/new?error=${encodeURIComponent(getUserFacingMessage(error))}`,
    );
  }

  revalidatePath("/products");
  redirect(`/products/${productId}`);
}

export async function updateProduct(id: string, formData: FormData) {
  const { supabase } = await getCurrentUserOrRedirect();

  try {
    await productService.updateProduct({ supabase, id, formData });
  } catch (error) {
    redirect(
      `/products/${id}?error=${encodeURIComponent(getUserFacingMessage(error))}`,
    );
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect(`/products/${id}`);
}

export async function deleteProduct(id: string) {
  const { supabase } = await getCurrentUserOrRedirect();
  await productService.deleteProduct({ supabase, id });
  revalidatePath("/products");
  redirect("/products");
}
