"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import FormatedAmount from "@/components/shared/formatted-amount";
import { CreateCommissionModal } from "./create-commision-modal";
import { BookingCommissionsTable } from "./commisions-table";

type Commission = {
  id: string;
  client: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  date: string;
  description: string;
};

type Ad = {
  id: string;
  platform: string;
  revenue: number;
  impressions: number;
  ctr: number;
  date: string;
};

type OtherIncome = {
  id: string;
  source: string;
  amount: number;
  category: string;
  date: string;
  description: string;
};

export default function IncomePage() {
  return (
    <div className="flex flex-col gap-6 p-6 px-4">
      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <FormatedAmount
              amount={0 as any}
              className="font-semibold text-3xl"
            />
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +12.5%
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Platform Commissions
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <FormatedAmount
                amount={0 as any}
                className="font-semibold text-3xl"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {2} active commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Incomming commisions
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <FormatedAmount
              amount={0 as any}
              className="font-semibold text-3xl"
            />
            <p className="text-xs text-muted-foreground">{1} platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Brokers Commisions
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <FormatedAmount amount={0} className="font-semibold text-3xl" />
            <p className="text-xs text-muted-foreground">{0} sources</p>
          </CardContent>
        </Card>
      </div>

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
