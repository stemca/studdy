import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { ThemeProvider } from "~/components/theme-provider";
import { ThemeSwitcher } from "~/components/theme-switcher";
import { Toaster } from "~/components/ui/toaster";
import { TRPCReactProvider } from "~/trpc/react";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "studdy club",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.className}`}>
      <body>
        <TRPCReactProvider>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            {children}
            <ThemeSwitcher />
            <Toaster />
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
