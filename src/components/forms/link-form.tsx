import { createAffiliateLink } from "@/app/actions/links";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, NativeSelect } from "./field";

type ProductOption = {
  id: string;
  name: string;
};

export function LinkCreateForm({ products }: { products: ProductOption[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create affiliate link</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={createAffiliateLink}
          className="grid gap-4 lg:grid-cols-5"
        >
          <NativeSelect label="Product" name="product_id">
            <option value="">No product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </NativeSelect>
          <Field label="Platform" name="platform" placeholder="Shopee" />
          <Field label="Original URL" name="original_url" type="url" />
          <Field
            label="Affiliate URL"
            name="affiliate_url"
            type="url"
            required
          />
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Create link
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
