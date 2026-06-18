import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { getCurrentUserOrRedirect } from "@/lib/auth";

export default async function SettingsPage() {
  const { user } = await getCurrentUserOrRedirect();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Workspace and account basics for the Phase 1 foundation."
      />
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="text-muted-foreground">
            AI provider keys are managed through environment variables.
          </p>
          <Button asChild variant="outline">
            <Link href="/settings/ai-test">Open AI provider test</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
