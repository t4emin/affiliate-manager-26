import type React from "react";
import Link from "next/link";
import {
  Bot,
  ChartNoAxesCombined,
  Link2,
  Package,
  Settings,
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: ChartNoAxesCombined },
  { href: "/campaigns", label: "Campaigns", icon: Bot },
  { href: "/products", label: "Products", icon: Package },
  { href: "/links", label: "Links", icon: Link2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string | null;
}) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed hidden h-screen w-64 border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b p-5">
            <Link href="/dashboard" className="text-lg font-semibold">
              Affiliate AI OS
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              Phase 1 foundation
            </p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t p-4">
            <p className="mb-3 truncate text-xs text-muted-foreground">
              {email}
            </p>
            <form action={logout}>
              <Button type="submit" variant="outline" className="w-full">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Link href="/dashboard" className="font-semibold">
              Affiliate AI OS
            </Link>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                Logout
              </Button>
            </form>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
