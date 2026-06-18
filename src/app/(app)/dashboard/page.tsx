import {
  BarChart3,
  FileText,
  Link2,
  MousePointerClick,
  Package,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { getCurrentUserOrRedirect } from "@/lib/auth";
import { getDashboardCounts } from "@/lib/services/dashboard.service";

const stats = [
  { label: "Campaigns", key: "campaigns", icon: Target },
  { label: "Products", key: "products", icon: Package },
  { label: "Affiliate links", key: "affiliate_links", icon: Link2 },
  { label: "Content items", key: "contents", icon: FileText },
];

export default async function DashboardPage() {
  const { supabase } = await getCurrentUserOrRedirect();
  const counts = await getDashboardCounts(supabase);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Operational snapshot for affiliate campaigns, products, links, and content."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {counts[stat.key as keyof typeof counts]}
              </div>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">THB 0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clicks
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">0</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
