import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const siteInfo = {
    name: "MehtaQuest",
    url: "https://mehtaquest.vercel.app/",
    ogImage: "https://mehtaquest.vercel.app/og.png",
    description:"MehtaQuest is an advanced AI-powered business intelligence platform designed for aspiring entrepreneurs and innovation-driven R&D teams to turn ideas into actionable business plans. It analyzes market gaps, identifying high-potential opportunities, market risks, first mover score and evaluate competitive landscapes",
  }

export const metadata: Metadata = {
  title: {
    default: siteInfo.name,
    template: `%s - ${siteInfo.name}`,
  },
  metadataBase: new URL(siteInfo.url),
  description: siteInfo.description,
  keywords: [
    "market",
    "analyzes",
    "analyzes market gaps",
    "high-potential opportunities",
    "market risks",
    "first mover score",
    "evaluate competitive landscapes"
  ],
  authors: [
    {
      name: "MehtaQuest",
      url: "https://mehtaquest.vercel.app/",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteInfo.url,
    title: siteInfo.name,
    description: siteInfo.description,
    siteName: siteInfo.name,
    images: [
      {
        url: siteInfo.ogImage,
        width: 1200,
        height: 630,
        alt: siteInfo.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteInfo.name,
    description: siteInfo.description,
    images: [siteInfo.ogImage],
    creator: "@iamrishbean",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteInfo.url}/site.webmanifest`,
}

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics/>
      </body>
    </html>
  );
}
