"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Bed, ExternalLink, ImageIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useDeletePropertyMutation } from "@/hooks/api/use-property";
import { useAuthSession } from "@/hooks/use-auth-session";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface PropertyCardProps {
  property: any;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images?.[0]?.url;
  const router = useRouter();
  const { role } = useAuthSession();
  const deleteMutation = useDeletePropertyMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Card className="group overflow-hidden border-border bg-card transition-all hover:border-accent/50">
      <div className="flex flex-col gap-4 p-6 sm:flex-row">
        {/* Image */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg bg-secondary sm:h-32 sm:w-48">
          {mainImage ? (
            <img
              src={mainImage || "/placeholder.svg"}
              alt={property?.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {property?.images?.length > 1 && (
            <div className="absolute bottom-2 right-2 rounded-md bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
              +{property?.images.length - 1} more
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold leading-tight text-foreground transition-colors">
                  {property?.name}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{property?.address}</span>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="shrink-0 bg-accent/10 text-accent border-accent/20"
              >
                {property?.type}
              </Badge>
            </div>

            {/* Description */}
            {property.about?.description && (
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {property.about.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Bed className="h-3.5 w-3.5" />
                <span>
                  {property._count?.rooms}{" "}
                  {property._count?.rooms === 1 ? "room" : "rooms"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge>{"Pending"}</Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Created{" "}
                  {format(new Date(property?.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              {property.licenseId && (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono">
                    License: {property?.licenseId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => router.push(`/admin/properties/${property?.id}`)}
            >
              View Details
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Button>
            {role === "ADMIN" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{property?.name}"? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(property.id, { onSuccess: () => setConfirmDelete(false) })}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
