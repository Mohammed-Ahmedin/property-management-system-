"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Globe, Navigation } from "lucide-react";

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
  propertyId: string;
  icon: string | null;
}

interface Contact {
  phone: string;
  email: string;
}

interface PropertyDetailsProps {
  location: Location;
  facilities: Facility[];
  contact: Contact;
}

export default function PropertyDetails({
  location,
  facilities,
  contact,
}: PropertyDetailsProps) {
  return (
    <main className="w-full min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2 text-balance">
            Property Details
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive information about location, facilities, and contact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Location Card */}
          <Card className="md:col-span-2 lg:col-span-1 border-border hover:border-primary/50 transition-colors duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-sm text-muted-foreground">
                    Continent
                  </span>
                  <span className="text-foreground font-medium">
                    {location.continent}
                  </span>
                </div>
                <div className="h-px bg-border" />

                <div className="flex justify-between items-start">
                  <span className="font-semibold text-sm text-muted-foreground">
                    Country
                  </span>
                  <span className="text-foreground font-medium">
                    {location.country}
                  </span>
                </div>
                <div className="h-px bg-border" />

                <div className="flex justify-between items-start">
                  <span className="font-semibold text-sm text-muted-foreground">
                    City
                  </span>
                  <span className="text-foreground font-medium">
                    {location.city}
                  </span>
                </div>
                <div className="h-px bg-border" />

                <div className="flex justify-between items-start">
                  <span className="font-semibold text-sm text-muted-foreground">
                    Subcity
                  </span>
                  <span className="text-foreground font-medium">
                    {location.subcity}
                  </span>
                </div>

                {location.nearby && (
                  <>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sm text-muted-foreground">
                        Nearby
                      </span>
                      <span className="text-foreground font-medium text-right">
                        {location.nearby}
                      </span>
                    </div>
                  </>
                )}

                {location.latitude && location.longitude && (
                  <>
                    <div className="h-px bg-border" />
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Navigation className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-muted-foreground">
                          COORDINATES
                        </span>
                      </div>
                      <p className="text-sm text-foreground font-mono bg-muted/50 p-2 rounded">
                        {location.latitude}, {location.longitude}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="md:col-span-2 lg:col-span-1 border-border hover:border-primary/50 transition-colors duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href={`tel:${contact.phone}`}
                className="group block p-3 rounded-lg bg-muted/50 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground">
                      PHONE
                    </p>
                    <p className="text-foreground font-semibold group-hover:text-primary transition-colors truncate">
                      {contact.phone}
                    </p>
                  </div>
                </div>
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="group block p-3 rounded-lg bg-muted/50 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground">
                      EMAIL
                    </p>
                    <p className="text-foreground font-semibold group-hover:text-primary transition-colors truncate">
                      {contact.email}
                    </p>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>

          {/* Facilities Card - Full Width */}
          <Card className="md:col-span-2 lg:col-span-3 border-border hover:border-primary/50 transition-colors duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                Available Facilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {facilities.length > 0 ? (
                  facilities.map((facility) => (
                    <Badge
                      key={facility.id}
                      variant="secondary"
                      className="px-3 py-2 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors capitalize"
                    >
                      {facility.icon && (
                        <span className="mr-2 text-base">{facility.icon}</span>
                      )}
                      {facility.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No facilities listed
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
