"use client";

import { useState } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Building2, MapPin, Phone, Mail, Edit, Trash2, Users,
  Bed, Calendar, Wifi, FileText, CheckCircle2, Clock, Plus, FileMinus, ArrowLeft,
} from "lucide-react";
import StaffsTab from "./staffs-tab";
import RoomsTab from "./rooms-tab";
import ImagesTab from "./images-tab";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { useUpdatePropertyMutation } from "@/hooks/api/use-property";

interface PropertyData {
  id: string;
  name: string;
  address: string;
  type: string;
  about: {
    description: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  location: {
    continent: string;
    country: string;
    city: string;
    subcity: string;
    nearby: string;
  };
  facilities: Array<{
    id: string;
    name: string;
    icon: string | null;
  }>;
  rooms: Array<any>;
  bookings: Array<any>;
  staffs: Array<any>;
  license: {
    status: string;
    fileUrl: string;
    createdAt: string;
  };
  images: Array<{
    url: string;
    name: string;
  }>;
}

export default function PropertyView({ data }: { data: PropertyData }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: data.name,
    address: data.address,
    description: data.about?.description || "",
    phone: data.contact?.phone || "",
    email: data.contact?.email || "",
    city: data.location?.city || "",
    subcity: data.location?.subcity || "",
    country: data.location?.country || "",
    nearby: data.location?.nearby || "",
  });
  const updateMutation = useUpdatePropertyMutation();

  const handleSave = () => {
    updateMutation.mutate({
      id: data.id,
      data: {
        name: form.name,
        address: form.address,
        about: { description: form.description },
        contact: { phone: form.phone, email: form.email },
        location: {
          city: form.city,
          subcity: form.subcity,
          country: form.country,
          nearby: form.nearby,
          continent: data.location?.continent || "",
        },
      },
    }, { onSuccess: () => setEditOpen(false) });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href={"/admin/properties"}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </Link>
        <Button size="sm" onClick={() => setEditOpen(true)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Property
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>City</Label>
              <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Subcity</Label>
              <Input value={form.subcity} onChange={e => setForm(f => ({ ...f, subcity: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Country</Label>
              <Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Nearby</Label>
              <Input value={form.nearby} onChange={e => setForm(f => ({ ...f, nearby: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header Section */}
      <div className="mb-8">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DashboardCard
            title="Staff members"
            value={data.staffs.length}
            icon={Users}
          />
          <DashboardCard title="Rooms" value={data.rooms.length} icon={Users} />
          <DashboardCard
            title="Bookings"
            value={data.bookings.length}
            icon={Calendar}
          />
          <DashboardCard
            title="Facilities"
            value={data.facilities.length}
            icon={Wifi}
          />
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 lg:w-auto gap-y-2 h-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
                <CardDescription>
                  Property description and details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h1 className="text-2xl font-bold text-balance text-foreground">
                  {data?.name}
                </h1>
                <span className="text-sm text-muted-foreground">
                  {data.location.city}, {data.location.country}
                </span>

                <p className="text-foreground leading-relaxed">
                  {data.about.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How to reach this property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md">
                    <Phone className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">
                      {data.contact.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md">
                    <Mail className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">
                      {data.contact.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
                <CardDescription>Property location information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium text-foreground">
                      {data.location.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium text-foreground">
                      {data.location.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Subcity</p>
                    <p className="font-medium text-foreground">
                      {data.location.subcity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nearby</p>
                    <p className="font-medium text-foreground">
                      {data.location.nearby}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>License Status</CardTitle>
                <CardDescription>
                  Property licensing information
                </CardDescription>
              </CardHeader>
              {data?.license ? (
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    {data?.license?.status === "PENDING" ? (
                      <>
                        <Clock className="h-5 w-5 text-chart-4" />
                        <Badge
                          variant="outline"
                          className="bg-chart-4/10 text-chart-4 border-chart-4/20"
                        >
                          Pending Review
                        </Badge>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-chart-2" />
                        <Badge
                          variant="outline"
                          className="bg-chart-2/10 text-chart-2 border-chart-2/20"
                        >
                          Approved
                        </Badge>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>
                      Submitted on{" "}
                      {new Date(data.license.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              ) : (
                <EmptyState
                  title="There is no registered license"
                  description="You can add a new license using the button below."
                  icon={
                    <FileMinus className="h-12 w-12 text-muted-foreground" />
                  }
                  primaryActions={
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => console.log("Add License clicked")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add License
                    </Button>
                  }
                />
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage the settings here</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        {/* staffs */}
        <StaffsTab propertyId={data?.id} />

        {/* Rooms Tab */}
        <RoomsTab propertyId={data.id} />

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bookings</CardTitle>
                  <CardDescription>
                    View and manage reservations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {data.bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    No bookings yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your bookings will appear here once guests make reservations
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.bookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {booking.guestName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.checkIn} - {booking.checkOut}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facilities Tab */}
        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Facilities</CardTitle>
                  <CardDescription>
                    Amenities and services offered
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Wifi className="h-4 w-4 mr-2" />
                  Add Facility
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.facilities.length === 0 ? (
                <div className="text-center py-12">
                  <Wifi className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    No facilities added
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add facilities to showcase your amenities
                  </p>
                  <Button variant="outline">Add Facility</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.facilities.map((facility) => (
                    <div
                      key={facility.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground">
                          {facility.name}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <ImagesTab images={data.images} propertyId={data.id} />
      </Tabs>
    </div>
  );
}
