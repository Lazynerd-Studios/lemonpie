import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/navigation";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { generateMetadata as generateSiteMetadata } from "@/lib/metadata";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = generateSiteMetadata({
  title: "LemonnPie - Nigerian Movie Reviews & Criticism",
  description: "Nigeria's premier movie review and criticism platform. Discover the best of Nollywood and African cinema with expert reviews, ratings, and cultural insights.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <Navigation />
            <main className="pt-16">
              {children}
            </main>
            <footer className="border-t border-border bg-background">
              <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-nollywood-gold flex items-center justify-center">
                      <span className="text-xs font-bold text-white">L</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      © 2024 LemonnPie. All rights reserved.
                    </span>
                  </div>
                  
                  {/* Social Media Icons */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <a
                        href="https://twitter.com/lemonnpie"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Follow us on Twitter"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                      <a
                        href="https://facebook.com/lemonnpie"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Follow us on Facebook"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <a
                        href="https://instagram.com/lemonnpie"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Follow us on Instagram"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-2.458 0-4.467-2.01-4.467-4.467 0-2.458 2.009-4.467 4.467-4.467s4.467 2.009 4.467 4.467c0 2.457-2.009 4.467-4.467 4.467zm7.548 0c-2.458 0-4.467-2.01-4.467-4.467 0-2.458 2.009-4.467 4.467-4.467s4.467 2.009 4.467 4.467c0 2.457-2.009 4.467-4.467 4.467z"/>
                        </svg>
                      </a>
                      <a
                        href="https://youtube.com/@lemonnpie"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Subscribe to our YouTube channel"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a2.934 2.934 0 0 0-2.065-2.065C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.433.575A2.934 2.934 0 0 0 .502 6.186C.002 8.113.002 12.002.002 12.002s0 3.889.5 5.816a2.934 2.934 0 0 0 2.065 2.065c1.928.575 9.433.575 9.433.575s7.505 0 9.433-.575a2.934 2.934 0 0 0 2.065-2.065c.5-1.927.5-5.816.5-5.816s0-3.889-.5-5.816zM9.545 15.568V8.436L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-muted-foreground">
                        Made with ❤️ for Nigerian cinema
                      </p>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
