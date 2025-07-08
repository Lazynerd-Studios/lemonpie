import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./section.module.css";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "hero" | "dark" | "light";
  size?: "default" | "small" | "large";
  fullWidth?: boolean;
}

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

interface SectionSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionActionsProps {
  children: React.ReactNode;
  className?: string;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ children, className, variant = "default", size = "default", fullWidth = false, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          styles.section,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);
Section.displayName = "Section";

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ children, className, align = "left", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.header,
          styles[`align-${align}`],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SectionHeader.displayName = "SectionHeader";

const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ children, className, as: Component = "h2", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(styles.title, className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
SectionTitle.displayName = "SectionTitle";

const SectionSubtitle = React.forwardRef<HTMLParagraphElement, SectionSubtitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(styles.subtitle, className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
SectionSubtitle.displayName = "SectionSubtitle";

const SectionContent = React.forwardRef<HTMLDivElement, SectionContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.content, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SectionContent.displayName = "SectionContent";

const SectionActions = React.forwardRef<HTMLDivElement, SectionActionsProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.actions, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SectionActions.displayName = "SectionActions";

export {
  Section,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  SectionContent,
  SectionActions,
}; 