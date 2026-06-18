import { countAffiliateLinks } from "@/lib/services/affiliate-link.service";
import { countCampaigns } from "@/lib/services/campaign.service";
import { countContentItems } from "@/lib/repositories/content.repository";
import { countProducts } from "@/lib/services/product.service";
import type { AppSupabaseClient } from "@/lib/repositories/types";

export async function getDashboardCounts(supabase: AppSupabaseClient) {
  const [campaigns, products, affiliateLinks, contents] = await Promise.all([
    countCampaigns(supabase),
    countProducts(supabase),
    countAffiliateLinks(supabase),
    countContentItems(supabase),
  ]);

  return {
    campaigns,
    products,
    affiliate_links: affiliateLinks,
    contents,
  };
}
