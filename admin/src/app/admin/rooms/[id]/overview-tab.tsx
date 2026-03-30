"use client";

import { useState } from "react";
d, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { S/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Bed, Users, Maximize, Calendar, Edit } from "lucide-react";
import { useUpdateRoomMutation } from "@/hooks/api/use-rooms";

interface OverviewTabProps { room: any }

export function OverviewTab({ room }: OverviewTabProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: room.name || "",
    type: room.type || "",
    price: room.price?.toString() || "",
    description: room.description || "",
    maxOccupancy: room.maxOccupancy?.toString() || "",
    squareMeters: room.squareMeters?.toString() || "",
    availability: room.availability ?? true,
  });
  const updateMutation = useUpdateRoomMutation();

  const handleSave = () => {
    updateMutation.mutate({
      id: room.id,
      data: {
        name: form.name,
        type: form.type,
        price: Number(form.price),
escription,
        maxOccupancy: Number(form.maxOccupancy),
        squareMeters: Number(form.squareMeters),
        availability: form.availability,
      },
    }, { onSuccess: () => setEditOpen(false) });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setEditOpen(true)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Room
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <Dialo>
          </DialogHeader>
          <div classNals-2 gap-4 py-2">
            <div className="space-y-1 col-span-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <Input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Price (ETB/night)</Label>
               type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Max Occupancy</Label>
              <Input type="number" value={form.maxOccupancy} onChange={e => setForm(f => ({ ...f, maxOccupancy: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Size (m²)</Label>
              <Input type="number" value={form.squareMeters} onChangorm(f => ({ ...f, squareMeters: e.target.value }))} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex items-center gap-3 col-span-2">
              <Switch checked={form.availability} onCheckedChange={v => setForm(f => ({ ...f, availability: v }))} />
              <Label>Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button /Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
            <CardDescription>Basic information about this room</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bed className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Room Type</p>
                <p className="font-medium">{room.type}</p>
              </div>
            </div>

        </Card>
      </div>
    </>
  );
}
iv>
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm text-muted-foreground">Features</p>
                <p className="text-3xl font-bold">{room._count.features}</p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm text-muted-foreground">Services</p>
                <p className="text-3xl font-bold">{room._count.services}</p>
              </div>
            </div>
          </CardContent>  <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Room usage and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-3xl font-bold">{room._count.bookings}</p>
              </ddiv className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(room.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{new Date(room.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

      information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {room.description || "No description available for this room."}
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Room ID</span>
                <span className="font-mono">{room.roomId}</span>
              </div>
              <rimary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={room.availability ? "default" : "secondary"}>
                  {room.availability ? "Available" : "Occupied"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>Room description and additional ded-lg bg-primary/10">
                <Maximize className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Room Size</p>
                <p className="font-medium">{room.squareMeters} m²</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-p     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Max Occupancy</p>
                <p className="font-medium">{room.maxOccupancy} guests</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center roun            <div className="flex items-center gap-3">
         