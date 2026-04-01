"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {
  Building2, MapPin, Phone, Mail, Edit, Users,
  Bed, Calendar, Wifi, FileText, CheckCircle2, Clock, Plus, FileMinus, ArrowLeft, EyeOff,
} from "lucide-react";
import StaffsTab from "./staffs-tab";
import RoomsTab from "./rooms-tab";
import ImagesTab from "./images-tab";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { useUpdatePropertyMutation, useVoidPropertyMutation } from "@/hooks/api/use-property";
import { useAddBrokerToPropertyMutation, useRemoveStaffFromGHMutation, useGetGhStaffsQuery } from "@/hooks/api/use-staff";
import { Avatar } from "@/components/shared/avatar";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { api } from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";

interface PropertyData {
  id: string;
  name: string;
  address: string;
  type: string;
  about: { description: string };
  contact: { phone: string; email: string };
  location: { continent: string; country: string; city: string; subcity: string; nearby: string };
  facilities: Array<{ id: string; name: string; icon: string | null }>;
  rooms: Array<any>;
  bookings: Array<any>;
  staffs: Array<any>;
  license: { status: string; fileUrl: string; createdAt: string };
  images: Array<{ url: string; name: string; category?: string }>;
}

export default function PropertyView({ data }: { data: PropertyData }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [voidOpen, setVoidOpen] = useState(false);
  const [addBrokerOpen, setAddBrokerOpen] = useState(false);
  const [brokerEmail, setBrokerEmail] = useState("");
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
  const voidMutation = useVoidPropertyMutation();
  const addBrokerMutation = useAddBrokerToPropertyMutation();
  const removeStaffMutation = useRemoveStaffFromGHMutation();
  const queryClient = useQueryClient();
  const [addFacilityName, setAddFacilityName] = useState("");
  const [addFacilityOpen, setAddFacilityOpen] = useState(false);
  const [addingFacility, setAddingFacility] = useState(false);

  // Use live query for staffs so broker shows immediately after add
  const { data: liveStaffs } = useGetGhStaffsQuery({ propertyId: data.id });
  const allStaffs = liveStaffs || data.staffs || [];
  const staffMembers = allStaffs.filter((s: any) => s.role !== "BROKER");
  const brokerMembers = allStaffs.filter((s: any) => s.role === "BROKER");

  const handleAddFacility = async () => {
    if (!addFacilityName.trim()) return;
    setAddingFacility(true);
    try {
      await api.post(`/properties/${data.id}/facilities`, { name: addFacilityName.trim() });
      toast.success("Facility added");
      queryClient.invalidateQueries({ queryKey: ["guest_houses", data.id] });
      setAddFacilityName("");
      setAddFacilityOpen(false);
    } catch {
      toast.error("Failed to add facility");
    } finally {
      setAddingFacility(false);
    }
  };

  const handleSave = () => {
    updateMutation.mutate({
      id: data.id,
      data: {
        name: form.name,
        address: form.address,
        about: { description: form.description },
        contact: { phone: form.phone, email: form.email },
        location: { city: form.city, subcity: form.subcity, country: form.country, nearby: form.nearby, continent: data.location?.continent || "" },
      },
    }, { onSuccess: () => setEditOpen(false) });
  };

  const handleVoid = () => {
    voidMutation.mutate(data.id, { onSuccess: () => setVoidOpen(false) });
  };

  const handleAddBroker = () => {
    if (!brokerEmail.trim()) return toast.error("Email is required");
    addBrokerMutation.mutate(
      { propertyId: data.id, email: brokerEmail.trim() },
      { onSuccess: () => { setAddBrokerOpen(false); setBrokerEmail(""); } }
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/properties">
          <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" />Back to Properties</Button>
        </Link>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setVoidOpen(true)}>
            <EyeOff className="mr-2 h-4 w-4" /> Void Property
          </Button>
          <Button size="sm" onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Property
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Property</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-1"><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
            <div className="space-y-1 md:col-span-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="space-y-1"><Label>City</Label><Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Subcity</Label><Input value={form.subcity} onChange={e => setForm(f => ({ ...f, subcity: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Country</Label><Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Nearby</Label><Input value={form.nearby} onChange={e => setForm(f => ({ ...f, nearby: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>{updateMutation.isPending ? "Saving..." : "Save changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Void Dialog */}
      <Dialog open={voidOpen} onOpenChange={setVoidOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Void Property</DialogTitle>
            <DialogDescription>This will hide the property from the client page. It can be restored later.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVoidOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleVoid} disabled={voidMutation.isPending}>
              {voidMutation.isPending ? <Spinner /> : "Void Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Broker Dialog */}
      <Dialog open={addBrokerOpen} onOpenChange={setAddBrokerOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Broker</DialogTitle>
            <DialogDescription>Enter the email of an approved broker to assign them to this property.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Broker Email</Label>
              <Input placeholder="broker@example.com" value={brokerEmail} onChange={e => setBrokerEmail(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddBrokerOpen(false)}>Cancel</Button>
            <Button onClick={handleAddBroker} disabled={addBrokerMutation.isPending}>
              {addBrokerMutation.isPending ? <Spinner /> : "Add Broker"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard title="Staff members" value={staffMembers.length} icon={Users} />
        <DashboardCard title="Rooms" value={data.rooms.length} icon={Bed} />
        <DashboardCard title="Bookings" value={data.bookings.length} icon={Calendar} />
        <DashboardCard title="Facilities" value={data.facilities.length} icon={Wifi} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap gap-y-1 h-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="brokers">Brokers</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>About</CardTitle><CardDescription>Property description</CardDescription></CardHeader>
              <CardContent>
                <h1 className="text-2xl font-bold">{data?.name}</h1>
                <span className="text-sm text-muted-foreground">{data.location.city}, {data.location.country}</span>
                <p className="text-foreground leading-relaxed mt-2">{data.about?.description}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3"><div className="p-2 bg-muted rounded-md"><Phone className="h-4 w-4" /></div><div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{data.contact?.phone}</p></div></div>
                <div className="flex items-center gap-3"><div className="p-2 bg-muted rounded-md"><Mail className="h-4 w-4" /></div><div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{data.contact?.email}</p></div></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Location</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[["Country", data.location?.country], ["City", data.location?.city], ["Subcity", data.location?.subcity], ["Nearby", data.location?.nearby]].map(([label, val]) => (
                    <div key={label}><p className="text-sm text-muted-foreground">{label}</p><p className="font-medium">{val}</p></div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>License Status</CardTitle></CardHeader>
              {data?.license ? (
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    {data.license.status === "PENDING" ? <><Clock className="h-5 w-5 text-amber-500" /><Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending Review</Badge></> : <><CheckCircle2 className="h-5 w-5 text-emerald-500" /><Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Approved</Badge></>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><FileText className="h-4 w-4" /><span>Submitted on {new Date(data.license.createdAt).toLocaleDateString()}</span></div>
                </CardContent>
              ) : (
                <EmptyState title="No license registered" description="Add a license below." icon={<FileMinus className="h-12 w-12 text-muted-foreground" />} primaryActions={<Button size="sm"><Plus className="h-4 w-4 mr-2" />Add License</Button>} />
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Staff Tab */}
        <StaffsTab propertyId={data?.id} />

        {/* Brokers Tab */}
        <TabsContent value="brokers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Brokers</CardTitle><CardDescription>Approved brokers assigned to this property</CardDescription></div>
                <Button size="sm" onClick={() => setAddBrokerOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Broker</Button>
              </div>
            </CardHeader>
            <CardContent>
              {brokerMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No brokers assigned yet</p>
                  <Button size="sm" className="mt-4" onClick={() => setAddBrokerOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Broker</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {brokerMembers.map((broker: any) => (
                    <div key={broker.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex gap-3 items-center">
                        <Avatar name={broker.name} src={broker.image} />
                        <div>
                          <p className="font-medium">{broker.name}</p>
                          <p className="text-sm text-muted-foreground">{broker.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Broker</Badge>
                        <Button variant="ghost" size="sm" onClick={() => removeStaffMutation.mutate({ propertyId: data.id, userId: broker.id })} disabled={removeStaffMutation.isPending}>
                          {removeStaffMutation.isPending ? <Spinner /> : "Remove"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rooms */}
        <RoomsTab propertyId={data.id} />

        {/* Bookings */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader><CardTitle>Bookings</CardTitle><CardDescription>View reservations</CardDescription></CardHeader>
            <CardContent>
              {data.bookings.length === 0 ? (
                <div className="text-center py-12"><Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No bookings yet</p></div>
              ) : (
                <div className="space-y-3">
                  {data.bookings.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">{booking.guestName || booking.user?.name || "Guest"}</p>
                        <p className="text-sm text-muted-foreground">{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "â€”"} â†’ {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "â€”"}</p>
                      </div>
                      <Badge variant="outline">{booking.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facilities */}
        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Facilities</CardTitle><CardDescription>Amenities offered</CardDescription></div>
                <Button size="sm" onClick={() => setAddFacilityOpen(true)}><Wifi className="h-4 w-4 mr-2" />Add Facility</Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.facilities.length === 0 ? (
                <div className="text-center py-12"><Wifi className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No facilities added</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.facilities.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-medium">{f.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Facility Dialog */}
        <Dialog open={addFacilityOpen} onOpenChange={setAddFacilityOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Add Facility</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <Label>Facility Name</Label>
              <Input placeholder="e.g. Free Wi-Fi, Parking, Pool" value={addFacilityName} onChange={e => setAddFacilityName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddFacility()} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddFacilityOpen(false)}>Cancel</Button>
              <Button onClick={handleAddFacility} disabled={addingFacility || !addFacilityName.trim()}>
                {addingFacility ? <Spinner /> : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ImagesTab images={data.images} propertyId={data.id} />
      </Tabs>
    </div>
  );
}
