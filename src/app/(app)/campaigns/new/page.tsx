import { createCampaign } from "@/app/actions/campaigns";
import { CampaignForm } from "@/components/forms/campaign-form";
import { PageHeader } from "@/components/layout/page-header";

export default function NewCampaignPage() {
  return (
    <>
      <PageHeader
        title="New campaign"
        description="Create the campaign workspace."
      />
      <CampaignForm action={createCampaign} submitLabel="Create campaign" />
    </>
  );
}
