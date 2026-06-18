import { deleteAffiliateLink, updateAffiliateLink } from "@/app/actions/links";
import { LinkCreateForm } from "@/components/forms/link-form";
import { DeleteButton } from "@/components/layout/delete-button";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { listAffiliateLinks } from "@/lib/services/affiliate-link.service";
import { listProductOptions } from "@/lib/services/product.service";

type ProductOption = {
  id: string;
  name: string;
};

type AffiliateLinkRow = {
  id: string;
  product_id: string | null;
  platform: string | null;
  original_url: string | null;
  affiliate_url: string;
  clicks: number;
  products: { name: string } | null;
};

export default async function LinksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const { supabase } = await getCurrentUserOrRedirect();
  const [linkData, productData] = await Promise.all([
    listAffiliateLinks(supabase),
    listProductOptions(supabase),
  ]);
  const links = linkData as unknown as AffiliateLinkRow[];
  const products = productData as ProductOption[];

  return (
    <>
      <PageHeader
        title="Affiliate links"
        description="Create and maintain affiliate URLs by platform and product."
      />
      {params.error ? (
        <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {params.error}
        </p>
      ) : null}
      <div className="space-y-6">
        <LinkCreateForm products={products ?? []} />
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Affiliate URL</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(links ?? []).map((link) => {
                  const updateAction = updateAffiliateLink.bind(null, link.id);
                  const deleteAction = deleteAffiliateLink.bind(null, link.id);

                  return (
                    <TableRow key={link.id}>
                      <TableCell className="min-w-48">
                        <form
                          action={updateAction}
                          id={`link-${link.id}`}
                          className="space-y-3"
                        >
                          <div className="space-y-2">
                            <Label htmlFor={`product-${link.id}`}>
                              Product
                            </Label>
                            <select
                              id={`product-${link.id}`}
                              name="product_id"
                              defaultValue={link.product_id ?? ""}
                              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                            >
                              <option value="">No product</option>
                              {(products ?? []).map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </form>
                      </TableCell>
                      <TableCell className="min-w-40">
                        <Input
                          form={`link-${link.id}`}
                          name="platform"
                          defaultValue={link.platform ?? ""}
                        />
                      </TableCell>
                      <TableCell className="min-w-72">
                        <Input
                          form={`link-${link.id}`}
                          name="original_url"
                          type="url"
                          defaultValue={link.original_url ?? ""}
                          placeholder="Original URL"
                          className="mb-2"
                        />
                        <Input
                          form={`link-${link.id}`}
                          name="affiliate_url"
                          type="url"
                          required
                          defaultValue={link.affiliate_url}
                        />
                      </TableCell>
                      <TableCell>{link.clicks}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Button
                            form={`link-${link.id}`}
                            type="submit"
                            variant="outline"
                          >
                            Update
                          </Button>
                          <DeleteButton action={deleteAction} label="Delete" />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!links?.length ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No affiliate links yet.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
