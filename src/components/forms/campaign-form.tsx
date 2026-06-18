import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, NativeSelect, TextAreaField } from "./field";

type CampaignFormProps = {
  action: (formData: FormData) => Promise<void>;
  campaign?: {
    name: string;
    description: string | null;
    status: string;
  };
  submitLabel: string;
};

export function CampaignForm({
  action,
  campaign,
  submitLabel,
}: CampaignFormProps) {
  return (
    <Card>
      <CardContent className="pt-5">
        <form action={action} className="space-y-5">
          <Field
            label="Campaign name"
            name="name"
            required
            defaultValue={campaign?.name}
            placeholder="TikTok skincare launch"
          />
          <TextAreaField
            label="Description"
            name="description"
            defaultValue={campaign?.description}
          />
          <NativeSelect
            label="Status"
            name="status"
            defaultValue={campaign?.status ?? "draft"}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </NativeSelect>
          <Button type="submit">{submitLabel}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
