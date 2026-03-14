import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EdgeFinder - Discover Your Trading Edge",
    template: "%s | EdgeFinder",
  },
  description:
    "Build, backtest, and optimize trading strategies across stocks, forex, crypto, and futures. Institutional-grade analytics with 200+ indicators.",
  keywords: [
    "backtesting",
    "trading strategy",
    "algorithmic trading",
    "stock trading",
    "forex",
    "crypto trading",
    "technical indicators",
    "quantitative trading",
    "strategy builder",
    "equity curve",
    "sharpe ratio",
  ],
  authors: [{ name: "EdgeFinder" }],
  creator: "EdgeFinder",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edgefinder.io",
    title: "EdgeFinder - Discover Your Trading Edge",
    description:
      "Build, backtest, and optimize trading strategies across stocks, forex, crypto, and futures.",
    siteName: "EdgeFinder",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EdgeFinder - Trading Strategy Backtesting Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EdgeFinder - Discover Your Trading Edge",
    description:
      "Build, backtest, and optimize trading strategies across stocks, forex, crypto, and futures.",
    images: ["/og-image.png"],
    creator: "@edgefinder",
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EdgeFinder",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('EdgeFinder SW registered:', reg.scope);
                  }).catch(function(err) {
                    console.log('EdgeFinder SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
