"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ArrowLeft, Users } from "lucide-react";
import { OverviewTab } from "./overview-tab";
import { ServicesTab } from "./services-tab";
import { BookingTab } from "./booking-tab";
import { ImagesTab } from "./images-tab";
import { FeaturesTab } from "./features-tab";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleRoomQuery } from "@/hooks/api/use-rooms";
import LoaderState from "@/components/shared/loader-state";

export default function RoomPage() {
  const router = useRouter();
  const { id }: any = useParams();
  const {
    data: roomData,
    isError,
    isFetching,
  } = useGetSingleRoomQuery({
    id: id,
  });

  if (isFetching) {
    return <LoaderState />;
  }

  if (isError) {
    return (
      <div className="w-[100%] h-[400px] grid place-content-center">
        <h2>Some error occured please try again</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => router.push("/admin/rooms")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rooms
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab room={roomData} />
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab roomId={roomData.id} />
          </TabsContent>

          <TabsContent value="images">
            <ImagesTab images={roomData.images} roomId={roomData.id} />
          </TabsContent>

          <TabsContent value="features">
            <FeaturesTab features={roomData.features} roomId={roomData.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
