"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full border-2 border-background shadow-sm transition-all duration-200",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-lg font-medium",
        lg: "h-12 w-12 text-xl font-medium",
        xl: "h-16 w-16 text-3xl font-semibold",
        "2xl": "h-20 w-20 text-4xl font-semibold",
      },
      variant: {
        default: "",
        ring: "ring-2 ring-offset-2 ring-offset-background",
        glow: "shadow-lg shadow-primary/25",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

// Gradient backgrounds based on first letter
const letterGradients: Record<string, string> = {
  A: "from-red-500 to-pink-500 dark:from-red-400 dark:to-pink-400",
  B: "from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400",
  C: "from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400",
  D: "from-purple-500 to-violet-500 dark:from-purple-400 dark:to-violet-400",
  E: "from-yellow-500 to-orange-500 dark:from-yellow-400 dark:to-orange-400",
  F: "from-pink-500 to-rose-500 dark:from-pink-400 dark:to-rose-400",
  G: "from-teal-500 to-green-500 dark:from-teal-400 dark:to-green-400",
  H: "from-indigo-500 to-blue-500 dark:from-indigo-400 dark:to-blue-400",
  I: "from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400",
  J: "from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-400",
  K: "from-violet-500 to-purple-500 dark:from-violet-400 dark:to-purple-400",
  L: "from-lime-500 to-green-500 dark:from-lime-400 dark:to-green-400",
  M: "from-fuchsia-500 to-pink-500 dark:from-fuchsia-400 dark:to-pink-400",
  N: "from-sky-500 to-blue-500 dark:from-sky-400 dark:to-blue-400",
  O: "from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400",
  P: "from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-400",
  Q: "from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400",
  R: "from-red-500 to-orange-500 dark:from-red-400 dark:to-orange-400",
  S: "from-slate-500 to-gray-500 dark:from-slate-400 dark:to-gray-400",
  T: "from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400",
  U: "from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400",
  V: "from-violet-500 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400",
  W: "from-green-500 to-lime-500 dark:from-green-400 dark:to-lime-400",
  X: "from-gray-500 to-slate-500 dark:from-gray-400 dark:to-slate-400",
  Y: "from-yellow-500 to-amber-500 dark:from-yellow-400 dark:to-amber-400",
  Z: "from-zinc-500 to-gray-500 dark:from-zinc-400 dark:to-gray-400",
};

interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: string;
  showFallback?: boolean;
  loading?: "eager" | "lazy";
  priority?: boolean;
  onImageError?: () => void;
  status?: "online" | "offline" | "away" | "busy";
  interactive?: boolean;
  showFallbackText?: boolean;
  redirectPath?: string;
  redirectToProfile?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      name = "",
      fallback,
      showFallback = true,
      size = "md",
      variant = "default",
      loading = "eager",
      priority = false,
      onImageError,
      status,
      interactive = false,
      showFallbackText = true,
      redirectPath,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const router = useRouter();

    // Generate initials from name
    const getInitials = (name: string): string => {
      if (!name) return "";
      return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    // Get gradient based on first letter
    const getGradientClass = (text: string): string => {
      const firstLetter = text.charAt(0).toUpperCase();
      return letterGradients[firstLetter] || letterGradients.A;
    };

    const handleImageError = () => {
      setImageError(true);
      onImageError?.();
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    const initials = getInitials(name);
    const displayText = fallback
      ? fallback.charAt(0).toUpperCase()
      : initials || "?";
    const displayFallback = !src || imageError;
    const gradientClass = getGradientClass(displayText);

    const statusColors = {
      online: "bg-green-500",
      offline: "bg-gray-400",
      away: "bg-yellow-500",
      busy: "bg-red-500",
    };

    const handleClick = () => {
      redirectPath && location.replace(redirectPath);
    };

    return (
      <div
        ref={ref}
        className={cn(
          avatarVariants({ size, variant }),
          interactive &&
            "cursor-pointer hover:scale-105 active:scale-95 hover:shadow-md",
          className
        )}
        onClick={props.onClick || handleClick}
        {...props}
      >
        {/* Main Avatar Content */}
        {displayFallback && showFallback ? (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br font-semibold text-white",
              gradientClass
            )}
            aria-label={alt || `Avatar for ${name}`}
          >
            {showFallbackText && displayText}
          </div>
        ) : (
          src && (
            <img
              src={src || "/placeholder.svg"}
              alt={alt || `Avatar for ${name}`}
              className="object-cover bg-black"
              loading={loading}
              onError={handleImageError}
              onLoad={handleImageLoad}
              sizes="(max-width: 768px) 100px, 200px"
            />
          )
        )}

        {/* Loading State */}
        {src && !imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse"></div>
        )}

        {/* Status Indicator */}
        {status && (
          <div
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
              statusColors[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar, type AvatarProps };
