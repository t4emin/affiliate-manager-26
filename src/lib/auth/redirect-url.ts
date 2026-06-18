import { headers } from "next/headers";

export async function getAuthCallbackUrl(next = "/dashboard") {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const callbackUrl = new URL("/auth/callback", `${protocol}://${host}`);

  callbackUrl.searchParams.set("next", next.startsWith("/") ? next : "/dashboard");

  return callbackUrl.toString();
}
