import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { listCampaigns } from "@/lib/services/campaign.service";

export default async function CampaignsPage() {
  const { supabase } = await getCurrentUserOrRedirect();
  const campaigns = await listCampaigns(supabase);

  return (
    <>
      <PageHeader
        title="Campaigns"
        description="Plan and manage affiliate promotion initiatives."
        action={
          <Button asChild>
            <Link href="/campaigns/new">
              <Plus className="h-4 w-4" />
              New campaign
            </Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(campaigns ?? []).map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <Link
                      className="font-medium text-primary"
                      href={`/campaigns/${campaign.id}`}
                    >
                      {campaign.name}
                    </Link>
                    {campaign.description ? (
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {campaign.description}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Badge>{campaign.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {!campaigns?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                  >
                    No campaigns yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
