"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Shield,
  Briefcase,
  Home,
  UserCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUsersStats } from "@/hooks/api/use-users";

export default function UserStatsCards() {
  const { data, isFetching, error } = useGetUsersStats();

  if (isFetching)
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="w-full aspect-video" />
        ))}
      </div>
    );

  if (error) return <p>Error loading stats.</p>;
  if (!data) return null;

  const stats = [
    { title: "Total Users", value: data.totalUsers, icon: Users },
    { title: "Verified Users", value: data.verifiedUsers, icon: UserCheck },
    { title: "Unverified Users", value: data.unverifiedUsers, icon: UserPlus },
    { title: "Banned Users", value: data.bannedUsers, icon: UserX },
    { title: "Admins", value: data.totalAdmins, icon: Shield },
    { title: "Staffs", value: data.totalStaffs, icon: Briefcase },
    { title: "Owners", value: data.totalOwners, icon: Home },
    { title: "Brokers", value: data.totalBrokers, icon: UserCircle },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 pt-6">
      {stats.map((s) => (
        <Card key={s.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
            <s.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{s.value ?? 0}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
