"use client";

import { type ReactNode } from "react";
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
import { useQueryClient } from "@tanstack/react-query";

type Props =
  | {
      queryKeys?: string[]; // must exist
      refetch?: never; // can't exist if queryKeys is present
      title: string;
      description?: string;
      primaryActions?: ReactNode; // optional buttons
      secondaryLink?: {
        href: string;
        label: string;
        icon?: ReactNode;
      };
      showRetry?: boolean;
    }
  | {
      queryKeys?: never; // can't exist if refetch is present
      refetch?: () => void; // must exist
      title: string;
      description?: string;
      primaryActions?: ReactNode; // optional buttons
      secondaryLink?: {
        href: string;
        label: string;
        icon?: ReactNode;
      };
      showRetry?: boolean;
    };

export function ErrorState({
  title,
  description,
  primaryActions,
  secondaryLink,
  queryKeys,
  refetch,
  showRetry,
}: Props) {
  const qc = useQueryClient();
  const showRetryBtn = refetch || queryKeys;
  const handleRefetch = () => {
    if (queryKeys && queryKeys.length >= 1) {
      for (const q of queryKeys) {
        qc.invalidateQueries({ queryKey: [q] });
      }
    } else if (refetch) {
      refetch();
    }
  };

  return (
    <Empty className="min-h-[400px] flex justify-center items-center flex-col">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>

      {showRetryBtn && (
        <Button size="sm" onClick={handleRefetch}>
          Retry now
        </Button>
      )}
      {primaryActions && <EmptyContent>{primaryActions}</EmptyContent>}

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
