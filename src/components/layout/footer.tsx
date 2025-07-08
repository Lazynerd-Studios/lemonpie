import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ExternalLink,
  ArrowRight,
  Film,
  Star,
  Users,
  Calendar,
  Award,
  Send,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/grid";
import { cn } from "@/lib/utils";
import styles from "./footer.module.css";

interface FooterProps {
  className?: string;
  variant?: "default" | "minimal" | "extended";
  showNewsletter?: boolean;
  showSocial?: boolean;
  showBackToTop?: boolean;
  companyInfo?: {
    name: string;
    description: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  onNewsletterSubmit?: (email: string) => void;
}

const quickLinks = [
  { name: "Movies", href: "/movies", icon: Film },
  { name: "Top Rated", href: "/top-rated", icon: Award },
  { name: "Coming Soon", href: "/coming-soon", icon: Calendar },
  { name: "Actors", href: "/actors", icon: Users },
  { name: "Reviews", href: "/reviews", icon: Star },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
  { name: "DMCA", href: "/dmca" },
];

const supportLinks = [
  { name: "Help Center", href: "/help" },
  { name: "Contact Us", href: "/contact" },
  { name: "Report Issue", href: "/report" },
  { name: "Feedback", href: "/feedback" },
];

const genreLinks = [
  { name: "Drama", href: "/genre/drama" },
  { name: "Comedy", href: "/genre/comedy" },
  { name: "Action", href: "/genre/action" },
  { name: "Romance", href: "/genre/romance" },
  { name: "Thriller", href: "/genre/thriller" },
  { name: "Documentary", href: "/genre/documentary" },
];

export function Footer({
  className,
  variant = "default",
  showNewsletter = true,
  showSocial = true,
  showBackToTop = true,
  companyInfo = {
    name: "LemonnPie",
    description: "Your ultimate destination for Nigerian cinema. Discover, review, and celebrate the best of Nollywood.",
    logo: "/logo.svg",
    address: "Lagos, Nigeria",
    phone: "+234 (0) 123 456 7890",
    email: "hello@lemonnpie.com"
  },
  socialLinks = {
    facebook: "https://facebook.com/lemonnpie",
    twitter: "https://twitter.com/lemonnpie",
    instagram: "https://instagram.com/lemonnpie",
    youtube: "https://youtube.com/lemonnpie"
  },
  onNewsletterSubmit
}: FooterProps) {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    try {
      if (onNewsletterSubmit) {
        await onNewsletterSubmit(email);
      }
      setEmail("");
    } catch (error) {
      console.error("Newsletter submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (variant === "minimal") {
    return (
      <footer className={cn(styles.footer, styles.minimal, className)}>
        <Container size="xl" padding="lg">
          <div className={styles.minimalContent}>
            <div className={styles.minimalBrand}>
              <Link href="/" className={styles.brandLink}>
                {companyInfo.logo && (
                  <Image
                    src={companyInfo.logo}
                    alt={companyInfo.name}
                    width={32}
                    height={32}
                    className={styles.brandLogo}
                  />
                )}
                <span className={styles.brandName}>{companyInfo.name}</span>
              </Link>
              <p className={styles.brandDescription}>{companyInfo.description}</p>
            </div>
            
            <div className={styles.minimalLinks}>
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={styles.minimalLink}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className={styles.minimalCopyright}>
              <p>© {new Date().getFullYear()} {companyInfo.name}. Made with <Heart className={styles.heartIcon} /> in Nigeria.</p>
            </div>
          </div>
        </Container>
      </footer>
    );
  }

  return (
    <footer className={cn(styles.footer, styles[variant], className)}>
      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className={styles.backToTop}
          size="icon"
          variant="ghost"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}

      <Container size="xl" padding="lg">
        <div className={styles.footerContent}>
          {/* Main Footer Content */}
          <div className={styles.mainFooter}>
            {/* Brand Section */}
            <div className={styles.brandSection}>
              <Link href="/" className={styles.brandLink}>
                {companyInfo.logo && (
                  <Image
                    src={companyInfo.logo}
                    alt={companyInfo.name}
                    width={48}
                    height={48}
                    className={styles.brandLogo}
                  />
                )}
                <div className={styles.brandText}>
                  <span className={styles.brandName}>{companyInfo.name}</span>
                  <span className={styles.brandTagline}>Nigerian Cinema</span>
                </div>
              </Link>
              
              <p className={styles.brandDescription}>
                {companyInfo.description}
              </p>
              
              {/* Contact Info */}
              <div className={styles.contactInfo}>
                {companyInfo.address && (
                  <div className={styles.contactItem}>
                    <MapPin className={styles.contactIcon} />
                    <span>{companyInfo.address}</span>
                  </div>
                )}
                {companyInfo.phone && (
                  <div className={styles.contactItem}>
                    <Phone className={styles.contactIcon} />
                    <span>{companyInfo.phone}</span>
                  </div>
                )}
                {companyInfo.email && (
                  <div className={styles.contactItem}>
                    <Mail className={styles.contactIcon} />
                    <span>{companyInfo.email}</span>
                  </div>
                )}
              </div>
              
              {/* Social Links */}
              {showSocial && (
                <div className={styles.socialLinks}>
                  {socialLinks.facebook && (
                    <Link
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Facebook"
                    >
                      <Facebook className={styles.socialIcon} />
                    </Link>
                  )}
                  {socialLinks.twitter && (
                    <Link
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Twitter"
                    >
                      <Twitter className={styles.socialIcon} />
                    </Link>
                  )}
                  {socialLinks.instagram && (
                    <Link
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Instagram"
                    >
                      <Instagram className={styles.socialIcon} />
                    </Link>
                  )}
                  {socialLinks.youtube && (
                    <Link
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="YouTube"
                    >
                      <Youtube className={styles.socialIcon} />
                    </Link>
                  )}
                </div>
              )}
            </div>
            
            {/* Quick Links */}
            <div className={styles.linkSection}>
              <h3 className={styles.linkTitle}>Quick Links</h3>
              <ul className={styles.linkList}>
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <Link href={link.href} className={styles.footerLink}>
                        <Icon className={styles.linkIcon} />
                        <span>{link.name}</span>
                        <ArrowRight className={styles.linkArrow} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            {/* Genres */}
            <div className={styles.linkSection}>
              <h3 className={styles.linkTitle}>Genres</h3>
              <ul className={styles.linkList}>
                {genreLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className={styles.footerLink}>
                      <span>{link.name}</span>
                      <ArrowRight className={styles.linkArrow} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Support */}
            <div className={styles.linkSection}>
              <h3 className={styles.linkTitle}>Support</h3>
              <ul className={styles.linkList}>
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className={styles.footerLink}>
                      <span>{link.name}</span>
                      <ExternalLink className={styles.linkIcon} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Newsletter */}
            {showNewsletter && (
              <div className={styles.newsletterSection}>
                <h3 className={styles.linkTitle}>Stay Updated</h3>
                <p className={styles.newsletterDescription}>
                  Get the latest movie reviews, news, and exclusive content from Nollywood.
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
                  <div className={styles.newsletterInput}>
                    <Mail className={styles.newsletterIcon} />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.newsletterField}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.newsletterButton}
                  >
                    {isSubmitting ? (
                      "Subscribing..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </form>
                
                <p className={styles.newsletterTerms}>
                  By subscribing, you agree to our{" "}
                  <Link href="/privacy" className={styles.termsLink}>
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" className={styles.termsLink}>
                    Terms of Service
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
          
          {/* Bottom Footer */}
          <div className={styles.bottomFooter}>
            <div className={styles.bottomLeft}>
              <p className={styles.copyright}>
                © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
              </p>
              <p className={styles.madeWith}>
                Made with <Heart className={styles.heartIcon} /> in Nigeria
              </p>
            </div>
            
            <div className={styles.bottomRight}>
              <div className={styles.legalLinks}>
                {legalLinks.map((link, index) => (
                  <React.Fragment key={link.name}>
                    <Link href={link.href} className={styles.legalLink}>
                      {link.name}
                    </Link>
                    {index < legalLinks.length - 1 && (
                      <span className={styles.linkSeparator}>•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
} 