"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin } from "lucide-react";
import { LocationCard } from "./location-view";

interface Location {
  continent: string;
  country: string;
  city: string;
  subcity: string;
  nearby?: string;
  latitude?: string;
  longitude?: string;
}

interface Facility {
  id: string;
  name: string;
  icon?: string;
}

interface Contact {
  phone: string;
  email: string;
}

interface PropertyDetailsProps {
  location: Location;
  facilities: Facility[] | null;
  contact: Contact;
}

export default function PropertyDetails({
  location,
  facilities,
  contact,
}: PropertyDetailsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Location Card */}
      <LocationCard location={location} />
      {/* <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p>
            <span className="font-medium">Continent - </span>{" "}
            {location.continent}
          </p>
          <p>
            <span className="font-medium">Country - </span> {location.country}
          </p>
          <p>
            <span className="font-medium">City - </span> {location.city}
          </p>
          <p>
            <span className="font-medium">Subcity - </span> {location.subcity}
          </p>
          {location.nearby && (
            <p>
              <span className="font-medium">Nearby - </span> {location.nearby}
            </p>
          )}
        
        </CardContent>
      </Card> */}

      {/* Contact Card */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" /> Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4" /> {contact.phone}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> {contact.email}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
