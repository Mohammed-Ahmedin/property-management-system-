"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Bed, ExternalLink, ImageIcon, Trash2, CheckCircle2, Clock, XCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useDeletePropertyMutation } from "@/hooks/api/use-property";
import { useAuthSession } from "@/hooks/use-auth-session";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PropertyCardProps { property: any; }

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  APPROVED: { label: "Approved", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800", icon: CheckCircle2 },
  PENDING:  { label: "Pending",  color: "text-amber-700 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",   icon: Clock },
  REJECTED: { label: "Rejected", color: "text-red-700 dark:text-red-400",       bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",           icon: XCircle },
};

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images?.[0]?.url;
  const router = useRouter();
  const { role } = useAuthSession();
  const deleteMutation = useDeletePropertyMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const status = statusConfig[property.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  return (
    <>
      <Card className="group overflow-hidden border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-200">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative sm:w-52 w-full h-44 sm:h-auto shrink-0 overflow-hidden bg-muted">
            {mainImage ? (
              <img src={mainImage} alt={property?.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground opacity-30" />
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent sm:bg-gradient-to-r" />
            {/* Image count */}
            {property?.images?.length > 1 && (
              <div className="absolute bottom-2 right-2 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-xs text-white">
                +{property.images.length - 1}
              </div>
            )}
            {/* Type badge */}
            <div className="absolute top-2 left-2">
              <Badge className="text-xs bg-primary/90 backdrop-blur-sm">{property?.type || "Property"}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-5">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                    {property?.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="line-clamp-1">{property?.address}</span>
                  </div>
                </div>
                <Badge variant="outline" className={cn("shrink-0 text-xs gap-1 flex items-center", status.bg, status.color)}>
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>
              </div>

              {property.about?.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                  {property.about.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-full">
                  <Bed className="h-3 w-3" />
                  <span>{property._count?.rooms ?? 0} rooms</span>
                </div>
                <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-full">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(property?.createdAt), "MMM d, yyyy")}</span>
                </div>
                {!property.visibility && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">Hidden</Badge>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border/50">
              <Button size="sm" className="gap-1.5 h-8"
                onClick={() => router.push(`/admin/properties/${property?.id}`)}>
                <Eye className="h-3.5 w-3.5" /> View Details
              </Button>
              {(role === "ADMIN" || role === "OWNER") && (
                <Button variant="outline" size="sm" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                  onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

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
    </>
  );
}
