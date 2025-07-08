import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./grid.module.css";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "movies" | "actors" | "reviews" | "masonry";
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  autoFit?: boolean;
  minItemWidth?: string;
  maxItemWidth?: string;
  responsive?: boolean;
}

interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  span?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  order?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  center?: boolean;
  fluid?: boolean;
}

interface FlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  responsive?: {
    xs?: Partial<FlexProps>;
    sm?: Partial<FlexProps>;
    md?: Partial<FlexProps>;
    lg?: Partial<FlexProps>;
    xl?: Partial<FlexProps>;
    "2xl"?: Partial<FlexProps>;
  };
}

// Grid Component
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    children, 
    className, 
    variant = "default",
    columns,
    gap = "md",
    align = "stretch",
    justify = "start",
    autoFit = false,
    minItemWidth = "280px",
    maxItemWidth = "1fr",
    responsive = true,
    ...props 
  }, ref) => {
    const gridStyle = React.useMemo(() => {
      const style: React.CSSProperties = {};
      
      if (autoFit) {
        style.gridTemplateColumns = `repeat(auto-fit, minmax(${minItemWidth}, ${maxItemWidth}))`;
      } else if (columns) {
        // Handle responsive columns
        const colClasses = [];
        if (columns.xs) colClasses.push(`xs:grid-cols-${columns.xs}`);
        if (columns.sm) colClasses.push(`sm:grid-cols-${columns.sm}`);
        if (columns.md) colClasses.push(`md:grid-cols-${columns.md}`);
        if (columns.lg) colClasses.push(`lg:grid-cols-${columns.lg}`);
        if (columns.xl) colClasses.push(`xl:grid-cols-${columns.xl}`);
        if (columns["2xl"]) colClasses.push(`2xl:grid-cols-${columns["2xl"]}`);
      }
      
      return style;
    }, [autoFit, minItemWidth, maxItemWidth, columns]);

    const gridClasses = cn(
      styles.grid,
      styles[variant],
      styles[`gap-${gap}`],
      styles[`align-${align}`],
      styles[`justify-${justify}`],
      responsive && styles.responsive,
      autoFit && styles.autoFit,
      // Responsive column classes
      columns?.xs && styles[`xs-cols-${columns.xs}`],
      columns?.sm && styles[`sm-cols-${columns.sm}`],
      columns?.md && styles[`md-cols-${columns.md}`],
      columns?.lg && styles[`lg-cols-${columns.lg}`],
      columns?.xl && styles[`xl-cols-${columns.xl}`],
      columns?.["2xl"] && styles[`2xl-cols-${columns["2xl"]}`],
      className
    );

    return (
      <div
        ref={ref}
        className={gridClasses}
        style={gridStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Grid.displayName = "Grid";

// Grid Item Component
export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ children, className, span, order, ...props }, ref) => {
    const itemClasses = cn(
      styles.gridItem,
      // Span classes
      span?.xs && styles[`xs-span-${span.xs}`],
      span?.sm && styles[`sm-span-${span.sm}`],
      span?.md && styles[`md-span-${span.md}`],
      span?.lg && styles[`lg-span-${span.lg}`],
      span?.xl && styles[`xl-span-${span.xl}`],
      span?.["2xl"] && styles[`2xl-span-${span["2xl"]}`],
      // Order classes
      order?.xs && styles[`xs-order-${order.xs}`],
      order?.sm && styles[`sm-order-${order.sm}`],
      order?.md && styles[`md-order-${order.md}`],
      order?.lg && styles[`lg-order-${order.lg}`],
      order?.xl && styles[`xl-order-${order.xl}`],
      order?.["2xl"] && styles[`2xl-order-${order["2xl"]}`],
      className
    );

    return (
      <div ref={ref} className={itemClasses} {...props}>
        {children}
      </div>
    );
  }
);
GridItem.displayName = "GridItem";

// Container Component
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    children, 
    className, 
    size = "xl",
    padding = "md",
    center = true,
    fluid = false,
    ...props 
  }, ref) => {
    const containerClasses = cn(
      styles.container,
      styles[`size-${size}`],
      styles[`padding-${padding}`],
      center && styles.center,
      fluid && styles.fluid,
      className
    );

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {children}
      </div>
    );
  }
);
Container.displayName = "Container";

// Flex Component
export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    children, 
    className, 
    direction = "row",
    wrap = "nowrap",
    align = "start",
    justify = "start",
    gap = "md",
    responsive,
    ...props 
  }, ref) => {
    const flexClasses = cn(
      styles.flex,
      styles[`direction-${direction}`],
      styles[`wrap-${wrap}`],
      styles[`align-${align}`],
      styles[`justify-${justify}`],
      styles[`gap-${gap}`],
      responsive && styles.responsive,
      className
    );

    return (
      <div ref={ref} className={flexClasses} {...props}>
        {children}
      </div>
    );
  }
);
Flex.displayName = "Flex";

// Specialized Layout Components
export const MovieGrid = React.forwardRef<HTMLDivElement, Omit<GridProps, "variant">>(
  (props, ref) => (
    <Grid
      ref={ref}
      variant="movies"
      columns={{
        xs: 2,
        sm: 3,
        md: 4,
        lg: 5,
        xl: 6,
        "2xl": 7
      }}
      gap="lg"
      {...props}
    />
  )
);
MovieGrid.displayName = "MovieGrid";

export const ActorGrid = React.forwardRef<HTMLDivElement, Omit<GridProps, "variant">>(
  (props, ref) => (
    <Grid
      ref={ref}
      variant="actors"
      columns={{
        xs: 2,
        sm: 3,
        md: 4,
        lg: 6,
        xl: 8,
        "2xl": 10
      }}
      gap="xl"
      {...props}
    />
  )
);
ActorGrid.displayName = "ActorGrid";

export const ReviewGrid = React.forwardRef<HTMLDivElement, Omit<GridProps, "variant">>(
  (props, ref) => (
    <Grid
      ref={ref}
      variant="reviews"
      columns={{
        xs: 1,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 3,
        "2xl": 4
      }}
      gap="lg"
      {...props}
    />
  )
);
ReviewGrid.displayName = "ReviewGrid";

export const MasonryGrid = React.forwardRef<HTMLDivElement, Omit<GridProps, "variant">>(
  (props, ref) => (
    <Grid
      ref={ref}
      variant="masonry"
      autoFit
      minItemWidth="320px"
      gap="lg"
      {...props}
    />
  )
);
MasonryGrid.displayName = "MasonryGrid";

// Layout utilities
export const Stack = React.forwardRef<HTMLDivElement, Omit<FlexProps, "direction">>(
  (props, ref) => (
    <Flex ref={ref} direction="column" {...props} />
  )
);
Stack.displayName = "Stack";

export const Inline = React.forwardRef<HTMLDivElement, Omit<FlexProps, "direction">>(
  (props, ref) => (
    <Flex ref={ref} direction="row" {...props} />
  )
);
Inline.displayName = "Inline";

export const Center = React.forwardRef<HTMLDivElement, Omit<FlexProps, "align" | "justify">>(
  (props, ref) => (
    <Flex ref={ref} align="center" justify="center" {...props} />
  )
);
Center.displayName = "Center";

export const Spacer = React.forwardRef<HTMLDivElement, { size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" }>(
  ({ size = "md", ...props }, ref) => (
    <div ref={ref} className={cn(styles.spacer, styles[`spacer-${size}`])} {...props} />
  )
);
Spacer.displayName = "Spacer"; 