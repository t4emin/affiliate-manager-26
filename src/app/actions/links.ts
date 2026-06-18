"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { getUserFacingMessage } from "@/lib/errors/AppError";
import * as affiliateLinkService from "@/lib/services/affiliate-link.service";

export async function createAffiliateLink(formData: FormData) {
  const { supabase, user } = await getCurrentUserOrRedirect();

  try {
    await affiliateLinkService.createAffiliateLink({
      supabase,
      userId: user.id,
      formData,
    });
  } catch (error) {
    redirect(`/links?error=${encodeURIComponent(getUserFacingMessage(error))}`);
  }

  revalidatePath("/links");
  redirect("/links");
}

export async function updateAffiliateLink(id: string, formData: FormData) {
  const { supabase } = await getCurrentUserOrRedirect();

  try {
    await affiliateLinkService.updateAffiliateLink({ supabase, id, formData });
  } catch (error) {
    redirect(`/links?error=${encodeURIComponent(getUserFacingMessage(error))}`);
  }

  revalidatePath("/links");
  redirect("/links");
}

export async function deleteAffiliateLink(id: string) {
  const { supabase } = await getCurrentUserOrRedirect();
  await affiliateLinkService.deleteAffiliateLink({ supabase, id });
  revalidatePath("/links");
  redirect("/links");
}
