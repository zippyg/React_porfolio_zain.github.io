import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/providers/motion-provider";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { BackgroundEffects } from "@/components/layout/background-effects";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-black text-white font-sans`}
      >
        <MotionProvider>
          <BackgroundEffects />
          <Navigation />
          <div className="flex flex-col min-h-screen relative">
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}