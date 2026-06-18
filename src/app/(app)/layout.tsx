import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUserOrRedirect } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentUserOrRedirect();

  return <AppShell email={user.email}>{children}</AppShell>;
}
