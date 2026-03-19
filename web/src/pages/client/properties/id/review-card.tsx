"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/shared/avatar";
import { Button } from "@/components/ui/button";

export interface ReviewData {
  user: {
    name: string;
    id: string;
    email: string;
    image: string;
  };
  id: string;
  userId: string | null;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  rating: number | null;
}

interface ReviewCardProps {
  review: ReviewData;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { user, content, rating, createdAt } = review;
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      key={review.id}
      className="w-full border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <CardHeader className="flex justify-between gap-4 ">
        <div className="flex flex-row items-center gap-4">
          <Avatar src={user.image} fallback={user.name} className="h-10 w-10" />
          <div className="flex flex-col">
            <CardTitle className="text-base font-semibold">
              {user.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-end flex-col  mb-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < (rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            ))}
          </div>
          <p className="text-sm">{rating} / 5</p>
        </div>
      </CardHeader>

      <CardContent>
        {/* Review Content with expand/collapse */}
        <div className="relative">
          <p
            className={cn(
              "text-sm text-foreground leading-relaxed transition-all duration-300",
              !expanded && "line-clamp-3"
            )}
          >
            {content}
          </p>

          {/* Gradient fade effect when collapsed */}
          {!expanded && content.length > 180 && (
            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          )}
        </div>

        {/* Show more/less toggle */}
        {content.length > 180 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-2 flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
