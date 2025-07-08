import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./animations.module.css";

interface AnimationProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  delay?: number;
  duration?: number;
  easing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
  trigger?: "hover" | "click" | "focus" | "visible" | "always";
  repeat?: boolean;
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
}

interface FadeProps extends AnimationProps {
  from?: "top" | "bottom" | "left" | "right" | "center";
  distance?: "sm" | "md" | "lg" | "xl";
}

interface ScaleProps extends AnimationProps {
  from?: number;
  to?: number;
  origin?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

interface SlideProps extends AnimationProps {
  from?: "top" | "bottom" | "left" | "right";
  distance?: "sm" | "md" | "lg" | "xl";
}

interface RotateProps extends AnimationProps {
  from?: number;
  to?: number;
  origin?: "center" | "top" | "bottom" | "left" | "right";
}

interface FloatProps extends AnimationProps {
  intensity?: "sm" | "md" | "lg";
}

interface PulseProps extends AnimationProps {
  intensity?: "sm" | "md" | "lg";
}

interface ShakeProps extends AnimationProps {
  intensity?: "sm" | "md" | "lg";
}

interface BounceProps extends AnimationProps {
  intensity?: "sm" | "md" | "lg";
}

interface GlowProps extends AnimationProps {
  color?: string;
  intensity?: "sm" | "md" | "lg";
}

// Base Animation Component
const BaseAnimation = React.forwardRef<HTMLDivElement, AnimationProps & { 
  animationType: string; 
  variant?: string;
  style?: React.CSSProperties;
}>(({ 
  children, 
  className, 
  disabled = false,
  delay = 0,
  duration = 300,
  easing = "ease",
  trigger = "hover",
  repeat = false,
  direction = "normal",
  animationType,
  variant,
  style,
  ...props 
}, ref) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isTriggered, setIsTriggered] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);

  // Intersection Observer for visibility trigger
  React.useEffect(() => {
    if (trigger !== "visible") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [trigger]);

  // Always trigger for "always" type
  React.useEffect(() => {
    if (trigger === "always") {
      setIsTriggered(true);
    }
  }, [trigger]);

  const handleMouseEnter = () => {
    if (trigger === "hover") setIsTriggered(true);
  };

  const handleMouseLeave = () => {
    if (trigger === "hover") setIsTriggered(false);
  };

  const handleClick = () => {
    if (trigger === "click") setIsTriggered(!isTriggered);
  };

  const handleFocus = () => {
    if (trigger === "focus") setIsTriggered(true);
  };

  const handleBlur = () => {
    if (trigger === "focus") setIsTriggered(false);
  };

  const animationClasses = cn(
    styles.animation,
    styles[animationType],
    variant && styles[variant],
    styles[`trigger-${trigger}`],
    styles[`easing-${easing}`],
    styles[`direction-${direction}`],
    (isTriggered || isVisible) && styles.active,
    repeat && styles.repeat,
    disabled && styles.disabled,
    className
  );

  const animationStyle: React.CSSProperties = {
    ...style,
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
  };

  return (
    <div
      ref={elementRef}
      className={animationClasses}
      style={animationStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </div>
  );
});
BaseAnimation.displayName = "BaseAnimation";

// Fade Animation
export const FadeIn = React.forwardRef<HTMLDivElement, FadeProps>(
  ({ from = "bottom", distance = "md", ...props }, ref) => (
    <BaseAnimation
      ref={ref}
      animationType="fade"
      variant={`fade-from-${from}-${distance}`}
      {...props}
    />
  )
);
FadeIn.displayName = "FadeIn";

// Scale Animation
export const ScaleIn = React.forwardRef<HTMLDivElement, ScaleProps>(
  ({ from = 0.8, to = 1, origin = "center", ...props }, ref) => (
    <BaseAnimation
      ref={ref}
      animationType="scale"
      variant={`scale-${origin}`}
      style={{
        "--scale-from": from,
        "--scale-to": to,
      } as React.CSSProperties}
      {...props}
    />
  )
);
ScaleIn.displayName = "ScaleIn";

// Slide Animation
export const SlideIn = React.forwardRef<HTMLDivElement, SlideProps>(
  ({ from = "bottom", distance = "md", ...props }, ref) => (
    <BaseAnimation
      ref={ref}
      animationType="slide"
      variant={`slide-from-${from}-${distance}`}
      {...props}
    />
  )
);
SlideIn.displayName = "SlideIn";

// Rotate Animation
export const RotateIn = React.forwardRef<HTMLDivElement, RotateProps>(
  ({ from = 0, to = 360, origin = "center", ...props }, ref) => (
    <BaseAnimation
      ref={ref}
      animationType="rotate"
      variant={`rotate-${origin}`}
      style={{
        "--rotate-from": `${from}deg`,
        "--rotate-to": `${to}deg`,
      } as React.CSSProperties}
      {...props}
    />
  )
);
RotateIn.displayName = "RotateIn";

// Float Animation
export const Float = React.forwardRef<HTMLDivElement, FloatProps>(
  ({ intensity = "md", ...props }, ref) => (
    <BaseAnimation
      ref={ref}
      animationType="float"
      variant={`float-${intensity}`}
      trigger="always"
      repeat={true}
      {...props}
    />
  )
);
Float.displayName = "Float";

// Pulse Animation
export const Pulse = React.forwardRef<HTMLDivElement, PulseProps>(
  ({ intensity = "md", ...props }, ref) => (
    <BaseAnimation
      ref={ref}
      animationType="pulse"
      variant={`pulse-${intensity}`}
      trigger="always"
      repeat={true}
      {...props}
    />
  )
);
Pulse.displayName = "Pulse";

// Shake Animation
export const Shake = React.forwardRef<HTMLDivElement, ShakeProps>(
  ({ intensity = "md", ...props }, ref) => (
    <BaseAnimation
      ref={ref}
      animationType="shake"
      variant={`shake-${intensity}`}
      {...props}
    />
  )
);
Shake.displayName = "Shake";

// Bounce Animation
export const Bounce = React.forwardRef<HTMLDivElement, BounceProps>(
  ({ intensity = "md", ...props }, ref) => (
    <BaseAnimation
      ref={ref}
      animationType="bounce"
      variant={`bounce-${intensity}`}
      {...props}
    />
  )
);
Bounce.displayName = "Bounce";

// Glow Animation
export const Glow = React.forwardRef<HTMLDivElement, GlowProps>(
  ({ color = "var(--primary)", intensity = "md", ...props }, ref) => (
    <BaseAnimation
      ref={ref}
      animationType="glow"
      variant={`glow-${intensity}`}
      style={{
        "--glow-color": color,
      } as React.CSSProperties}
      {...props}
    />
  )
);
Glow.displayName = "Glow";

// Stagger Animation (for lists)
interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  animation?: "fade" | "scale" | "slide";
  from?: "top" | "bottom" | "left" | "right";
}

export const Stagger = React.forwardRef<HTMLDivElement, StaggerProps>(
  ({ 
    children, 
    className, 
    delay = 0, 
    staggerDelay = 100,
    animation = "fade",
    from = "bottom",
    ...props 
  }, ref) => {
    const childrenArray = React.Children.toArray(children);
    
    return (
      <div ref={ref} className={cn(styles.stagger, className)} {...props}>
        {childrenArray.map((child, index) => {
          const AnimationComponent = animation === "fade" ? FadeIn : 
                                   animation === "scale" ? ScaleIn : 
                                   SlideIn;
          
          return (
            <AnimationComponent
              key={index}
              delay={delay + (index * staggerDelay)}
              trigger="visible"
              from={from}
            >
              {child}
            </AnimationComponent>
          );
        })}
      </div>
    );
  }
);
Stagger.displayName = "Stagger";

// Hover Effects
interface HoverEffectProps {
  children: React.ReactNode;
  className?: string;
  effect?: "lift" | "glow" | "tilt" | "zoom" | "rotate" | "bounce" | "slide";
  intensity?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export const HoverEffect = React.forwardRef<HTMLDivElement, HoverEffectProps>(
  ({ 
    children, 
    className, 
    effect = "lift",
    intensity = "md",
    disabled = false,
    ...props 
  }, ref) => {
    const hoverClasses = cn(
      styles.hoverEffect,
      styles[`hover-${effect}`],
      styles[`intensity-${intensity}`],
      disabled && styles.disabled,
      className
    );

    return (
      <div ref={ref} className={hoverClasses} {...props}>
        {children}
      </div>
    );
  }
);
HoverEffect.displayName = "HoverEffect";

// Click Effect
interface ClickEffectProps {
  children: React.ReactNode;
  className?: string;
  effect?: "ripple" | "scale" | "bounce" | "pulse";
  color?: string;
  disabled?: boolean;
}

export const ClickEffect = React.forwardRef<HTMLDivElement, ClickEffectProps>(
  ({ 
    children, 
    className, 
    effect = "ripple",
    color = "var(--primary)",
    disabled = false,
    ...props 
  }, ref) => {
    const [isClicked, setIsClicked] = React.useState(false);
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
    
    const handleClick = (e: React.MouseEvent) => {
      if (disabled) return;
      
      setIsClicked(true);
      
      if (effect === "ripple") {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        
        setRipples(prev => [...prev, { x, y, id }]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== id));
        }, 600);
      }
      
      setTimeout(() => setIsClicked(false), 150);
    };

    const clickClasses = cn(
      styles.clickEffect,
      styles[`click-${effect}`],
      isClicked && styles.clicked,
      disabled && styles.disabled,
      className
    );

    return (
      <div 
        ref={ref} 
        className={clickClasses} 
        onClick={handleClick}
        style={{
          "--ripple-color": color,
        } as React.CSSProperties}
        {...props}
      >
        {children}
        {effect === "ripple" && (
          <div className={styles.rippleContainer}>
            {ripples.map((ripple) => (
              <div
                key={ripple.id}
                className={styles.ripple}
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
ClickEffect.displayName = "ClickEffect";

// Motion Container (combines multiple effects)
interface MotionContainerProps {
  children: React.ReactNode;
  className?: string;
  hover?: HoverEffectProps["effect"];
  click?: ClickEffectProps["effect"];
  entrance?: "fade" | "scale" | "slide";
  from?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
}

export const MotionContainer = React.forwardRef<HTMLDivElement, MotionContainerProps>(
  ({ 
    children, 
    className, 
    hover = "lift",
    click = "ripple",
    entrance = "fade",
    from = "bottom",
    disabled = false,
    ...props 
  }, ref) => {
    const EntranceAnimation = entrance === "fade" ? FadeIn : 
                             entrance === "scale" ? ScaleIn : 
                             SlideIn;

    return (
      <EntranceAnimation trigger="visible" from={from} disabled={disabled}>
        <HoverEffect effect={hover} disabled={disabled}>
          <ClickEffect 
            ref={ref} 
            effect={click} 
            disabled={disabled}
            className={className}
            {...props}
          >
            {children}
          </ClickEffect>
        </HoverEffect>
      </EntranceAnimation>
    );
  }
);
MotionContainer.displayName = "MotionContainer";

// Parallax Effect
interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  disabled?: boolean;
}

export const Parallax = React.forwardRef<HTMLDivElement, ParallaxProps>(
  ({ 
    children, 
    className, 
    speed = 0.5,
    direction = "up",
    disabled = false,
    ...props 
  }, ref) => {
    const [offset, setOffset] = React.useState(0);
    const elementRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (disabled) return;

      const handleScroll = () => {
        if (!elementRef.current) return;
        
        const scrolled = window.pageYOffset;
        const rect = elementRef.current.getBoundingClientRect();
        const elementTop = rect.top + scrolled;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        // Calculate offset based on scroll position
        const offsetValue = (scrolled - elementTop + windowHeight) * speed;
        setOffset(offsetValue);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [speed, disabled]);

    const transform = {
      up: `translateY(${-offset}px)`,
      down: `translateY(${offset}px)`,
      left: `translateX(${-offset}px)`,
      right: `translateX(${offset}px)`,
    };

    const parallaxClasses = cn(
      styles.parallax,
      disabled && styles.disabled,
      className
    );

    return (
      <div
        ref={elementRef}
        className={parallaxClasses}
        style={{
          transform: transform[direction],
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Parallax.displayName = "Parallax"; 