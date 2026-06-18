"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { getUserFacingMessage } from "@/lib/errors/AppError";
import * as campaignService from "@/lib/services/campaign.service";

export async function createCampaign(formData: FormData) {
  const { supabase, user } = await getCurrentUserOrRedirect();
  let campaignId: string;

  try {
    const campaign = await campaignService.createCampaign({
      supabase,
      userId: user.id,
      formData,
    });
    campaignId = campaign.id;
  } catch (error) {
    redirect(
      `/campaigns/new?error=${encodeURIComponent(getUserFacingMessage(error))}`,
    );
  }

  revalidatePath("/campaigns");
  redirect(`/campaigns/${campaignId}`);
}

export async function updateCampaign(id: string, formData: FormData) {
  const { supabase } = await getCurrentUserOrRedirect();

  try {
    await campaignService.updateCampaign({ supabase, id, formData });
  } catch (error) {
    redirect(
      `/campaigns/${id}?error=${encodeURIComponent(getUserFacingMessage(error))}`,
    );
  }

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${id}`);
  redirect(`/campaigns/${id}`);
}

export async function deleteCampaign(id: string) {
  const { supabase } = await getCurrentUserOrRedirect();
  await campaignService.deleteCampaign({ supabase, id });
  revalidatePath("/campaigns");
  redirect("/campaigns");
}
