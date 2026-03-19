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
import { Registration, RegistrationModal } from "./update-modal";

interface RegistrationTableProps {
  registrations: Registration[];
}

export function RegistrationTable({ registrations }: RegistrationTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);
  const itemsPerPage = 10;

  // Filter registrations
  const filteredRegistrations = Array.isArray(registrations)
    ? registrations.filter((reg) => {
        const matchesSearch =
          reg?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg?.contactName?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || reg?.status === statusFilter.toUpperCase();

        return matchesSearch && matchesStatus;
      })
    : [];

  // Pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegistrations = filteredRegistrations.slice(
    startIndex,
    endIndex
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "bg-warning/10 text-warning border-warning/20",
      APPROVED: "bg-success/10 text-success border-success/20",
      REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return variants[status as keyof typeof variants] || variants.PENDING;
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    // In a real app, this would update the database
    console.log(`Updating registration ${id} to ${newStatus}`);
    setSelectedRegistration(null);
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company, email, or contact name..."
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Company
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Contact
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRegistrations.map((registration) => (
                <tr
                  key={registration.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-foreground">
                      {registration.companyName || "-"}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">
                    {registration.contactName}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {registration.email}
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant="outline"
                      className={getStatusBadge(registration.status)}
                    >
                      {registration.registrationType}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant="outline"
                      className={getStatusBadge(registration.status)}
                    >
                      {registration.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {new Date(registration.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRegistration(registration)}
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

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No registrations found</p>
          </div>
        )}

        {filteredRegistrations.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredRegistrations.length)} of{" "}
              {filteredRegistrations.length} results
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

      {selectedRegistration && (
        <RegistrationModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
}
