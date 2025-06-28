import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navigation } from "@/components/layout/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
  title: "LemonnPie - Nigerian Movie Reviews & Criticism",
  description: "Your go-to platform for Nigerian movie reviews, Nollywood criticism, and film ratings. Discover the best of African cinema.",
  keywords: ["Nigerian movies", "Nollywood", "movie reviews", "film criticism", "African cinema", "movie ratings"],
  authors: [{ name: "LemonnPie Team" }],
  creator: "LemonnPie",
  publisher: "LemonnPie",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://lemonnpie.com",
    siteName: "LemonnPie",
    title: "LemonnPie - Nigerian Movie Reviews & Criticism",
    description: "Your go-to platform for Nigerian movie reviews, Nollywood criticism, and film ratings.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LemonnPie - Nigerian Movie Reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LemonnPie - Nigerian Movie Reviews & Criticism",
    description: "Your go-to platform for Nigerian movie reviews, Nollywood criticism, and film ratings.",
    images: ["/og-image.jpg"],
    creator: "@lemonnpie",
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
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border bg-background">
              <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-nollywood-gold flex items-center justify-center">
                      <span className="text-xs font-bold text-white">L</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      © 2024 LemonnPie. All rights reserved.
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Made with ❤️ for Nigerian cinema
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
