import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  className?: string
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md",
        "bg-gray-200 dark:bg-gray-700", // visible in both light and dark mode
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
