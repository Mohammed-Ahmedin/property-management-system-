"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Payment } from "@/types/payments.type";
import { PaymentViewModal } from "./view-modal";
import FormatedAmount from "@/components/shared/formatted-amount";

export function PaymentTable({ payments }: { payments: Payment[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const itemsPerPage = 10;

  // Filter payments
  const filteredPayments = Array.isArray(payments)
    ? payments.filter((p) => {
        const matchesSearch =
          p.bookingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.transactionRef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phoneNumber?.includes(searchQuery);

        const matchesStatus =
          statusFilter === "all" || p.status === statusFilter.toUpperCase();

        return matchesSearch && matchesStatus;
      })
    : [];

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "bg-warning/10 text-warning border-warning/20",
      SUCCESS: "bg-success/10 text-success border-success/20",
      FAILED: "bg-destructive/10 text-destructive border-destructive/20",
      CANCELLED: "bg-muted text-muted-foreground border-border",
    };
    return variants[status as keyof typeof variants] || variants.PENDING;
  };

  return (
    <>
      <Card className="pt-0 p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by booking ID, transaction ref, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="min-w-[700px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Booking ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Phone
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Method
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Created
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-xs font-mono">{p.bookingId?.slice(0, 10)}...</td>
                  <td className="py-4 px-4">
                    <FormatedAmount
                      amount={p.amount || 0}
                      className="text-sm text-foreground"
                    />
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {p.phoneNumber ?? "-"}
                  </td>
                  <td className="py-4 px-4">{p.method}</td>
                  <td className="py-4 px-4">
                    <Badge
                      variant="outline"
                      className={getStatusBadge(p.status)}
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPayment(p)}
                    >
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Empty state */}
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No payments found</p>
          </div>
        )}

        {/* Pagination */}
        {filteredPayments.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredPayments.length)} of{" "}
              {filteredPayments.length} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
      {/* Payment Modal */}
      <PaymentViewModal
        payment={selectedPayment}
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />{" "}
    </>
  );
}
