import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/providers/motion-provider";
import { FunModeProvider } from "@/contexts/fun-mode-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { EasterEggProvider } from "@/contexts/easter-egg-context";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { BackgroundEffects } from "@/components/layout/background-effects";
import { CommandPalette } from "@/components/ui/command-palette";
import { EasterEggHint } from "@/components/ui/easter-egg-hint";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ScrollToTopOnMount } from "@/components/layout/scroll-to-top-on-mount";
import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider";
import { Analytics } from "@vercel/analytics/react";
import "@/lib/gsap-config";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zain Mughal - Quantitative Researcher & Full-Stack Developer",
  description:
    "Portfolio of Zain Mughal - Quantitative researcher, physicist, and full-stack developer. Specializing in mathematical modeling, data analysis, and innovative web applications.",
  keywords: "quantitative researcher, full-stack developer, physicist, portfolio, Zain Mughal",
  authors: [{ name: "Zain Mughal" }],
  openGraph: {
    title: "Zain Mughal - Quantitative Researcher & Full-Stack Developer",
    description: "Exploring the intersection of mathematics, physics, and technology",
    url: "https://zainmughal.dev",
    siteName: "Zain Mughal Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zain Mughal - Quantitative Researcher & Full-Stack Developer",
    description: "Exploring the intersection of mathematics, physics, and technology",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Ensure page loads at top */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (history.scrollRestoration) {
                history.scrollRestoration = 'manual';
              }
              window.scrollTo(0, 0);
            `,
          }}
        />
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.add(theme);
              } catch {}
            `,
          }}
        />
      </head>
      <body
        className={`${ibmPlexSans.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider>
          <MotionProvider>
            <FunModeProvider>
              <EasterEggProvider>
                <SmoothScrollProvider>
                  <ScrollToTopOnMount />
                  <CommandPalette />
                  <EasterEggHint />
                  <ScrollToTop />
                  <BackgroundEffects />
                  <Navigation />
                  <div className="flex flex-col min-h-screen relative overflow-x-hidden">
                    <main className="flex-grow">{children}</main>
                    <Footer />
                  </div>
                  <Analytics />
                </SmoothScrollProvider>
              </EasterEggProvider>
            </FunModeProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}