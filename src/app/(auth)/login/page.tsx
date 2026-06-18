import Link from "next/link";
import { login, loginWithGoogle } from "@/app/actions/auth";
import { AuthFormShell } from "@/components/forms/auth-form-shell";
import { OAuthSubmitButton } from "@/components/forms/oauth-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to Affiliate AI OS</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthFormShell
            action={login}
            error={params.error}
            pendingDescription="Checking your credentials and opening your workspace."
            pendingLabel="Logging in..."
            submitLabel="Login"
          >
            <input
              type="hidden"
              name="next"
              value={params.next ?? "/dashboard"}
            />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </AuthFormShell>
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <form action={loginWithGoogle}>
            <input
              type="hidden"
              name="next"
              value={params.next ?? "/dashboard"}
            />
            <OAuthSubmitButton
              label="Login with Google"
              pendingLabel="Opening Google..."
            />
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link className="font-medium text-primary" href="/register">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
