import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getSafeNext(path: string | null) {
  return path?.startsWith("/") ? path : "/dashboard";
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeNext(requestUrl.searchParams.get("next"));
  const error =
    requestUrl.searchParams.get("error_description") ??
    requestUrl.searchParams.get("error");

  if (error) {
    const loginUrl = new URL("/login", requestUrl.origin);
    loginUrl.searchParams.set("error", error);
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    const loginUrl = new URL("/login", requestUrl.origin);
    loginUrl.searchParams.set("error", "Missing authentication code.");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    code,
  );

  if (exchangeError) {
    const loginUrl = new URL("/login", requestUrl.origin);
    loginUrl.searchParams.set("error", exchangeError.message);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
