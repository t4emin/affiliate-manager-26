import { notFound } from "next/navigation";
import { updateCampaign, deleteCampaign } from "@/app/actions/campaigns";
import { CampaignForm } from "@/components/forms/campaign-form";
import { DeleteButton } from "@/components/layout/delete-button";
import { PageHeader } from "@/components/layout/page-header";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { getCampaignById } from "@/lib/services/campaign.service";

type CampaignDetail = {
  id: string;
  name: string;
  description: string | null;
  status: string;
};

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await getCurrentUserOrRedirect();
  const campaign = (await getCampaignById(
    supabase,
    id,
  )) as CampaignDetail | null;

  if (!campaign) notFound();

  const updateAction = updateCampaign.bind(null, id);
  const deleteAction = deleteCampaign.bind(null, id);

  return (
    <>
      <PageHeader
        title={campaign.name}
        description="Edit campaign details or delete this campaign."
        action={
          <DeleteButton
            action={deleteAction}
            description="Products keep their campaign reference as null after deletion."
          />
        }
      />
      <CampaignForm
        action={updateAction}
        campaign={campaign}
        submitLabel="Update campaign"
      />
    </>
  );
}
