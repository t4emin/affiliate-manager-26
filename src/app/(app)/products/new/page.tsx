import { createProduct } from "@/app/actions/products";
import { ProductForm } from "@/components/forms/product-form";
import { PageHeader } from "@/components/layout/page-header";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { listCampaignOptions } from "@/lib/services/campaign.service";

export default async function NewProductPage() {
  const { supabase } = await getCurrentUserOrRedirect();
  const campaigns = await listCampaignOptions(supabase);

  return (
    <>
      <PageHeader
        title="New product"
        description="Add a product for affiliate tracking."
      />
      <ProductForm
        action={createProduct}
        campaigns={campaigns ?? []}
        submitLabel="Create product"
      />
    </>
  );
}
