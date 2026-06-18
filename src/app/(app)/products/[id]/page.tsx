import { notFound } from "next/navigation";
import { updateProduct, deleteProduct } from "@/app/actions/products";
import { ProductForm } from "@/components/forms/product-form";
import { DeleteButton } from "@/components/layout/delete-button";
import { PageHeader } from "@/components/layout/page-header";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { listCampaignOptions } from "@/lib/services/campaign.service";
import { getProductById } from "@/lib/services/product.service";

type ProductDetail = {
  id: string;
  name: string;
  campaign_id: string | null;
  source_url: string | null;
  image_url: string | null;
  price: number | null;
  currency: string;
  description: string | null;
  ai_score: number | null;
};

type CampaignOption = {
  id: string;
  name: string;
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await getCurrentUserOrRedirect();
  const [productData, campaignData] = await Promise.all([
    getProductById(supabase, id),
    listCampaignOptions(supabase),
  ]);
  const product = productData as ProductDetail | null;
  const campaigns = campaignData as CampaignOption[];

  if (!product) notFound();

  const updateAction = updateProduct.bind(null, id);
  const deleteAction = deleteProduct.bind(null, id);

  return (
    <>
      <PageHeader
        title={product.name}
        description="Edit product details and affiliate readiness data."
        action={
          <DeleteButton
            action={deleteAction}
            description="Affiliate links connected to this product may block deletion until removed."
          />
        }
      />
      <ProductForm
        action={updateAction}
        campaigns={campaigns ?? []}
        product={product}
        submitLabel="Update product"
      />
    </>
  );
}
