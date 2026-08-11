import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Midnight Riviera — studio booking",
  description:
    "Book recording studios and see the platform commission split before you request a slot.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 pb-6 pt-8 sm:px-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
