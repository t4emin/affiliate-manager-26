import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, NativeSelect, TextAreaField } from "./field";

type CampaignOption = {
  id: string;
  name: string;
};

type ProductFormProps = {
  action: (formData: FormData) => Promise<void>;
  campaigns: CampaignOption[];
  product?: {
    name: string;
    campaign_id: string | null;
    source_url: string | null;
    image_url: string | null;
    price: number | null;
    currency: string;
    description: string | null;
    ai_score: number | null;
  };
  submitLabel: string;
};

export function ProductForm({
  action,
  campaigns,
  product,
  submitLabel,
}: ProductFormProps) {
  return (
    <Card>
      <CardContent className="pt-5">
        <form action={action} className="space-y-5">
          <Field
            label="Product name"
            name="name"
            required
            defaultValue={product?.name}
          />
          <NativeSelect
            label="Campaign"
            name="campaign_id"
            defaultValue={product?.campaign_id}
          >
            <option value="">No campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </NativeSelect>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Source URL"
              name="source_url"
              type="url"
              defaultValue={product?.source_url}
            />
            <Field
              label="Image URL"
              name="image_url"
              type="url"
              defaultValue={product?.image_url}
            />
            <Field
              label="Price"
              name="price"
              type="number"
              defaultValue={product?.price}
            />
            <Field
              label="Currency"
              name="currency"
              defaultValue={product?.currency ?? "THB"}
            />
            <Field
              label="AI score"
              name="ai_score"
              type="number"
              defaultValue={product?.ai_score}
            />
          </div>
          <TextAreaField
            label="Description"
            name="description"
            defaultValue={product?.description}
          />
          <Button type="submit">{submitLabel}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
