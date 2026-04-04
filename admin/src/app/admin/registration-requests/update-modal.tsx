"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { useUpdateRegisterationStatusMutation } from "@/hooks/api/use-registration-request";
import { Spinner } from "@/components/ui/spinner";

export interface Registration {
  id: string;
  companyName: string;
  registrationType: "OWNER" | "BROKER";
  companyDescription: string | null;
  businessFileUrl: string | null;
  nationalId?: string | null;
  contactName: string;
  email: string;
  password: string;
  phone: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

interface RegistrationModalProps {
  registration: Registration;
  onClose: () => void;
  onStatusUpdate: (id: string, newStatus: string) => void;
}

export function RegistrationModal({
  registration,
  onClose,
  onStatusUpdate,
}: RegistrationModalProps) {
  const [newStatus, setNewStatus] = useState(registration.status);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const updateMutation = useUpdateRegisterationStatusMutation();

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "bg-warning/10 text-warning border-warning/20",
      APPROVED: "bg-success/10 text-success border-success/20",
      REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return variants[status as keyof typeof variants] || variants.PENDING;
  };

  const getRegistrationTypeBadge = (type: string) => {
    return type === "OWNER"
      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
      : "bg-purple-500/10 text-purple-500 border-purple-500/20";
  };

  // const handleStatusChange = () => {
  //   if (newStatus !== registration.status) {
  //     setShowConfirmDialog(true);
  //   }
  // };

  const confirmStatusChange = async () => {
    await updateMutation.mutateAsync({ id: registration.id, newStatus });

    setShowConfirmDialog(false);
    onStatusUpdate(registration.id, newStatus);
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Registration Details</DialogTitle>
            <DialogDescription>
              Review and manage {registration.registrationType.toLowerCase()}{" "}
              registration request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Status Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">
                  Current Status:
                </span>
                <Badge
                  variant="outline"
                  className={getStatusBadge(registration.status)}
                >
                  {registration.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Label htmlFor="status" className="text-sm font-medium">
                  Update Status:
                </Label>
                <Select value={newStatus} onValueChange={setNewStatus as any}>
                  <SelectTrigger id="status" className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={confirmStatusChange}
                  disabled={
                    updateMutation.isPending ||
                    newStatus === registration.status
                  }
                  size="sm"
                >
                  {updateMutation.isPending ? <Spinner /> : "Update"}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Registration Type
              </h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={getRegistrationTypeBadge(
                    registration.registrationType
                  )}
                >
                  {registration.registrationType}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {registration.registrationType === "OWNER"
                    ? "Company Owner Registration"
                    : "Broker Registration"}
                </span>
              </div>
            </div>

            {registration.registrationType === "OWNER" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Company Name
                    </Label>
                    <p className="text-foreground font-medium">
                      {registration.companyName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Registration ID
                    </Label>
                    <p className="text-foreground font-mono text-sm">
                      {registration.id}
                    </p>
                  </div>
                </div>
                {registration.companyDescription && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="text-foreground leading-relaxed">
                      {registration.companyDescription}
                    </p>
                  </div>
                )}
                {registration.businessFileUrl && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Business License
                    </Label>
                    <a
                      href={registration.businessFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      View Business License
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {registration.nationalId && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">National Id</Label>
                    <a
                      href={registration.nationalId}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      View National ID
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {registration.registrationType === "BROKER" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Broker Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Broker Name</Label>
                    <p className="text-foreground font-medium">
                      {registration.contactName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Registration ID
                    </Label>
                    <p className="text-foreground font-mono text-sm">
                      {registration.id}
                    </p>
                  </div>
                </div>
                {registration.nationalId && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      National ID Document
                    </Label>
                    <a
                      href={registration.nationalId}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      View National ID
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Contact Name
                  </Label>
                  <p className="text-foreground font-medium">
                    {registration.contactName}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <p className="text-foreground">{registration.email}</p>
                </div>
                {registration.phone && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <p className="text-foreground">{registration.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Created At</Label>
                  <p className="text-foreground">
                    {new Date(registration.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="text-foreground">
                    {new Date(registration.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to change the status of this registration from{" "}
              <span className="font-semibold">{registration.status}</span> to{" "}
              <span className="font-semibold">{newStatus}</span>. This action
              will be recorded and may trigger notifications to the applicant.
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmStatusChange}
                disabled={updateMutation.isPending}
              >
                Confirm Update
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AlertDialog> */}
    </>
  );
}
