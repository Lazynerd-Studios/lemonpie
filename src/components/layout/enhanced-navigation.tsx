"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  Search, 
  Menu, 
  X, 
  Film, 
  Star, 
  Users, 
  Calendar, 
  Award,
  Bell,
  User,
  Heart,
  Bookmark,
  Settings,
  LogOut,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { EnhancedSearchBar } from "./enhanced-search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import styles from "./enhanced-navigation.module.css";

const navigation = [
  { name: "Movies", href: "/movies", icon: Film, badge: "Hot" },
  { name: "Top Rated", href: "/top-rated", icon: Award },
  { name: "Coming Soon", href: "/coming-soon", icon: Calendar, badge: "New" },
  { name: "Actors", href: "/actors", icon: Users },
  { name: "Reviews", href: "/reviews", icon: Star },
];

const userMenuItems = [
  { name: "My Profile", href: "/profile", icon: User },
  { name: "Watchlist", href: "/watchlist", icon: Bookmark },
  { name: "Favorites", href: "/favorites", icon: Heart },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface EnhancedNavigationProps {
  className?: string;
  variant?: "default" | "transparent" | "dark";
  showSearch?: boolean;
  showUserMenu?: boolean;
  showNotifications?: boolean;
  isLoggedIn?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onLogout?: () => void;
}

export function EnhancedNavigation({
  className,
  variant = "default",
  showSearch = true,
  showUserMenu = true,
  showNotifications = true,
  isLoggedIn = false,
  user,
  onLoginClick,
  onRegisterClick,
  onLogout
}: EnhancedNavigationProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [notificationCount] = React.useState(3);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navClasses = cn(
    styles.navigation,
    styles[variant],
    scrolled && styles.scrolled,
    className
  );

  return (
    <header className={navClasses}>
      <nav className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoImage}>
              <Image 
                src="/logo.svg" 
                alt="LemonnPie Logo" 
                width={40} 
                height={40} 
                className={styles.logo}
              />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>LemonnPie</span>
              <span className={styles.logoSubtitle}>Nigerian Cinema</span>
            </div>
          </Link>
        </div>

        {/* Desktop Search */}
        {showSearch && (
          <div className={styles.searchSection}>
            <EnhancedSearchBar
              variant="compact"
              placeholder="Search movies, actors, reviews..."
              showHistory={true}
              showSuggestions={true}
              showFilters={true}
              onFilterToggle={() => console.log("Filter toggle")}
              className={styles.enhancedSearchBar}
            />
          </div>
        )}

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  styles.navItem,
                  isActive && styles.navItemActive
                )}
              >
                <Icon className={styles.navIcon} />
                <span className={styles.navText}>{item.name}</span>
                {item.badge && (
                  <span className={cn(
                    styles.navBadge,
                    item.badge === "Hot" && styles.badgeHot,
                    item.badge === "New" && styles.badgeNew
                  )}>
                    {item.badge}
                  </span>
                )}
                {isActive && <div className={styles.navIndicator} />}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className={styles.rightSection}>
          {/* Mobile Search Button */}
          {showSearch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.href = '/search'}
              className={cn(styles.mobileSearchButton, "lg:hidden")}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          {showNotifications && isLoggedIn && (
            <div className={styles.notifications}>
              <Button
                variant="ghost"
                size="icon"
                className={styles.notificationButton}
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className={styles.notificationBadge}>
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* User Menu */}
          {showUserMenu && isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={styles.userButton}
                >
                  <div className={styles.userAvatar}>
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.userEmail}>{user.email}</span>
                  </div>
                  <ChevronDown className={styles.userChevron} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={styles.userMenu}>
                {userMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className={styles.userMenuItem}>
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className={styles.logoutItem}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Auth Buttons */
            <div className={styles.authButtons}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoginClick}
                className={styles.loginButton}
              >
                Login
              </Button>
              <Button
                variant="gradient"
                size="sm"
                onClick={onRegisterClick}
                className={styles.registerButton}
              >
                Register
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(styles.mobileMenuButton, "lg:hidden")}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {/* The searchOpen, searchQuery, handleSearchSubmit, and searchOverlay variables are removed as they are not used in the EnhancedNavigation component. */}
      {/* If search functionality is needed, it should be re-added and managed by the EnhancedSearchBar component. */}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={cn(styles.mobileMenu, "lg:hidden")}>
          <div className={styles.mobileMenuContent}>
            {/* Navigation Items */}
            <div className={styles.mobileNavItems}>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      styles.mobileNavItem,
                      isActive && styles.mobileNavItemActive
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className={styles.mobileNavIcon} />
                    <span className={styles.mobileNavText}>{item.name}</span>
                    {item.badge && (
                      <span className={cn(
                        styles.mobileNavBadge,
                        item.badge === "Hot" && styles.badgeHot,
                        item.badge === "New" && styles.badgeNew
                      )}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <div className={styles.mobileNavIndicator} />}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth/User Section */}
            <div className={styles.mobileAuthSection}>
              {isLoggedIn && user ? (
                <div className={styles.mobileUserSection}>
                  <div className={styles.mobileUserInfo}>
                    <div className={styles.mobileUserAvatar}>
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className={styles.avatarImage}
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div className={styles.mobileUserDetails}>
                      <span className={styles.mobileUserName}>{user.name}</span>
                      <span className={styles.mobileUserEmail}>{user.email}</span>
                    </div>
                  </div>
                  
                  <div className={styles.mobileUserActions}>
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={styles.mobileUserAction}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                    
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout?.();
                      }}
                      className={styles.mobileLogoutButton}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.mobileAuthButtons}>
                  <Button
                    variant="outline"
                    className={styles.mobileLoginButton}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLoginClick?.();
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="gradient"
                    className={styles.mobileRegisterButton}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onRegisterClick?.();
                    }}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {/* The searchOpen variable is removed as it is not used in the EnhancedNavigation component. */}
      {/* If search functionality is needed, it should be re-added and managed by the EnhancedSearchBar component. */}
    </header>
  );
}

// Legacy component for backward compatibility
export function Navigation() {
  return (
    <EnhancedNavigation
      showSearch={true}
      showUserMenu={true}
      showNotifications={true}
      isLoggedIn={false}
    />
  );
} 