"use server";

import { redirect } from "next/navigation";
import { getAuthCallbackUrl } from "@/lib/auth/redirect-url";
import { createClient } from "@/lib/supabase/server";

const AUTH_SERVICE_ERROR =
  "Could not reach Supabase Auth. Check NEXT_PUBLIC_SUPABASE_URL and make sure Supabase is running.";

function getAuthErrorMessage(message: string) {
  if (
    message === "fetch failed" ||
    message.includes("Unexpected token") ||
    message.includes("is not valid JSON")
  ) {
    return AUTH_SERVICE_ERROR;
  }

  return message;
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  const supabase = await createClient();
  const { error } = await supabase.auth
    .signInWithPassword({ email, password })
    .catch(() => ({ error: { message: AUTH_SERVICE_ERROR } }));

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(getAuthErrorMessage(error.message))}`,
    );
  }

  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function register(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "");
  const emailRedirectTo = await getAuthCallbackUrl("/dashboard");

  const supabase = await createClient();
  const { error } = await supabase.auth
    .signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: fullName,
        },
      },
    })
    .catch(() => ({ error: { message: AUTH_SERVICE_ERROR } }));

  if (error) {
    redirect(
      `/register?error=${encodeURIComponent(getAuthErrorMessage(error.message))}`,
    );
  }

  redirect("/dashboard");
}

export async function loginWithGoogle(formData: FormData) {
  const next = String(formData.get("next") ?? "/dashboard");
  const safeNext = next.startsWith("/") ? next : "/dashboard";
  const redirectTo = await getAuthCallbackUrl(safeNext);

  const supabase = await createClient();
  const { data, error } = await supabase.auth
    .signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          prompt: "select_account",
        },
      },
    })
    .catch(() => ({
      data: { url: null },
      error: { message: AUTH_SERVICE_ERROR },
    }));

  if (error || !data.url) {
    redirect(
      `/login?error=${encodeURIComponent(
        getAuthErrorMessage(error?.message ?? AUTH_SERVICE_ERROR),
      )}`,
    );
  }

  redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
