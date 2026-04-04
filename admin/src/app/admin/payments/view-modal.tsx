"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Payment } from "@/types/payments.type";
import { motion } from "framer-motion";
import { CreditCard, Phone, Calendar, Hash } from "lucide-react";

interface PaymentViewModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentViewModal({
  payment,
  isOpen,
  onClose,
}: PaymentViewModalProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "bg-amber-100 text-amber-800 border-amber-200",
      SUCCESS: "bg-emerald-100 text-emerald-800 border-emerald-200",
      FAILED: "bg-red-100 text-red-800 border-red-200",
      CANCELLED: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return variants[status as keyof typeof variants] || variants.PENDING;
  };

  if (!payment) return null;

  const details = [
    { label: "Booking ID", value: payment.bookingId },
    { label: "Amount", value: `ETB ${payment.amount ?? "-"}` },
    { label: "Phone", value: payment.phoneNumber ?? "-" },
    { label: "Method", value: payment.method },
    { label: "Transaction Ref", value: payment.transactionRef ?? "-" },
    { label: "Transaction ID", value: payment.transactionId ?? "-" },
    { label: "Metadata", value: payment.metadata ?? "-" },
    {
      label: "Status",
      value: (
        <Badge variant="outline" className={getStatusBadge(payment.status)}>
          {payment.status}
        </Badge>
      ),
    },
    {
      label: "Created",
      value: new Date(payment.createdAt).toLocaleString(),
    },
    {
      label: "Updated",
      value: new Date(payment.updatedAt).toLocaleString(),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-0 rounded-2xl shadow-lg border border-border">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Payment Details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            A summary of the selected payment transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {details.map((item, idx) => (
            <div
              key={idx}
              className="bg-muted/30 border border-border rounded-xl p-3 hover:bg-muted/50 transition-colors"
            >
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="font-medium text-foreground mt-1 break-all">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <DialogFooter className="p-4 border-t flex justify-end bg-muted/20">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
