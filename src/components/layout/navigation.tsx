"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Film, Star, Users, TrendingUp, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Film },
  { name: "Movies", href: "/movies", icon: Film },
  { name: "Top Rated", href: "/top-rated", icon: Award },
  { name: "Coming Soon", href: "/coming-soon", icon: Calendar },
  { name: "Actors", href: "/actors", icon: Users },
  { name: "Reviews", href: "/reviews", icon: Star },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled 
        ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg" 
        : "bg-transparent"
    )}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="group flex items-center space-x-3 transition-transform hover:scale-105">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-lagos-orange flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                <Film className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-nollywood-gold rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold gradient-text-primary">LemonnPie</span>
              <span className="text-xs text-muted-foreground -mt-1">Nigerian Cinema</span>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground hover:bg-accent"
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-accent/50",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-colors duration-300",
                  isActive ? "text-primary" : "group-hover:text-primary"
                )} />
                <span>{item.name}</span>
                {isActive && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <ThemeToggle />
          <Button variant="gradient" size="sm" className="font-semibold">
            Join Community
          </Button>
        </div>
      </nav>

      {/* Enhanced Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="bg-background/95 backdrop-blur-xl border-t border-border">
            <div className="space-y-2 px-4 pb-6 pt-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-300",
                      isActive
                        ? "bg-accent text-accent-foreground shadow-md"
                        : "text-foreground hover:bg-accent/50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
              
              {/* Mobile search and actions */}
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="mr-3 h-5 w-5" />
                  Search Movies & Actors
                </Button>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Dark Mode
                  </span>
                  <ThemeToggle />
                </div>
                
                <Button 
                  variant="gradient" 
                  className="w-full font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 