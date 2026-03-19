"use client";

import { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface ErrorStateProps {
  title: string;
  description?: string;
  primaryActions?: ReactNode; // optional buttons
  secondaryLink?: {
    href: string;
    label: string;
    icon?: ReactNode;
  };
}

export function ErrorState({
  title,
  description,
  primaryActions,
  secondaryLink,
}: ErrorStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </EmptyMedia>
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
            {secondaryLink.label}
            {secondaryLink.icon && (
              <span className="ml-1">{secondaryLink.icon}</span>
            )}
          </a>
        </Button>
      )}
    </Empty>
  );
}
