import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import { GoogleAnalytics } from "@/components/app/analytics/google-analytics";
import { JsonLd } from "@/components/app/analytics/json-ld";
import { KeyboardShortcuts } from "@/components/app/chrome/keyboard-shortcuts";
import { SiteShell } from "@/components/app/chrome/site-shell";
import { ThemeProvider } from "@/components/app/chrome/theme-provider";
import { PreferencesPanel } from "@/components/app/preferences/preferences-panel";
import { PreferencesProvider } from "@/components/app/preferences/preferences-provider";
import { routing } from "@/i18n/routing";
import { getGithubStarCount } from "@/lib/github";
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, siteJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} · A visual vocabulary for the web — components, blocks & design styles`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: AUTHOR }],
  creator: AUTHOR,
  publisher: SITE_NAME,
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    types: {
      "application/json": "/registry.json",
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    title: `${SITE_NAME} · A visual vocabulary for the web — components, blocks & design styles`,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} · A visual vocabulary for the web — components, blocks & design styles`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · A visual vocabulary for the web — components, blocks & design styles`,
    description: SITE_DESCRIPTION,
    images: ["/api/og"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#151515" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const githubStarCount = await getGithubStarCount();
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(sans.variable, mono.variable)}
    >
      <head>
        <link rel="icon" type="image/png" href="/uilab-mark.png" />
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
        <link rel="alternate" type="application/json" title="Component registry" href="/r" />
        <link rel="alternate" type="application/json" title="shadcn registry" href="/registry.json" />
      </head>
      <body className="min-h-screen antialiased">
        <JsonLd data={siteJsonLd()} />
        <NextIntlClientProvider>
          <ThemeProvider>
            <PreferencesProvider>
              <KeyboardShortcuts />
              <SiteShell githubStarCount={githubStarCount}>{children}</SiteShell>
              <PreferencesPanel />
              {process.env.NODE_ENV === "production" && <Analytics />}
              {process.env.NODE_ENV === "production" && <SpeedInsights />}
              <GoogleAnalytics measurementId={googleAnalyticsId} />
            </PreferencesProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
