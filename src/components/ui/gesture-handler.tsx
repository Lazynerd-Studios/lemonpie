import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./gesture-handler.module.css";

interface GestureState {
  isActive: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  distance: number;
  direction: "left" | "right" | "up" | "down" | null;
  velocity: number;
  timestamp: number;
}

interface SwipeGestureProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  threshold?: number;
  velocityThreshold?: number;
  preventDefaultEvents?: boolean;
  onSwipeLeft?: (state: GestureState) => void;
  onSwipeRight?: (state: GestureState) => void;
  onSwipeUp?: (state: GestureState) => void;
  onSwipeDown?: (state: GestureState) => void;
  onSwipeStart?: (state: GestureState) => void;
  onSwipeMove?: (state: GestureState) => void;
  onSwipeEnd?: (state: GestureState) => void;
}

interface TapGestureProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  maxDistance?: number;
  maxDuration?: number;
  doubleTapDelay?: number;
  onTap?: (event: React.TouchEvent | React.MouseEvent) => void;
  onDoubleTap?: (event: React.TouchEvent | React.MouseEvent) => void;
  onLongPress?: (event: React.TouchEvent | React.MouseEvent) => void;
  longPressDelay?: number;
}

interface PinchGestureProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  threshold?: number;
  onPinchStart?: (scale: number, center: { x: number; y: number }) => void;
  onPinchMove?: (scale: number, center: { x: number; y: number }) => void;
  onPinchEnd?: (scale: number, center: { x: number; y: number }) => void;
}

interface DragGestureProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  axis?: "x" | "y" | "both";
  bounds?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  onDragStart?: (position: { x: number; y: number }) => void;
  onDragMove?: (position: { x: number; y: number }, delta: { x: number; y: number }) => void;
  onDragEnd?: (position: { x: number; y: number }, velocity: { x: number; y: number }) => void;
}

// Utility functions
const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const getDirection = (deltaX: number, deltaY: number): "left" | "right" | "up" | "down" | null => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? "right" : "left";
  } else {
    return deltaY > 0 ? "down" : "up";
  }
};

const getVelocity = (distance: number, time: number): number => {
  return time > 0 ? distance / time : 0;
};

const getTouchPoint = (event: React.TouchEvent | TouchEvent): { x: number; y: number } => {
  return {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
  };
};

const getMousePoint = (event: React.MouseEvent | MouseEvent): { x: number; y: number } => {
  return {
    x: event.clientX,
    y: event.clientY,
  };
};

// Swipe Gesture Handler
export const SwipeGesture = React.forwardRef<HTMLDivElement, SwipeGestureProps>(
  ({ 
    children, 
    className, 
    disabled = false,
    threshold = 50,
    velocityThreshold = 0.3,
    preventDefaultEvents = false,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onSwipeStart,
    onSwipeMove,
    onSwipeEnd,
    ...props 
  }, ref) => {
    const [gestureState, setGestureState] = React.useState<GestureState>({
      isActive: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0,
      distance: 0,
      direction: null,
      velocity: 0,
      timestamp: 0,
    });

    const handleStart = (event: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      
      if (preventDefaultEvents) {
        event.preventDefault();
      }

      const point = 'touches' in event ? getTouchPoint(event) : getMousePoint(event);
      const newState: GestureState = {
        isActive: true,
        startX: point.x,
        startY: point.y,
        currentX: point.x,
        currentY: point.y,
        deltaX: 0,
        deltaY: 0,
        distance: 0,
        direction: null,
        velocity: 0,
        timestamp: Date.now(),
      };

      setGestureState(newState);
      onSwipeStart?.(newState);
    };

    const handleMove = (event: React.TouchEvent | React.MouseEvent) => {
      if (disabled || !gestureState.isActive) return;
      
      if (preventDefaultEvents) {
        event.preventDefault();
      }

      const point = 'touches' in event ? getTouchPoint(event) : getMousePoint(event);
      const deltaX = point.x - gestureState.startX;
      const deltaY = point.y - gestureState.startY;
      const distance = getDistance(gestureState.startX, gestureState.startY, point.x, point.y);
      const direction = getDirection(deltaX, deltaY);
      const timeDelta = Date.now() - gestureState.timestamp;
      const velocity = getVelocity(distance, timeDelta);

      const newState: GestureState = {
        ...gestureState,
        currentX: point.x,
        currentY: point.y,
        deltaX,
        deltaY,
        distance,
        direction,
        velocity,
      };

      setGestureState(newState);
      onSwipeMove?.(newState);
    };

    const handleEnd = (event: React.TouchEvent | React.MouseEvent) => {
      if (disabled || !gestureState.isActive) return;
      
      if (preventDefaultEvents) {
        event.preventDefault();
      }

      const finalState = { ...gestureState, isActive: false };
      setGestureState(finalState);
      onSwipeEnd?.(finalState);

      // Trigger swipe events based on threshold and velocity
      if (Math.abs(finalState.deltaX) > threshold || Math.abs(finalState.deltaY) > threshold) {
        if (finalState.velocity > velocityThreshold) {
          switch (finalState.direction) {
            case "left":
              onSwipeLeft?.(finalState);
              break;
            case "right":
              onSwipeRight?.(finalState);
              break;
            case "up":
              onSwipeUp?.(finalState);
              break;
            case "down":
              onSwipeDown?.(finalState);
              break;
          }
        }
      }
    };

    const swipeClasses = cn(
      styles.swipeContainer,
      gestureState.isActive && styles.active,
      disabled && styles.disabled,
      className
    );

    return (
      <div
        ref={ref}
        className={swipeClasses}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SwipeGesture.displayName = "SwipeGesture";

// Tap Gesture Handler
export const TapGesture = React.forwardRef<HTMLDivElement, TapGestureProps>(
  ({ 
    children, 
    className, 
    disabled = false,
    maxDistance = 10,
    maxDuration = 500,
    doubleTapDelay = 300,
    longPressDelay = 500,
    onTap,
    onDoubleTap,
    onLongPress,
    ...props 
  }, ref) => {
    const [tapState, setTapState] = React.useState({
      startTime: 0,
      startX: 0,
      startY: 0,
      tapCount: 0,
      lastTapTime: 0,
    });

    const longPressTimeoutRef = React.useRef<NodeJS.Timeout>();
    const doubleTapTimeoutRef = React.useRef<NodeJS.Timeout>();

    const handleStart = (event: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;

      const point = 'touches' in event ? getTouchPoint(event) : getMousePoint(event);
      const currentTime = Date.now();

      setTapState(prev => ({
        ...prev,
        startTime: currentTime,
        startX: point.x,
        startY: point.y,
      }));

      // Start long press timer
      longPressTimeoutRef.current = setTimeout(() => {
        onLongPress?.(event);
      }, longPressDelay);
    };

    const handleMove = (event: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;

      const point = 'touches' in event ? getTouchPoint(event) : getMousePoint(event);
      const distance = getDistance(tapState.startX, tapState.startY, point.x, point.y);

      // Cancel long press if moved too far
      if (distance > maxDistance && longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = undefined;
      }
    };

    const handleEnd = (event: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;

      const currentTime = Date.now();
      const duration = currentTime - tapState.startTime;
      const point = 'touches' in event ? getTouchPoint(event) : getMousePoint(event);
      const distance = getDistance(tapState.startX, tapState.startY, point.x, point.y);

      // Clear long press timer
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = undefined;
      }

      // Check if it's a valid tap
      if (duration <= maxDuration && distance <= maxDistance) {
        const timeSinceLastTap = currentTime - tapState.lastTapTime;

        if (timeSinceLastTap <= doubleTapDelay && tapState.tapCount === 1) {
          // Double tap
          if (doubleTapTimeoutRef.current) {
            clearTimeout(doubleTapTimeoutRef.current);
            doubleTapTimeoutRef.current = undefined;
          }
          onDoubleTap?.(event);
          setTapState(prev => ({ ...prev, tapCount: 0, lastTapTime: currentTime }));
        } else {
          // Single tap (but wait for potential double tap)
          setTapState(prev => ({ ...prev, tapCount: 1, lastTapTime: currentTime }));
          
          doubleTapTimeoutRef.current = setTimeout(() => {
            onTap?.(event);
            setTapState(prev => ({ ...prev, tapCount: 0 }));
          }, doubleTapDelay);
        }
      } else {
        // Reset tap count if not a valid tap
        setTapState(prev => ({ ...prev, tapCount: 0 }));
      }
    };

    // Cleanup timeouts
    React.useEffect(() => {
      return () => {
        if (longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current);
        }
        if (doubleTapTimeoutRef.current) {
          clearTimeout(doubleTapTimeoutRef.current);
        }
      };
    }, []);

    const tapClasses = cn(
      styles.tapContainer,
      disabled && styles.disabled,
      className
    );

    return (
      <div
        ref={ref}
        className={tapClasses}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TapGesture.displayName = "TapGesture";

// Pinch Gesture Handler
export const PinchGesture = React.forwardRef<HTMLDivElement, PinchGestureProps>(
  ({ 
    children, 
    className, 
    disabled = false,
    threshold = 0.1,
    onPinchStart,
    onPinchMove,
    onPinchEnd,
    ...props 
  }, ref) => {
    const [pinchState, setPinchState] = React.useState({
      isActive: false,
      initialDistance: 0,
      currentScale: 1,
      center: { x: 0, y: 0 },
    });

    const getTouchDistance = (event: TouchEvent | React.TouchEvent): number => {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      return getDistance(touch1.clientX, touch1.clientY, touch2.clientX, touch2.clientY);
    };

    const getTouchCenter = (event: TouchEvent | React.TouchEvent): { x: number; y: number } => {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
    };

    const handleStart = (event: React.TouchEvent) => {
      if (disabled || event.touches.length !== 2) return;

      const distance = getTouchDistance(event);
      const center = getTouchCenter(event);

      const newState = {
        isActive: true,
        initialDistance: distance,
        currentScale: 1,
        center,
      };

      setPinchState(newState);
      onPinchStart?.(1, center);
    };

    const handleMove = (event: React.TouchEvent) => {
      if (disabled || !pinchState.isActive || event.touches.length !== 2) return;

      const distance = getTouchDistance(event);
      const center = getTouchCenter(event);
      const scale = distance / pinchState.initialDistance;

      if (Math.abs(scale - 1) > threshold) {
        const newState = {
          ...pinchState,
          currentScale: scale,
          center,
        };

        setPinchState(newState);
        onPinchMove?.(scale, center);
      }
    };

    const handleEnd = (event: React.TouchEvent) => {
      if (disabled || !pinchState.isActive) return;

      const finalState = { ...pinchState, isActive: false };
      setPinchState(finalState);
      onPinchEnd?.(finalState.currentScale, finalState.center);
    };

    const pinchClasses = cn(
      styles.pinchContainer,
      pinchState.isActive && styles.active,
      disabled && styles.disabled,
      className
    );

    return (
      <div
        ref={ref}
        className={pinchClasses}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PinchGesture.displayName = "PinchGesture";

// Drag Gesture Handler
export const DragGesture = React.forwardRef<HTMLDivElement, DragGestureProps>(
  ({ 
    children, 
    className, 
    disabled = false,
    axis = "both",
    bounds,
    onDragStart,
    onDragMove,
    onDragEnd,
    ...props 
  }, ref) => {
    const [dragState, setDragState] = React.useState({
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      lastX: 0,
      lastY: 0,
      startTime: 0,
    });

    const constrainPosition = (x: number, y: number): { x: number; y: number } => {
      let constrainedX = x;
      let constrainedY = y;

      if (bounds) {
        if (bounds.left !== undefined) constrainedX = Math.max(constrainedX, bounds.left);
        if (bounds.right !== undefined) constrainedX = Math.min(constrainedX, bounds.right);
        if (bounds.top !== undefined) constrainedY = Math.max(constrainedY, bounds.top);
        if (bounds.bottom !== undefined) constrainedY = Math.min(constrainedY, bounds.bottom);
      }

      if (axis === "x") constrainedY = y;
      if (axis === "y") constrainedX = x;

      return { x: constrainedX, y: constrainedY };
    };

    const handleStart = (event: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;

      const point = 'touches' in event ? getTouchPoint(event) : getMousePoint(event);
      const constrainedPoint = constrainPosition(point.x, point.y);

      const newState = {
        isDragging: true,
        startX: constrainedPoint.x,
        startY: constrainedPoint.y,
        currentX: constrainedPoint.x,
        currentY: constrainedPoint.y,
        lastX: constrainedPoint.x,
        lastY: constrainedPoint.y,
        startTime: Date.now(),
      };

      setDragState(newState);
      onDragStart?.(constrainedPoint);
    };

    const handleMove = (event: React.TouchEvent | React.MouseEvent) => {
      if (disabled || !dragState.isDragging) return;

      const point = 'touches' in event ? getTouchPoint(event) : getMousePoint(event);
      const constrainedPoint = constrainPosition(point.x, point.y);
      const delta = {
        x: constrainedPoint.x - dragState.lastX,
        y: constrainedPoint.y - dragState.lastY,
      };

      const newState = {
        ...dragState,
        currentX: constrainedPoint.x,
        currentY: constrainedPoint.y,
        lastX: constrainedPoint.x,
        lastY: constrainedPoint.y,
      };

      setDragState(newState);
      onDragMove?.(constrainedPoint, delta);
    };

    const handleEnd = (event: React.TouchEvent | React.MouseEvent) => {
      if (disabled || !dragState.isDragging) return;

      const point = 'touches' in event ? getTouchPoint(event) : getMousePoint(event);
      const constrainedPoint = constrainPosition(point.x, point.y);
      const timeDelta = Date.now() - dragState.startTime;
      const velocity = {
        x: (constrainedPoint.x - dragState.startX) / timeDelta,
        y: (constrainedPoint.y - dragState.startY) / timeDelta,
      };

      const finalState = { ...dragState, isDragging: false };
      setDragState(finalState);
      onDragEnd?.(constrainedPoint, velocity);
    };

    const dragClasses = cn(
      styles.dragContainer,
      dragState.isDragging && styles.active,
      disabled && styles.disabled,
      className
    );

    return (
      <div
        ref={ref}
        className={dragClasses}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DragGesture.displayName = "DragGesture";

// Combined Gesture Handler
interface GestureHandlerProps extends 
  Omit<SwipeGestureProps, "children">,
  Omit<TapGestureProps, "children">,
  Omit<PinchGestureProps, "children">,
  Omit<DragGestureProps, "children"> {
  children: React.ReactNode;
  enableSwipe?: boolean;
  enableTap?: boolean;
  enablePinch?: boolean;
  enableDrag?: boolean;
}

export const GestureHandler = React.forwardRef<HTMLDivElement, GestureHandlerProps>(
  ({ 
    children, 
    enableSwipe = false,
    enableTap = false,
    enablePinch = false,
    enableDrag = false,
    ...props 
  }, ref) => {
    let GestureComponent = React.Fragment;
    let gestureProps = {};

    if (enableSwipe) {
      GestureComponent = SwipeGesture;
      gestureProps = {
        threshold: props.threshold,
        velocityThreshold: props.velocityThreshold,
        onSwipeLeft: props.onSwipeLeft,
        onSwipeRight: props.onSwipeRight,
        onSwipeUp: props.onSwipeUp,
        onSwipeDown: props.onSwipeDown,
        onSwipeStart: props.onSwipeStart,
        onSwipeMove: props.onSwipeMove,
        onSwipeEnd: props.onSwipeEnd,
      };
    } else if (enableTap) {
      GestureComponent = TapGesture;
      gestureProps = {
        maxDistance: props.maxDistance,
        maxDuration: props.maxDuration,
        doubleTapDelay: props.doubleTapDelay,
        longPressDelay: props.longPressDelay,
        onTap: props.onTap,
        onDoubleTap: props.onDoubleTap,
        onLongPress: props.onLongPress,
      };
    } else if (enablePinch) {
      GestureComponent = PinchGesture;
      gestureProps = {
        threshold: props.threshold,
        onPinchStart: props.onPinchStart,
        onPinchMove: props.onPinchMove,
        onPinchEnd: props.onPinchEnd,
      };
    } else if (enableDrag) {
      GestureComponent = DragGesture;
      gestureProps = {
        axis: props.axis,
        bounds: props.bounds,
        onDragStart: props.onDragStart,
        onDragMove: props.onDragMove,
        onDragEnd: props.onDragEnd,
      };
    }

    return (
      <GestureComponent
        ref={ref}
        className={props.className}
        disabled={props.disabled}
        {...gestureProps}
      >
        {children}
      </GestureComponent>
    );
  }
);
GestureHandler.displayName = "GestureHandler"; 