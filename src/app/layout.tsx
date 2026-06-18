import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Affiliate AI OS",
  description: "Affiliate campaign, product, link, and AI content operations.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
