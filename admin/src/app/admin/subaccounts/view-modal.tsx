"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SubAccount } from "@/types/subaccount.type";

interface SubaccountViewModalProps {
  subaccount: SubAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updated: Partial<SubAccount>) => void;
}

export function SubaccountViewModal({
  subaccount,
  isOpen,
  onClose,
  onSave,
}: SubaccountViewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<SubAccount>>({});

  useEffect(() => {
    if (subaccount) setFormData(subaccount); // Populate form when modal opens
  }, [subaccount]);

  if (!subaccount) return null;

  const handleChange = (key: keyof SubAccount, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave?.(formData);
    setIsEditing(false);
    onClose();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "bg-warning/10 text-warning border-warning/20",
      APPROVED: "bg-success/10 text-success border-success/20",
      REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
      ACTIVE: "bg-success/10 text-success border-success/20",
      INACTIVE: "bg-muted text-muted-foreground border-border",
    };
    return variants[status as keyof typeof variants] || variants.PENDING;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Subaccount Details</DialogTitle>
          <DialogDescription>
            View or edit subaccount information
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Account Name */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Account Name</label>
            {isEditing ? (
              <Input
                value={formData.accountName ?? ""}
                onChange={(e) => handleChange("accountName", e.target.value)}
              />
            ) : (
              <p className="py-2 px-2 border rounded bg-muted/10">
                {subaccount.accountName}
              </p>
            )}
          </div>

          {/* Business Name */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Business Name</label>
            {isEditing ? (
              <Input
                value={formData.businessName ?? ""}
                onChange={(e) => handleChange("businessName", e.target.value)}
              />
            ) : (
              <p className="py-2 px-2 border rounded bg-muted/10">
                {subaccount.businessName ?? "-"}
              </p>
            )}
          </div>

          {/* Account Number */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Account Number</label>
            {isEditing ? (
              <Input
                value={formData.accountNumber ?? ""}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
              />
            ) : (
              <p className="py-2 px-2 border rounded bg-muted/10">
                {subaccount.accountNumber}
              </p>
            )}
          </div>

          {/* Bank Code */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Bank Code</label>
            {isEditing ? (
              <Input
                value={formData.bankCode ?? ""}
                onChange={(e) => handleChange("bankCode", e.target.value)}
              />
            ) : (
              <p className="py-2 px-2 border rounded bg-muted/10">
                {subaccount.bankCode}
              </p>
            )}
          </div>

          {/* Type */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Type</label>
            {isEditing ? (
              <Select
                value={formData.type ?? ""}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNER">OWNER</SelectItem>
                  <SelectItem value="BROKER">BROKER</SelectItem>
                  <SelectItem value="PLATFORM">PLATFORM</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className="py-2 px-2">
                {subaccount.type}
              </Badge>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Status</label>
            {isEditing ? (
              <Select
                value={formData.status ?? ""}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge
                variant="outline"
                className={getStatusBadge(subaccount.status)}
              >
                {subaccount.status}
              </Badge>
            )}
          </div>

          {/* Created */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Created At</label>
            <p className="py-2 px-2 border rounded bg-muted/10">
              {new Date(subaccount.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Updated */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Updated At</label>
            <p className="py-2 px-2 border rounded bg-muted/10">
              {new Date(subaccount.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-between">
          {isEditing ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
