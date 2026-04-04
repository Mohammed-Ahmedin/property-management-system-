"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCommissionModal } from "./create-commision-modal";
import { BookingCommissionsTable } from "./commisions-table";

export default function IncomePage() {
  return (
    <div className="flex flex-col gap-6 p-6 px-4">
      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Booking Commissions</CardTitle>
              <CardDescription>
                Track commissions from booking platforms
              </CardDescription>
            </div>

            <CreateCommissionModal />
          </div>
        </CardHeader>

        <BookingCommissionsTable />
      </Card>
    </div>
  );
}
