import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import DashboardShell from "@/components/DashboardShell";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Coreberg Marketing Orchestrator",
  description: "Coreberg Pitch Demo v1.1 - Autonomously Orchestrating Marketing Channels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-hidden">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
