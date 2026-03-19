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
import { SubAccount } from "@/types/subaccount.type";
import { SubaccountViewModal } from "./view-modal";

interface SubaccountTableProps {
  subaccounts: SubAccount[];
}

export function SubaccountTable({ subaccounts }: SubaccountTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubaccount, setSelectedSubaccount] =
    useState<SubAccount | null>(null);

  const itemsPerPage = 10;

  // Filter subaccounts
  const filteredSubaccounts = Array.isArray(subaccounts)
    ? subaccounts.filter((sub) => {
        const matchesSearch =
          sub?.accountName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub?.businessName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          sub?.accountNumber?.includes(searchQuery);

        const matchesStatus =
          statusFilter === "all" || sub?.status === statusFilter.toUpperCase();

        return matchesSearch && matchesStatus;
      })
    : [];

  // Pagination
  const totalPages = Math.ceil(filteredSubaccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubaccounts = filteredSubaccounts.slice(startIndex, endIndex);

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

  const handleStatusUpdate = (id: string, newStatus: string) => {
    console.log(`Updating subaccount ${id} to ${newStatus}`);
    setSelectedSubaccount(null);
  };

  return (
    <>
      <Card className="p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by account name, business, or account number..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Account Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Business
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Account Number
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Bank Code
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Type
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
              {currentSubaccounts.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium">{sub.accountName}</td>
                  <td className="py-4 px-4 text-sm text-foreground">
                    {sub.businessName || "-"}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {sub.accountNumber}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {sub.bankCode}
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className="bg-muted/10">
                      {sub.type}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant="outline"
                      className={getStatusBadge(sub.status)}
                    >
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSubaccount(sub)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredSubaccounts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No subaccounts found</p>
          </div>
        )}

        {/* Pagination */}
        {filteredSubaccounts.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredSubaccounts.length)} of{" "}
              {filteredSubaccounts.length} results
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

      {/* Modal */}
      <SubaccountViewModal
        subaccount={selectedSubaccount}
        isOpen={!!selectedSubaccount}
        onClose={() => setSelectedSubaccount(null)}
        onSave={(updated) => {
          console.log("Updated subaccount data:", updated);
          // Call API here to save changes if needed
        }}
      />
    </>
  );
}
