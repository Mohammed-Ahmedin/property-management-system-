import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  primaryActions?: ReactNode; // e.g., buttons
  secondaryLink?: {
    href: string;
    label: string;
    icon?: ReactNode;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  primaryActions,
  secondaryLink,
}: EmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon ? icon : <FolderOpen />}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>

      {primaryActions && <EmptyContent>{primaryActions}</EmptyContent>}

      {secondaryLink && (
        <Button
          variant="link"
          asChild
          className="text-muted-foreground"
          size="sm"
        >
          <a href={secondaryLink.href}>
            {secondaryLink.label} {secondaryLink.icon && secondaryLink.icon}
          </a>
        </Button>
      )}
    </Empty>
  );
}
