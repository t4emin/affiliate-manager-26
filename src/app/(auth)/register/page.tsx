import Link from "next/link";
import { loginWithGoogle, register } from "@/app/actions/auth";
import { AuthFormShell } from "@/components/forms/auth-form-shell";
import { OAuthSubmitButton } from "@/components/forms/oauth-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthFormShell
            action={register}
            error={params.error}
            pendingDescription="Creating your account and preparing your workspace."
            pendingLabel="Creating account..."
            submitLabel="Register"
          >
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={6}
                required
              />
            </div>
          </AuthFormShell>
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <form action={loginWithGoogle}>
            <input type="hidden" name="next" value="/dashboard" />
            <OAuthSubmitButton
              label="Continue with Google"
              pendingLabel="Opening Google..."
            />
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="font-medium text-primary" href="/login">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
